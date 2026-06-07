/* ============================================================
   adaptive.js — the local, offline "For You" engine.
   After every answer it updates three models and re-plans:
     • forgetting   — each item's memory stability → recall-probability now
     • difficulty   — each item's Elo rating (rises when strong students miss it)
     • skill        — your Elo per subject (rises when you beat hard items)
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

  // ---- forgetting model ----
  function recall(st, now) {
    if (!st || !st.last) return 1;                 // just-seen / unseen → treat as fresh
    const elapsedH = (now - st.last) / HOUR;
    const S = st.stability || 1;
    return Math.pow(2, -elapsedH / S);             // half-life curve: 0.5 at elapsed == S
  }
  ADAPT.recall = recall;

  // fast-answer thresholds (ms) → "knew it cold"
  const FAST = { mc: 4500, tf: 3500, fill: 9000, listen: 6500 };

  // ---- update after one answer ----
  // correct: bool, rtMs: response time, guess: user flagged "lucky guess"
  ADAPT.update = function (q, correct, rtMs, guess) {
    const store = STUDY.store(), now = Date.now();
    const fast = rtMs && rtMs < (FAST[q.type] || 5000);
    // response-time + confidence → an effective grade (drives spacing)
    let grade;
    if (!correct) grade = 0;
    else if (guess) grade = 1;
    else if (fast) grade = 3;
    else grade = 2;

    let st = store.srs[q.id];
    const pBefore = recall(st, now);               // how forgotten it was (for spacing boost)

    STUDY.recordItem(q.id, grade, q.topicId, { mode: "feed", rt: rtMs || 0 });   // legacy + log
    st = store.srs[q.id];                           // now exists
    st.rt = rtMs || st.rt || 0;

    // forgetting stability (hours), capped to the cram window
    const S = st.stability || 1;
    if (grade === 0) st.stability = 0.25;
    else if (grade === 1) st.stability = clamp(S * 0.95, 0.5, 168);
    else if (grade === 2) st.stability = clamp(S * (1.5 + 0.8 * (1 - pBefore)), 0.4, 168);
    else st.stability = clamp(S * (2.3 + 1.2 * (1 - pBefore)), 0.4, 168);

    // Elo: item difficulty + your subject skill
    const skill = store.subjectSkill[q.subjectId] || 1500;
    const diff = st.diff || 1500;
    const expct = 1 / (1 + Math.pow(10, (diff - skill) / 400));
    const actual = grade >= 2 ? 1 : grade === 1 ? 0.5 : 0;
    st.diff = clamp(diff + 24 * (expct - actual), 600, 2400);
    store.subjectSkill[q.subjectId] = clamp(skill + 28 * (actual - expct), 600, 2400);

    STUDY.save();
    return { grade: grade, fast: fast };
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
  // Two-stage so bank size never biases the mix — a weak/urgent subject wins
  // even if another subject has 5× the questions.
  ADAPT.next = function (ctx) {
    ctx = ctx || { recent: [], lastTopic: null, lastSubject: null };
    const now = Date.now(), store = STUDY.store();
    const explore = Math.random() < 0.13;

    // (1) subject priority
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
    const subj = weightedPick(subScores) || STUDY.subjects[0];

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

  // ---- readiness % — concept-based, so it climbs without acing all 739 items ----
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

  STUDY.ADAPT = ADAPT;
})(window.STUDY);
