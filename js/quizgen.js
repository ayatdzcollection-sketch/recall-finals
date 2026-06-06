/* ============================================================
   quizgen.js — expands the question bank at load time so practice
   can't be pattern-memorised. Runs AFTER all data files register,
   BEFORE quiz/test/app. Three sources:
     1. Card → MC  (every subject): self-contained questions whose
        distractors are real, same-subject answers of similar length
        so the correct option never stands out.
     2. Geometry   : randomised numeric problems (fresh each load).
     3. French     : randomised conjugation drills (conditionnel/futur).
   ============================================================ */
(function (STUDY) {
  "use strict";
  const shuffle = STUDY.SRS.shuffle;
  const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];

  function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(); }
  function wordset(s) { return new Set(norm(s).split(" ").filter(w => w.length > 3)); }
  function sim(a, b) {
    const A = wordset(a), B = wordset(b); if (!A.size || !B.size) return 0;
    let i = 0; A.forEach(w => { if (B.has(w)) i++; });
    return i / (A.size + B.size - i);
  }

  /* ---------------- 1. card → multiple choice ---------------- */
  function stemFor(front) {
    const f = front.trim();
    if (/[?…:=]$/.test(f)) return f;                                   // already a prompt
    if (/^(what|which|who|where|when|why|how|name|put|list|define|conjugate|cross|select|identify)\b/i.test(f)) return f; // instruction/question
    return "Which best describes “" + f.replace(/[.…\s]+$/, "") + "”?"; // a term → frame it
  }

  function genFromCards() {
    STUDY.subjects.forEach(function (s) {
      const all = [];
      s.topics.forEach(t => (t.cards || []).forEach(c => all.push({ c: c, t: t })));
      if (all.length < 4) return;

      s.topics.forEach(function (t) {
        const existingStems = {};
        (t.questions || []).forEach(q => existingStems[norm(q.q)] = 1);
        const add = [];

        (t.cards || []).forEach(function (card) {
          const answer = card.back;
          if (!answer || answer.length > 115) return;
          const stem = stemFor(card.front);
          if (existingStems[norm(stem)]) return;          // don't duplicate an authored question

          // candidate distractors: other cards' answers in this subject
          let cands = all.filter(function (x) {
            if (x.c === card) return false;
            const b = x.c.back;
            if (!b || b.length > 135) return false;
            if (norm(b) === norm(answer)) return false;
            if (sim(b, answer) > 0.45) return false;       // not a near-duplicate meaning
            return true;
          });
          if (cands.length < 3) return;

          // prefer distractors from OTHER topics (less chance of a second correct answer)
          const cross = cands.filter(x => x.t !== t);
          if (cross.length >= 3) cands = cross;

          // bias toward similar length so the answer doesn't stand out, then add variety
          cands.sort((a, b) => Math.abs(a.c.back.length - answer.length) - Math.abs(b.c.back.length - answer.length));
          const window = cands.slice(0, Math.min(7, cands.length));
          const chosen = shuffle(window).slice(0, 3);

          const choices = shuffle([answer, chosen[0].c.back, chosen[1].c.back, chosen[2].c.back]);
          if (new Set(choices.map(norm)).size < 4) return; // safety: 4 distinct options
          add.push({ type: "mc", q: stem, choices: choices, answer: choices.indexOf(answer) });
          existingStems[norm(stem)] = 1;
        });

        if (add.length) STUDY.addQuestions(t, add);
      });
    });
  }

  /* ---------------- 2. geometry numeric problems ---------------- */
  function makeNumMC(correct, distractors, fmt) {
    const seen = {}, out = [];
    const add = (v) => { const k = Math.round(v * 100) / 100; if (!(k in seen) && isFinite(v) && v > 0) { seen[k] = 1; out.push(v); } };
    add(correct);
    shuffle(distractors).forEach(add);
    let guard = 0;
    while (out.length < 4 && guard++ < 30) add(correct * (1 + (rint(1, 6) * (Math.random() < .5 ? -0.1 : 0.15))));
    if (out.length < 4) return null;
    const four = [correct].concat(out.filter(v => v !== correct).slice(0, 3));
    const choices = shuffle(four).map(fmt);
    return { choices: choices, answer: choices.indexOf(fmt(correct)) };
  }
  const r2 = (x) => Math.round(x * 100) / 100;
  const r1 = (x) => Math.round(x * 10) / 10;
  const PI = Math.PI;

  const GEO_TEMPLATES = [
    { topic: "geo-area", make: () => { const l = rint(4, 20), w = rint(3, 18); const c = l * w; return q("A rectangle is " + l + " cm by " + w + " cm. What is its area?", c, [2 * (l + w), l + w, l * w * 2], v => v + " cm²"); } },
    { topic: "geo-area", make: () => { const b = rint(4, 24), h = rint(3, 18); const c = 0.5 * b * h; return q("A triangle has base " + b + " and height " + h + ". What is its area?", c, [b * h, b + h, 0.5 * (b + h)], v => "" + r1(v)); } },
    { topic: "geo-area", make: () => { const a = rint(4, 14), b = a + rint(2, 10), h = rint(3, 12); const c = 0.5 * (a + b) * h; return q("A trapezoid has parallel sides " + a + " and " + b + " with height " + h + ". Area?", c, [(a + b) * h, 0.5 * a * b, a + b + h], v => "" + r1(v)); } },
    { topic: "geo-area", make: () => { const d1 = rint(6, 22), d2 = rint(5, 20); const c = 0.5 * d1 * d2; return q("A kite (or rhombus) has diagonals " + d1 + " and " + d2 + ". What is its area?", c, [d1 * d2, d1 + d2, 0.25 * d1 * d2], v => "" + r1(v)); } },
    { topic: "geo-circlemeasure", make: () => { const r = rint(2, 14); const c = r2(PI * r * r); return q("A circle has radius " + r + ". What is its area? (use π ≈ 3.14)", c, [r2(2 * PI * r), r2(PI * 2 * r), r2(PI * r)], v => "" + r2(v)); } },
    { topic: "geo-circlemeasure", make: () => { const d = rint(4, 24); const c = r2(PI * d); return q("A circle has diameter " + d + ". What is its circumference?", c, [r2(PI * d * d / 4), r2(PI * d / 2), r2(2 * PI * d)], v => "" + r2(v)); } },
    { topic: "geo-solids", make: () => { const l = rint(3, 12), w = rint(3, 12), h = rint(3, 12); const c = l * w * h; return q("A rectangular prism is " + l + " by " + w + " by " + h + ". What is its volume?", c, [2 * (l * w + l * h + w * h), l + w + h, l * w + l * h + w * h], v => v + " units³"); } },
    { topic: "geo-solids", make: () => { const r = rint(2, 9), h = rint(4, 14); const c = r1(PI * r * r * h); return q("A cylinder has radius " + r + " and height " + h + ". Volume? (π ≈ 3.14)", c, [r1(2 * PI * r * h), r1(PI * r * h), r1(PI * r * r)], v => "" + r1(v)); } },
    { topic: "geo-solids", make: () => { const r = rint(2, 9), h = rint(4, 14); const c = r1(PI * r * r * h / 3); return q("A cone has radius " + r + " and height " + h + ". Volume = ⅓πr²h ≈ ?", c, [r1(PI * r * r * h), r1(PI * r * h / 3), r1(2 / 3 * PI * r * r * h)], v => "" + r1(v)); } },
    { topic: "geo-solids", make: () => { const r = rint(2, 9); const c = r1(4 / 3 * PI * r * r * r); return q("A sphere has radius " + r + ". Volume = (4/3)πr³ ≈ ?", c, [r1(4 * PI * r * r), r1(4 / 3 * PI * r * r), r1(PI * r * r * r)], v => "" + r1(v)); } },
    { topic: "geo-righttri", make: () => { const a = rint(3, 18), b = rint(3, 18); const c = r2(Math.hypot(a, b)); return q("A right triangle has legs " + a + " and " + b + ". What is the hypotenuse?", c, [a + b, Math.max(a, b), r2(Math.abs(a - b) + Math.min(a, b))], v => "" + r2(v)); } },
    { topic: "geo-quads", make: () => { const n = rint(3, 10); const c = (n - 2) * 180; const names = { 3: "triangle", 4: "quadrilateral", 5: "pentagon", 6: "hexagon", 7: "heptagon", 8: "octagon", 9: "nonagon", 10: "decagon" }; return q("What is the sum of the interior angles of a " + names[n] + " (" + n + " sides)?", c, [n * 180, (n - 2) * 360, (n - 1) * 180], v => v + "°"); } },
    { topic: "geo-quads", make: () => { let a, b; do { a = rint(25, 120); b = rint(25, 120); } while (a + b >= 175); const c = 180 - a - b; return q("Two angles of a triangle are " + a + "° and " + b + "°. What is the third angle?", c, [a + b, 360 - a - b, Math.abs(a - b)], v => v + "°"); } },
  ];
  function q(stem, correct, distractors, fmt) {
    const m = makeNumMC(correct, distractors, fmt);
    if (!m) return null;
    return { type: "mc", q: stem, choices: m.choices, answer: m.answer };
  }

  function genGeometry(perTemplate) {
    const byTopic = {};
    GEO_TEMPLATES.forEach(function (tpl) {
      for (let i = 0; i < perTemplate; i++) {
        let item = null, tries = 0;
        while (!item && tries++ < 5) item = tpl.make();
        if (item) (byTopic[tpl.topic] = byTopic[tpl.topic] || []).push(item);
      }
    });
    Object.keys(byTopic).forEach(function (tid) {
      const entry = STUDY.topicIndex[tid];
      if (entry) STUDY.addQuestions(entry.topic, byTopic[tid]);
    });
  }

  /* ---------------- 3. french conjugation drills ---------------- */
  const FR_VERBS = [
    { inf: "parler", stem: "parler" }, { inf: "regarder", stem: "regarder" }, { inf: "manger", stem: "manger" },
    { inf: "aimer", stem: "aimer" }, { inf: "travailler", stem: "travailler" }, { inf: "écouter", stem: "écouter" },
    { inf: "finir", stem: "finir" }, { inf: "choisir", stem: "choisir" }, { inf: "vendre", stem: "vendr" },
    { inf: "prendre", stem: "prendr" }, { inf: "attendre", stem: "attendr" },
    { inf: "aller", stem: "ir" }, { inf: "avoir", stem: "aur" }, { inf: "être", stem: "ser" },
    { inf: "faire", stem: "fer" }, { inf: "pouvoir", stem: "pourr" }, { inf: "devoir", stem: "devr" },
    { inf: "voir", stem: "verr" }, { inf: "venir", stem: "viendr" }, { inf: "vouloir", stem: "voudr" },
  ];
  const FR_SUBJ = ["je", "tu", "il", "nous", "vous", "ils"];
  const FR_END = {
    cond: ["ais", "ais", "ait", "ions", "iez", "aient"],
    fut: ["ai", "as", "a", "ons", "ez", "ont"],
  };
  const VOWEL = /^[aeiouéèêh]/i;
  function frForm(stem, end, si) {
    let form = stem + FR_END[end][si];
    const subj = FR_SUBJ[si];
    if (subj === "je") return (VOWEL.test(form) ? "j'" : "je ") + form;
    return subj + " " + form;
  }
  function genFrench(count) {
    const out = { "fr-conditionnel": [], "fr-futur": [] };
    const seen = {};
    let guard = 0;
    while ((out["fr-conditionnel"].length + out["fr-futur"].length) < count && guard++ < count * 8) {
      const v = pick(FR_VERBS), si = rint(0, 5), tense = Math.random() < 0.5 ? "cond" : "fut";
      const key = v.inf + si + tense;
      if (seen[key]) continue; seen[key] = 1;
      const correct = frForm(v.stem, tense, si);
      // distractors: wrong person (same tense), wrong tense (same person), wrong both
      const si2 = (si + rint(1, 5)) % 6;
      const other = tense === "cond" ? "fut" : "cond";
      const ds = [frForm(v.stem, tense, si2), frForm(v.stem, other, si), frForm(v.stem, other, si2)];
      const choices = shuffle([correct].concat(ds));
      if (new Set(choices.map(c => c.toLowerCase())).size < 4) continue;
      const label = tense === "cond" ? "conditionnel (would)" : "futur (will)";
      const item = { type: "mc", q: "Conjugate « " + v.inf + " » for « " + FR_SUBJ[si] + " » in the " + label + ":", choices: choices, answer: choices.indexOf(correct) };
      out[tense === "cond" ? "fr-conditionnel" : "fr-futur"].push(item);
    }
    Object.keys(out).forEach(function (tid) {
      const entry = STUDY.topicIndex[tid];
      if (entry && out[tid].length) STUDY.addQuestions(entry.topic, out[tid]);
    });
  }

  /* ---------------- run ---------------- */
  try { genFromCards(); } catch (e) { if (window.console) console.warn("card-gen", e); }
  try { genGeometry(4); } catch (e) { if (window.console) console.warn("geo-gen", e); }
  try { genFrench(16); } catch (e) { if (window.console) console.warn("fr-gen", e); }

  STUDY.QUIZGEN = { genFromCards: genFromCards, genGeometry: genGeometry, genFrench: genFrench };
})(window.STUDY);
