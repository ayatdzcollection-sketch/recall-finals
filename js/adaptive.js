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

  // fast-answer thresholds (ms) → seed for the self-calibrated baseline
  const FAST = { mc: 4500, tf: 3500, fill: 9000, listen: 6500 };

  /* ---- Glicko-style ability per subject (rating + uncertainty RD) ----
     Replaces the old unbounded Elo skill. Updates scale with RD: large & fast
     while uncertain (early), small & stable once confident. RD regrows slowly
     over time (you may have forgotten), so estimates stay honest. */
  const Q = Math.LN10 / 400;                 // ≈ 0.0057565
  const RD_MAX = 350, RD_MIN = 30;
  const RD_C2 = (RD_MAX * RD_MAX) / (90 * DAY);   // variance regrowth per ms (~full re-widen after 90 idle days)
  function gFactor(rd) { return 1 / Math.sqrt(1 + 3 * Q * Q * rd * rd / (Math.PI * Math.PI)); }
  function glickoState(subjectId) {
    const store = STUDY.store();
    if (!store.glicko) store.glicko = {};
    return store.glicko[subjectId] || (store.glicko[subjectId] = { r: 1500, rd: RD_MAX, t: 0 });
  }
  ADAPT.abilityOf = function (subjectId) { return glickoState(subjectId).r; };
  ADAPT.rdOf = function (subjectId) { return glickoState(subjectId).rd; };
  // one result s∈{0,0.5,1} against an item of rating oppRating; mutates + returns state
  function glickoUpdate(subjectId, oppRating, s, now) {
    const gl = glickoState(subjectId);
    const dt = gl.t ? Math.max(0, now - gl.t) : 0;
    let rd = Math.min(RD_MAX, Math.sqrt(gl.rd * gl.rd + RD_C2 * dt));   // uncertainty regrows with time away
    const g = gFactor(50);                     // item rating treated as fairly certain
    const E = 1 / (1 + Math.pow(10, -g * (gl.r - oppRating) / 400));
    const dInv = Q * Q * g * g * E * (1 - E);
    const denom = 1 / (rd * rd) + dInv;
    gl.r = clamp(gl.r + (Q / denom) * g * (s - E), 600, 2400);
    gl.rd = clamp(Math.sqrt(1 / denom), RD_MIN, RD_MAX);
    gl.t = now;
    STUDY.store().subjectSkill[subjectId] = gl.r;   // keep mirror for any legacy reader
    return gl;
  }

  // ---- update after one answer ----
  // correct: bool, rtMs: response time, guess: user flagged "lucky guess", mode: log label
  // chosen: original index of the option picked (for misconception radar; optional)
  ADAPT.update = function (q, correct, rtMs, guess, mode, chosen, level) {
    const store = STUDY.store();
    const type = q.type || "mc";

    // --- self-calibrated response time → fluency (0..1) ---
    // "Fast" is relative to YOUR own rolling pace per question type, not a fixed
    // threshold, so a naturally slow reader isn't punished and a speed-reader
    // isn't over-credited. A baseline seeds near the old threshold, then adapts.
    store.rtBase = store.rtBase || {};
    const base = store.rtBase[type] || (FAST[type] || 5000) * 1.1;
    const pre = store.srs[q.id];
    const priorKn = pre && typeof pre.kn === "number" ? pre.kn : 0;
    let fluency = 0.5;
    if (rtMs) {
      fluency = clamp(1.25 - 0.75 * (rtMs / base), 0, 1);   // ~0.33×base→1, 1×→0.5, 1.67×→0
      // content-aware "too fast" guard: only suspicious if you answered faster than
      // you could plausibly READ it AND you haven't already proven you know it.
      // (Position reshuffle + distractor variation already block pattern memorising,
      //  so genuine fast recall on a known item gets full credit.)
      if (rtMs < minReadMs(q) && priorKn < 0.7) fluency = Math.min(fluency, 0.4);
      if (rtMs > 400 && rtMs < 60000) store.rtBase[type] = base * 0.85 + rtMs * 0.15;
    }

    // --- expectation from your Glicko ability vs this item's difficulty ---
    const ability = ADAPT.abilityOf(q.subjectId);
    const diff = pre && pre.diff ? pre.diff : STUDY.seedDiff(q);
    const expct = 1 / (1 + Math.pow(10, (diff - ability) / 400));

    // --- effective grade for spacing (fluency-based, with a guess flag) ---
    let grade;
    if (!correct) grade = 0;
    else if (guess) grade = 1;
    else if (fluency >= 0.62) grade = 3;
    else grade = 2;

    const meta = { mode: mode || "feed", rt: rtMs || 0, fluency: fluency, pexp: expct, level: level || 0 };
    if (typeof chosen === "number") meta.chosen = chosen;
    STUDY.recordItem(q.id, grade, q.topicId, meta);   // scheduling + honest mastery + log
    const st = store.srs[q.id];                        // now exists
    st.rt = rtMs || st.rt || 0;

    // --- ratings: Glicko ability (uncertainty-aware) + item difficulty (Elo) ---
    const s = grade >= 2 ? 1 : grade === 1 ? 0.5 : 0;
    glickoUpdate(q.subjectId, diff, s, Date.now());
    st.diff = clamp(diff + 22 * (expct - s), 600, 2400);

    STUDY.save();
    return { grade: grade, fast: fluency >= 0.62, fluency: fluency };
  };

  // plausible minimum time to have actually read a question + skim its options
  function minReadMs(q) {
    const stem = (q.q || "").length;
    let opt = 0; (q.choices || []).forEach(c => { opt += String(c).length; });
    const chars = stem + opt * 0.5;          // you skim options, don't fully read all
    return clamp(300 + chars * 11, 350, 7000);
  }

  // ---- per-item "would you get this right on the exam, right now" ----
  function pCorrect(q, now) {
    const store = STUDY.store();
    const st = store.srs[q.id];
    const ability = ADAPT.abilityOf(q.subjectId);
    const diff = st && st.diff ? st.diff : STUDY.seedDiff(q);
    const expct = 1 / (1 + Math.pow(10, (diff - ability) / 400));
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

  // a class whose exam you've marked done is dropped from the mixed feed/reviews
  function examDone(sid) { const r = STUDY.examRecord && STUDY.examRecord(sid); return !!(r && r.done); }
  ADAPT.examDone = examDone;

  // ---- spaced-repetition due queue (overdue items, most-overdue first) ----
  // For the global feed, overdue-ness is weighted by subject importance so a
  // weak/heavy subject's reviews surface first; scoped feed = just that subject.
  function dueQueue(only, recent, now) {
    const store = STUDY.store(), out = [];
    pool().forEach(function (q) {
      if (only && q.subjectId !== only) return;
      if (!only && examDone(q.subjectId)) return;        // skip finished classes in the mixed feed
      if (recent && recent.indexOf(q.id) >= 0) return;
      if (STUDY.isFlagged && STUDY.isFlagged(q.id)) return;
      const st = store.srs[q.id];
      if (st && st.reps > 0 && st.due && st.due <= now) out.push({ q: q, over: now - st.due, sub: q.subjectId });
    });
    out.sort(function (a, b) {
      const ia = only ? 1 : (0.6 + (STUDY.byId[a.sub].weight || 1) * 0.12);
      const ib = only ? 1 : (0.6 + (STUDY.byId[b.sub].weight || 1) * 0.12);
      return (b.over * ib) - (a.over * ia);
    });
    return out.map(x => x.q);
  }
  ADAPT.dueCount = function (only) { return dueQueue(only || null, null, Date.now()).length; };

  // ---- pick the next item: (1) choose a subject by priority, (2) best item in it ----
  // Two-stage so bank size never biases the mix, a weak/urgent subject wins
  // even if another subject has 5× the questions.
  ADAPT.next = function (ctx) {
    ctx = ctx || { recent: [], lastTopic: null, lastSubject: null };
    const now = Date.now(), store = STUDY.store();
    const explore = Math.random() < 0.13;

    // (0) auto-include spaced-repetition: the bigger the overdue backlog, the more
    // often the feed serves a review, so nothing rots in the queue. Interleaved
    // (we pick among the most-overdue few) so it never feels like pure drilling.
    const due = dueQueue(ctx.only, ctx.recent, now);
    if (due.length && !explore && Math.random() < clamp(due.length / (due.length + 6), 0, 0.55)) {
      let top = due.slice(0, Math.min(6, due.length));
      const spread = top.filter(q => q.topicId !== ctx.lastTopic);   // interleave: avoid back-to-back same topic
      if (spread.length) top = spread;
      return top[Math.floor(Math.random() * top.length)];
    }

    // (0.5) surface BRAND-NEW questions so freshly added content isn't buried
    // behind a big review backlog. The chance scales with how many new items
    // remain and tapers to ~0 once you've worked through them, so normal spaced
    // repetition resumes on its own. Respects scope, recents, flags & interleave.
    if (!explore) {
      const fresh = pool().filter(function (q) {
        if (q.type === "match") return false;
        if (ctx.only ? q.subjectId !== ctx.only : examDone(q.subjectId)) return false;
        if (ctx.recent.indexOf(q.id) >= 0) return false;
        if (STUDY.isFlagged && STUDY.isFlagged(q.id)) return false;
        const s = store.srs[q.id];
        return !(s && s.reps > 0);                         // never answered = fresh
      });
      if (fresh.length && Math.random() < clamp(fresh.length / (fresh.length + 14), 0, 0.4)) {
        let pickFrom = fresh.filter(q => q.topicId !== ctx.lastTopic);   // interleave topics
        if (!pickFrom.length) pickFrom = fresh;
        return pickFrom[Math.floor(Math.random() * pickFrom.length)];
      }
    }

    // (1) choose a subject, unless the feed is scoped to one (ctx.only)
    let subj;
    if (ctx.only) {
      subj = STUDY.byId[ctx.only] || STUDY.subjects[0];   // explicitly opened → serve it even if its exam is done
    } else {
      // the mixed feed skips classes whose exam you've already taken, so your time
      // goes to what's left. (Fall back to all if every exam is marked done.)
      const live = STUDY.subjects.filter(s => !examDone(s.id));
      const pool2 = live.length ? live : STUDY.subjects;
      const subScores = pool2.map(function (s) {
        const ss = subjectStat(s);
        const weakness = clamp(1.15 - ss.acc, 0.2, 1);          // low accuracy → high
        const imp = 0.6 + s.weight * 0.12;                       // ELA(5)→1.2 … History(2)→0.84
        const urg = urgency(s.id);                               // nearer exam → higher
        let sc = imp * urg * (0.2 + 1.3 * weakness) * (1 + 0.3 * ss.coverage);
        if (explore) sc = imp * (0.8 + Math.random());           // flatten for coverage
        sc *= (s.id === ctx.lastSubject ? 0.55 : 1) * (0.7 + Math.random() * 0.6);
        return { v: s, w: Math.max(0.0001, sc) };
      });
      subj = weightedPick(subScores) || pool2[0];
    }

    // (2) best item within that subject (skip reported-broken questions)
    const flagged = store.flagged || {};
    const cands = pool().filter(q => q.subjectId === subj.id && ctx.recent.indexOf(q.id) < 0 && !flagged[q.id]);
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
      const items = (t.questions || []).filter(q => q.type !== "match" && !STUDY.isFlagged(q.id));
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
  // probability you'd answer q correctly ON exam day (no further study).
  // Driven mainly by calibrated mastery (kn), with a Glicko-skill term and a
  // GENTLE retention temper so well-learned material doesn't crater to guess level.
  function pExamAt(q, examMs) {
    const store = STUDY.store();
    const st = store.srs[q.id];
    const ability = ADAPT.abilityOf(q.subjectId);
    const diff = st && st.diff ? st.diff : STUDY.seedDiff(q);
    const pSkill = 1 / (1 + Math.pow(10, (diff - ability) / 400));
    const g = guessFloor(q);
    if (!st) return g + (1 - g) * pSkill * 0.45;         // unseen: a little credit for reasoning
    // how well you know it: honest-mastery OR demonstrated Leitner box (whichever
    // higher): both signal real learning, and box isn't suppressed by missing rt.
    const know = Math.max((typeof st.kn === "number") ? st.kn : 0, Math.min(1, (st.box || 0) / 4));
    // REALISTIC forgetting: well-learned material is DURABLE (multi-day), not the
    // few-hours stability that massed/untimed practice produces. Floor the effective
    // memory-stability by how well you know it, so the forecast only fades what you
    // HAVEN'T cemented (low know decays fast; a long gap still decays even if known).
    const elapsedH = Math.max(0, (examMs - (st.last || examMs)) / HOUR);
    const effStab = Math.max(st.stability || 4, 18 + 90 * know);   // hours; known ≈ days
    const r = Math.pow(2, -elapsedH / effStab);
    const base = 0.85 * (0.45 + 0.55 * know) + 0.15 * pSkill;   // mastery-dominant, skill-blended
    const timeAdj = 0.7 + 0.3 * r;
    return clamp(g + (1 - g) * base * timeAdj, 0, 1);     // floor at guess level
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
      const items = (t.questions || []).filter(q => q.type !== "match" && !STUDY.isFlagged(q.id));
      if (!items.length) return;
      let acc = 0, studied = 0;
      items.forEach(function (q) { if (store.srs[q.id]) { acc += pExamAt(q, examMs); studied++; } });
      const studiedAcc = studied ? acc / studied : UNSEEN_PRIOR;
      const coverage = clamp(studied / Math.min(items.length, 8), 0, 1);
      sum += UNSEEN_PRIOR + (studiedAcc - UNSEEN_PRIOR) * coverage; n++;
    });
    let pct = n ? sum / n * 100 : 0;
    // self-correction: if real grades have come in, nudge ungraded forecasts by how
    // far off the forecast has been (shrunk, so 1-2 grades barely move it).
    const rec = STUDY.examRecord && STUDY.examRecord(subjectId);
    if (!(rec && typeof rec.actual === "number") && STUDY.examCalibration) {
      const cal = STUDY.examCalibration();
      if (cal.n) pct = clamp(pct + cal.offset, 0, 100);
    }
    return Math.round(pct);
  };
  ADAPT.overallForecast = function () {
    let s = 0, w = 0;
    STUDY.subjects.forEach(function (subj) { const wt = subj.weight || 1; s += ADAPT.forecast(subj.id) * wt; w += wt; });
    return w ? Math.round(s / w) : 0;
  };
  // ± confidence band on the forecast, from Glicko uncertainty (RD): the less the
  // engine has seen of you in this subject, the wider the band.
  ADAPT.forecastBand = function (subjectId) {
    const rd = ADAPT.rdOf(subjectId);
    return clamp(Math.round(3 + 17 * (rd - RD_MIN) / (RD_MAX - RD_MIN)), 3, 20);
  };
  ADAPT.overallBand = function () {
    let s = 0, n = 0; STUDY.subjects.forEach(function (subj) { s += ADAPT.forecastBand(subj.id); n++; });
    return n ? Math.round(s / n) : 0;
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
      const rec = STUDY.examRecord && STUDY.examRecord(s.id);
      const done = !!(rec && rec.done);                  // exam taken → stop telling you to study it
      const priority = done ? 0 : imp * urg * (0.12 + gap);
      return { id: s.id, name: s.name, icon: s.icon, weight: s.weight, forecast: f, shaky: ADAPT.shakyCount(s.id), done: done, priority: priority, minutes: 0 };
    });
    const sum = rows.reduce((a, b) => a + b.priority, 0) || 1;
    let used = 0;
    rows.forEach(function (r) { r.minutes = Math.max(0, Math.round((r.priority / sum) * total / 5) * 5); used += r.minutes; });
    rows.sort((a, b) => b.priority - a.priority);
    return { minutes: total, mode: soonest <= 1 ? "final" : "build", soonest: soonest, overall: ADAPT.overallForecast(), rows: rows };
  };

  STUDY.ADAPT = ADAPT;
})(window.STUDY);
