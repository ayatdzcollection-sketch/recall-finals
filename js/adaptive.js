/* ============================================================
   adaptive.js, the local, offline "For You" engine.
   After every answer it updates three models and re-plans:
     • forgetting  , each item's memory stability → recall-probability now
     • difficulty  , each item's Elo rating (rises when strong students miss it)
     • skill       , your Elo per subject (rises when you beat hard items)
   next() scores every question by urgency × importance × weakness ×
   about-to-forget × coverage × difficulty-fit × variety, then samples.
   Nothing leaves the device.
   ============================================================ */
(function (STUDY) {
  "use strict";
  const HOUR = 3600000, DAY = 86400000;
  const clamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
  const sig = (x) => 1 / (1 + Math.exp(-x));

  const ADAPT = {};

  // ---- candidate pool (gradeable questions only), cached ----
  let POOL = null;
  function pool() {
    if (POOL) return POOL;
    POOL = [];
    STUDY.allQuestions(function (q) { return q.type === "mc" || q.type === "tf" || q.type === "fill"; }).forEach(q => POOL.push(q));
    (STUDY.FR_LISTEN || []).forEach(q => POOL.push(q));
    return POOL;
  }
  ADAPT.invalidate = function () { POOL = null; };

  // ---- forgetting model (single source: storage.recallNow) ----
  function recall(st, now) { return STUDY.recallNow ? STUDY.recallNow(st, now) : (st && st.last ? Math.pow(2, -((now - st.last) / HOUR) / (st.stability || 1)) : 1); }
  ADAPT.recall = recall;

  // fast-answer thresholds (ms) → "knew it cold"
  const FAST = { mc: 4500, tf: 3500, fill: 9000, listen: 6500 };

  // ---- update after one answer ----
  // correct: bool, rtMs: response time, guess: user flagged "lucky guess", mode: log label
  // chosen: original index of the option picked (for misconception radar; optional)
  ADAPT.update = function (q, correct, rtMs, guess, mode, chosen) {
    const store = STUDY.store();
    const type = q.type || "mc";

    // --- self-calibrated response time → fluency (0..1) ---
    // "Fast" is relative to YOUR own rolling pace per question type, not a fixed
    // threshold, so a naturally slow reader isn't punished and a speed-reader
    // isn't over-credited. A baseline seeds near the old threshold, then adapts.
    store.rtBase = store.rtBase || {};
    const base = store.rtBase[type] || (FAST[type] || 5000) * 1.1;
    let fluency = 0.5;
    if (rtMs) {
      fluency = clamp(1.25 - 0.75 * (rtMs / base), 0, 1);   // ~0.33×base→1, 1×→0.5, 1.67×→0
      const floorMs = type === "fill" ? 1200 : 700;
      if (rtMs < floorMs) fluency = Math.min(fluency, 0.35); // too quick to have read it → suspicious
      if (rtMs >= floorMs && rtMs < 60000) store.rtBase[type] = base * 0.85 + rtMs * 0.15;
    }

    // --- Elo expectation: how likely you were EXPECTED to get this right ---
    const skill = store.subjectSkill[q.subjectId] || 1500;
    const pre = store.srs[q.id];
    const diff = pre && pre.diff ? pre.diff : 1500;
    const expct = 1 / (1 + Math.pow(10, (diff - skill) / 400));

    // --- effective grade for spacing (fluency-based, with a guess flag) ---
    let grade;
    if (!correct) grade = 0;
    else if (guess) grade = 1;
    else if (fluency >= 0.62) grade = 3;
    else grade = 2;

    const meta = { mode: mode || "feed", rt: rtMs || 0, fluency: fluency, pexp: expct };
    if (typeof chosen === "number") meta.chosen = chosen;
    STUDY.recordItem(q.id, grade, q.topicId, meta);   // scheduling + honest mastery + log
    const st = store.srs[q.id];                        // now exists
    st.rt = rtMs || st.rt || 0;

    // --- Elo: item difficulty + your subject skill ---
    const actual = grade >= 2 ? 1 : grade === 1 ? 0.5 : 0;
    st.diff = clamp(diff + 24 * (expct - actual), 600, 2400);
    store.subjectSkill[q.subjectId] = clamp(skill + 28 * (actual - expct), 600, 2400);

    STUDY.save();
    return { grade: grade, fast: fluency >= 0.62, fluency: fluency };
  };

  // ---- per-item "would you get this right on the exam, right now" ----
  function pCorrect(q, now) {
    const store = STUDY.store();
    const st = store.srs[q.id];
    const skill = store.subjectSkill[q.subjectId] || 1500;
    const diff = st ? st.diff : 1500;
    const expct = 1 / (1 + Math.pow(10, (diff - skill) / 400));
    if (!st) return { expct: expct, recall: 1, seen: false, ready: 0.0, p: expct };
    const r = recall(st, now);
    return { expct: expct, recall: r, seen: true, ready: clamp(expct * r, 0, 1), p: expct * r };
  }

  // ---- urgency from exam date (nearer exam = higher) ----
  function urgency(subjectId) {
    const days = STUDY.daysToExam(subjectId);
    return 1 + 3 / (1 + Math.max(0, days));        // today→4×, a week out→~1.4×
  }

  function weightedPick(arr) {
    let sum = 0; for (let i = 0; i < arr.length; i++) sum += arr[i].w;
    if (sum <= 0) return arr.length ? arr[0].v : null;
    let r = Math.random() * sum;
    for (let i = 0; i < arr.length; i++) { r -= arr[i].w; if (r <= 0) return arr[i].v; }
    return arr[arr.length - 1].v;
  }

  // per-subject accuracy + coverage (drives subject-level priority)
  function subjectStat(s) {
    const store = STUDY.store();
    let att = 0, cor = 0, total = 0, unseen = 0;
    s.topics.forEach(function (t) {
      const st = store.stats[t.id]; if (st) { att += st.attempts; cor += st.correct; }
      (t.questions || []).forEach(function (q) { if (q.type === "match") return; total++; if (!store.srs[q.id]) unseen++; });
    });
    return { acc: att > 0 ? cor / att : 0.5, attempts: att, coverage: total ? unseen / total : 0 };
  }

  // ---- pick the next item: (1) choose a subject by priority, (2) best item in it ----
  // Two-stage so bank size never biases the mix, a weak/urgent subject wins
  // even if another subject has 5× the questions.
  ADAPT.next = function (ctx) {
    ctx = ctx || { recent: [], lastTopic: null, lastSubject: null };
    const now = Date.now(), store = STUDY.store();
    const explore = Math.random() < 0.13;

    // (1) choose a subject — unless the feed is scoped to one (ctx.only)
    let subj;
    if (ctx.only) {
      subj = STUDY.byId[ctx.only] || STUDY.subjects[0];
    } else {
      const subScores = STUDY.subjects.map(function (s) {
        const ss = subjectStat(s);
        const weakness = clamp(1.15 - ss.acc, 0.2, 1);          // low accuracy → high
        const imp = 0.6 + s.weight * 0.12;                       // ELA(5)→1.2 … History(2)→0.84
        const urg = urgency(s.id);                               // nearer exam → higher
        let sc = imp * urg * (0.2 + 1.3 * weakness) * (1 + 0.3 * ss.coverage);
        if (explore) sc = imp * (0.8 + Math.random());           // flatten for coverage
        sc *= (s.id === ctx.lastSubject ? 0.55 : 1) * (0.7 + Math.random() * 0.6);
        return { v: s, w: Math.max(0.0001, sc) };
      });
      subj = weightedPick(subScores) || STUDY.subjects[0];
    }

    // (2) best item within that subject
    const cands = pool().filter(q => q.subjectId === subj.id && ctx.recent.indexOf(q.id) < 0);
    if (!cands.length) { const all = pool(); return all[Math.floor(Math.random() * all.length)] || null; }
    const scored = cands.map(function (q) {
      const pc = pCorrect(q, now);
      const tp = STUDY.topicProgress(q.topicId);
      const weakness = clamp(1 - (tp ? tp.mastery : 0), 0, 1);
      const forget = pc.seen ? (1 - pc.recall) : 0;
      const cover = pc.seen ? 1 : 1.8;
      const wrongB = store.wrong[q.id] ? 1.6 : 1;
      const succ = pc.seen ? pc.p : pc.expct;
      const desir = Math.exp(-Math.pow(succ - 0.78, 2) / (2 * 0.22 * 0.22));   // desirable difficulty
      let sc = cover * wrongB * (0.4 + 0.9 * desir) * (0.6 + 1.6 * forget) * (explore ? (0.7 + 0.6 * Math.random()) : (0.5 + weakness));
      if (q.topicId === ctx.lastTopic) sc *= 0.3;              // interleave topics
      sc *= 0.6 + Math.random() * 0.8;
      return { v: q, w: Math.max(0.0001, sc) };
    });
    scored.sort((a, b) => b.w - a.w);
    return weightedPick(scored.slice(0, Math.min(25, scored.length))) || scored[0].v;
  };

  // ---- readiness %, concept-based, so it climbs without acing all 739 items ----
  // Each topic is "ready" once you've mastered ~6 of its questions; a subject's
  // readiness is the average over its topics (untouched topics count as 0).
  ADAPT.readiness = function (subjectId) {
    const subj = STUDY.byId[subjectId]; if (!subj) return 0;
    let sum = 0, n = 0;
    subj.topics.forEach(function (t) {
      const items = (t.questions || []).filter(q => q.type !== "match");
      if (!items.length) return;
      let mastered = 0, attempted = 0;
      items.forEach(function (q) { const m = STUDY.itemMastery(q.id); if (m > 0) attempted++; if (m >= 0.55) mastered++; });
      const target = Math.min(items.length, 6);
      const depth = clamp((mastered + 0.25 * Math.min(attempted - mastered, target)) / target, 0, 1);
      sum += depth; n++;
    });
    return n ? Math.round(sum / n * 100) : 0;
  };
  ADAPT.overallReadiness = function () {
    let s = 0, n = 0;
    STUDY.subjects.forEach(function (subj) { s += ADAPT.readiness(subj.id); n++; });
    return n ? Math.round(s / n) : 0;
  };

  /* ============================================================
     EXAM-DAY FORECASTER + STUDY PLANNER
     Projects each item's recall forward to exam day and rolls it up into a
     predicted score per subject, then allocates your study minutes to where
     they'll lift that score the most (importance × urgency × gap).
     ============================================================ */
  function guessFloor(q) {
    if (q.type === "mc" && q.choices) return 1 / q.choices.length;
    if (q.type === "tf") return 0.5;
    if (q.type === "fill") return 0.05;
    return 0.2;
  }
  // probability you'd answer q correctly ON exam day (no further study)
  function pExamAt(q, examMs) {
    const store = STUDY.store();
    const st = store.srs[q.id];
    const skill = store.subjectSkill[q.subjectId] || 1500;
    const diff = st ? (st.diff || 1500) : 1500;
    const expct = 1 / (1 + Math.pow(10, (diff - skill) / 400));
    const g = guessFloor(q);
    if (!st) return g + (1 - g) * expct * 0.45;          // unseen: a little credit for reasoning
    const r = recall(st, examMs);                         // projected retention at exam time
    const know = (typeof st.kn === "number") ? st.kn : Math.min(1, (st.box || 0) / 4);
    const skillP = expct * r;                             // performance from skill + retention
    const knowP = know * r;                               // honest-mastery view, also decays
    const p = 0.5 * skillP + 0.5 * knowP;
    return clamp(g + (1 - g) * p, 0, 1);                  // floor at guess level
  }
  function examMsFor(subjectId) {
    const days = STUDY.daysToExam(subjectId);
    return Date.now() + Math.max(0, days) * DAY;
  }
  // predicted exam score for a subject.
  // topicScore = prior + (how well you know what you studied − prior) × coverage,
  // where coverage saturates after ~8 studied items/topic (the exam samples, it
  // doesn't test all 300+ items), so studying actually moves the number, and
  // pExamAt already decays studied items toward exam day (cramming-then-forgetting
  // is penalised). Topic-balanced so a big question bank can't skew it.
  const UNSEEN_PRIOR = 0.33;        // cold: ~guess + a little elimination
  ADAPT.forecast = function (subjectId) {
    const subj = STUDY.byId[subjectId]; if (!subj) return 0;
    const store = STUDY.store(), examMs = examMsFor(subjectId);
    let sum = 0, n = 0;
    subj.topics.forEach(function (t) {
      const items = (t.questions || []).filter(q => q.type !== "match");
      if (!items.length) return;
      let acc = 0, studied = 0;
      items.forEach(function (q) { if (store.srs[q.id]) { acc += pExamAt(q, examMs); studied++; } });
      const studiedAcc = studied ? acc / studied : UNSEEN_PRIOR;
      const coverage = clamp(studied / Math.min(items.length, 8), 0, 1);
      sum += UNSEEN_PRIOR + (studiedAcc - UNSEEN_PRIOR) * coverage; n++;
    });
    return n ? Math.round(sum / n * 100) : 0;
  };
  ADAPT.overallForecast = function () {
    let s = 0, w = 0;
    STUDY.subjects.forEach(function (subj) { const wt = subj.weight || 1; s += ADAPT.forecast(subj.id) * wt; w += wt; });
    return w ? Math.round(s / w) : 0;
  };
  // count of seen items predicted to be shaky (below thresh) at exam time
  ADAPT.shakyCount = function (subjectId, thresh) {
    const subj = STUDY.byId[subjectId]; if (!subj) return 0;
    const store = STUDY.store(), examMs = examMsFor(subjectId), th = thresh || 0.6;
    let c = 0;
    subj.topics.forEach(function (t) {
      (t.questions || []).forEach(function (q) {
        if (q.type === "match") return;
        if (store.srs[q.id] && pExamAt(q, examMs) < th) c++;
      });
    });
    return c;
  };
  // the shakiest SEEN items in a subject (for a last-day rescue session)
  ADAPT.shakyItems = function (subjectId, limit) {
    const subj = STUDY.byId[subjectId]; if (!subj) return [];
    const store = STUDY.store(), examMs = examMsFor(subjectId), out = [];
    subj.topics.forEach(function (t) {
      (t.questions || []).forEach(function (q) {
        if (q.type === "match" || !store.srs[q.id]) return;
        out.push({ q: q, p: pExamAt(q, examMs) });
      });
    });
    out.sort((a, b) => a.p - b.p);
    return out.slice(0, limit || 30).map(x => x.q);
  };
  // allocate `minutes` across subjects by importance × urgency × gap-to-target
  ADAPT.studyPlan = function (minutes) {
    const total = minutes || 60, target = 85;
    let soonest = 99;
    const rows = STUDY.subjects.map(function (s) {
      const f = ADAPT.forecast(s.id);
      const days = STUDY.daysToExam(s.id); if (days < soonest) soonest = days;
      const gap = clamp((target - f) / target, 0, 1);
      const urg = 1 + 3 / (1 + Math.max(0, days));
      const imp = 0.6 + (s.weight || 1) * 0.12;
      const priority = imp * urg * (0.12 + gap);
      return { id: s.id, name: s.name, icon: s.icon, weight: s.weight, forecast: f, shaky: ADAPT.shakyCount(s.id), priority: priority, minutes: 0 };
    });
    const sum = rows.reduce((a, b) => a + b.priority, 0) || 1;
    let used = 0;
    rows.forEach(function (r) { r.minutes = Math.max(0, Math.round((r.priority / sum) * total / 5) * 5); used += r.minutes; });
    rows.sort((a, b) => b.priority - a.priority);
    return { minutes: total, mode: soonest <= 1 ? "final" : "build", soonest: soonest, overall: ADAPT.overallForecast(), rows: rows };
  };

  STUDY.ADAPT = ADAPT;
})(window.STUDY);
