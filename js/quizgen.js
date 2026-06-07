/* ============================================================
   quizgen.js, expands the question bank at load time so practice
   can't be pattern-memorised. Runs AFTER all data files (and
   data/extra.js) register, BEFORE quiz/test/app.
     1. Card → MC (every subject): self-contained questions whose
        distractors are real, same-subject answers of similar length.
     2. Geometry: ~20 randomised numeric problem types.
     3. French: randomised conjugation drills (conditionnel/futur).
   Geometry & French builders take an RNG so a seed can reproduce an
   identical test on another device (see test.js share links).
   ============================================================ */
(function (STUDY) {
  "use strict";
  const shuffle0 = STUDY.SRS.shuffle;                 // Math.random based
  // rng-parameterised helpers (rng() -> [0,1))
  const ri = (rng, a, b) => a + Math.floor(rng() * (b - a + 1));
  const rp = (rng, arr) => arr[Math.floor(rng() * arr.length)];
  function rsh(rng, a) { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  const r2 = (x) => Math.round(x * 100) / 100;
  const r1 = (x) => Math.round(x * 10) / 10;
  const PI = Math.PI;

  function norm(s) { return String(s).toLowerCase().replace(/[^a-z0-9 ]/g, " ").replace(/\s+/g, " ").trim(); }
  function wordset(s) { return new Set(norm(s).split(" ").filter(w => w.length > 3)); }
  function sim(a, b) { const A = wordset(a), B = wordset(b); if (!A.size || !B.size) return 0; let i = 0; A.forEach(w => { if (B.has(w)) i++; }); return i / (A.size + B.size - i); }

  /* ---------------- 1. card → multiple choice ---------------- */
  function stemFor(front) {
    const f = front.trim();
    if (/[?…:=]$/.test(f)) return f;
    if (/^(what|which|who|where|when|why|how|name|put|list|define|conjugate|cross|select|identify)\b/i.test(f)) return f;
    return "Which best describes “" + f.replace(/[.…\s]+$/, "") + "”?";
  }
  function genFromCards() {
    STUDY.subjects.forEach(function (s) {
      const all = [];
      s.topics.forEach(t => (t.cards || []).forEach(c => all.push({ c: c, t: t })));
      if (all.length < 4) return;
      s.topics.forEach(function (t) {
        const existing = {};
        (t.questions || []).forEach(q => existing[norm(q.q)] = 1);
        const add = [];
        (t.cards || []).forEach(function (card) {
          const answer = card.back;
          if (!answer || answer.length > 115) return;
          const stem = stemFor(card.front);
          if (existing[norm(stem)]) return;
          let cands = all.filter(function (x) {
            if (x.c === card) return false;
            const b = x.c.back;
            if (!b || b.length > 135) return false;
            if (norm(b) === norm(answer)) return false;
            if (sim(b, answer) > 0.45) return false;
            return true;
          });
          if (cands.length < 3) return;
          const cross = cands.filter(x => x.t !== t);
          if (cross.length >= 3) cands = cross;
          cands.sort((a, b) => Math.abs(a.c.back.length - answer.length) - Math.abs(b.c.back.length - answer.length));
          const chosen = shuffle0(cands.slice(0, Math.min(7, cands.length))).slice(0, 3);
          const choices = shuffle0([answer, chosen[0].c.back, chosen[1].c.back, chosen[2].c.back]);
          if (new Set(choices.map(norm)).size < 4) return;
          add.push({ type: "mc", q: stem, choices: choices, answer: choices.indexOf(answer) });
          existing[norm(stem)] = 1;
        });
        if (add.length) STUDY.addQuestions(t, add);
      });
    });
  }

  /* ---------------- 2. geometry numeric problems ---------------- */
  function numMC(rng, stem, correct, distractors, fmt, explain) {
    const seen = {}, vals = [];
    const add = (v) => { if (!isFinite(v) || v <= 0) return; const k = Math.round(v * 100) / 100; if (k in seen) return; seen[k] = 1; vals.push(v); };
    add(correct);
    rsh(rng, distractors).forEach(add);
    let g = 0;
    while (vals.length < 4 && g++ < 40) add(correct * (1 + ri(rng, 1, 6) * (rng() < .5 ? -0.12 : 0.17)));
    if (vals.length < 4) return null;
    const four = [correct].concat(vals.filter(v => v !== correct).slice(0, 3));
    const choices = rsh(rng, four).map(fmt);
    if (new Set(choices).size < 4) return null;
    return { type: "mc", q: stem, choices: choices, answer: choices.indexOf(fmt(correct)), explain: explain || "" };
  }

  const GEO = [
    ["geo-area", r => { const l = ri(r, 4, 20), w = ri(r, 3, 18); return numMC(r, "A rectangle is " + l + " cm by " + w + " cm. What is its area?", l * w, [2 * (l + w), l + w, 2 * l * w], v => v + " cm²", "Area of a rectangle = length × width = " + l + " × " + w + " = " + (l * w) + " cm²."); }],
    ["geo-area", r => { const b = ri(r, 4, 24), h = ri(r, 3, 18); return numMC(r, "A triangle has base " + b + " and height " + h + ". What is its area?", 0.5 * b * h, [b * h, b + h, 0.5 * (b + h)], v => "" + r1(v), "Area of a triangle = ½ × base × height = ½ × " + b + " × " + h + " = " + r1(0.5 * b * h) + "."); }],
    ["geo-area", r => { const b = ri(r, 4, 20), h = ri(r, 3, 16); return numMC(r, "A parallelogram has base " + b + " and height " + h + ". What is its area?", b * h, [0.5 * b * h, 2 * (b + h), b + h], v => "" + v, "Area of a parallelogram = base × height = " + b + " × " + h + " = " + (b * h) + "."); }],
    ["geo-area", r => { const a = ri(r, 4, 14), b = a + ri(r, 2, 10), h = ri(r, 3, 12); return numMC(r, "A trapezoid has parallel sides " + a + " and " + b + " with height " + h + ". Area?", 0.5 * (a + b) * h, [(a + b) * h, 0.5 * a * b, a + b + h], v => "" + r1(v), "Area of a trapezoid = ½(b₁+b₂)×h = ½(" + a + "+" + b + ")×" + h + " = " + r1(0.5 * (a + b) * h) + "."); }],
    ["geo-area", r => { const d1 = ri(r, 6, 22), d2 = ri(r, 5, 20); return numMC(r, "A kite (or rhombus) has diagonals " + d1 + " and " + d2 + ". What is its area?", 0.5 * d1 * d2, [d1 * d2, d1 + d2, 0.25 * d1 * d2], v => "" + r1(v), "Area of a kite/rhombus = ½ × d₁ × d₂ = ½ × " + d1 + " × " + d2 + " = " + r1(0.5 * d1 * d2) + "."); }],
    ["geo-circlemeasure", r => { const rd = ri(r, 2, 14); return numMC(r, "A circle has radius " + rd + ". What is its area? (π ≈ 3.14)", r2(PI * rd * rd), [r2(2 * PI * rd), r2(PI * rd), r2(4 * PI * rd)], v => "" + r2(v), "Area of a circle = πr² = 3.14 × " + rd + "² = 3.14 × " + (rd * rd) + " ≈ " + r2(PI * rd * rd) + "."); }],
    ["geo-circlemeasure", r => { const d = ri(r, 4, 24); return numMC(r, "A circle has diameter " + d + ". What is its circumference? (π ≈ 3.14)", r2(PI * d), [r2(PI * d * d / 4), r2(PI * d / 2), r2(2 * PI * d)], v => "" + r2(v), "Circumference = πd = 3.14 × " + d + " ≈ " + r2(PI * d) + "."); }],
    ["geo-circlemeasure", r => { const rd = ri(r, 3, 14), ang = rp(r, [60, 90, 120, 150, 180, 240]); return numMC(r, "An arc has central angle " + ang + "° in a circle of radius " + rd + ". Arc length? (π ≈ 3.14)", r2(ang / 360 * 2 * PI * rd), [r2(ang / 360 * PI * rd * rd), r2(2 * PI * rd), r2(ang / 180 * PI * rd)], v => "" + r2(v), "Arc length = (θ/360) × 2πr = (" + ang + "/360) × 2 × 3.14 × " + rd + " ≈ " + r2(ang / 360 * 2 * PI * rd) + "."); }],
    ["geo-circlemeasure", r => { const rd = ri(r, 3, 14), ang = rp(r, [60, 90, 120, 150, 240, 270]); return numMC(r, "A sector has central angle " + ang + "° in a circle of radius " + rd + ". Sector area? (π ≈ 3.14)", r2(ang / 360 * PI * rd * rd), [r2(ang / 360 * 2 * PI * rd), r2(PI * rd * rd), r2(ang / 180 * PI * rd * rd)], v => "" + r2(v), "Sector area = (θ/360) × πr² = (" + ang + "/360) × 3.14 × " + rd + "² ≈ " + r2(ang / 360 * PI * rd * rd) + "."); }],
    ["geo-solids", r => { const l = ri(r, 3, 12), w = ri(r, 3, 12), h = ri(r, 3, 12); return numMC(r, "A rectangular prism is " + l + " by " + w + " by " + h + ". What is its volume?", l * w * h, [2 * (l * w + l * h + w * h), l + w + h, l * w + l * h + w * h], v => v + " units³", "Volume of a prism = l × w × h = " + l + " × " + w + " × " + h + " = " + (l * w * h) + " units³."); }],
    ["geo-solids", r => { const s = ri(r, 2, 11); return numMC(r, "A cube has edge length " + s + ". What is its volume?", s * s * s, [6 * s * s, s * s, 3 * s], v => v + " units³", "Volume of a cube = s³ = " + s + "³ = " + (s * s * s) + " units³."); }],
    ["geo-solids", r => { const rd = ri(r, 2, 9), h = ri(r, 4, 14); return numMC(r, "A cylinder has radius " + rd + " and height " + h + ". Volume? (π ≈ 3.14)", r1(PI * rd * rd * h), [r1(2 * PI * rd * h), r1(PI * rd * h), r1(PI * rd * rd)], v => "" + r1(v), "Volume of a cylinder = πr²h = 3.14 × " + rd + "² × " + h + " ≈ " + r1(PI * rd * rd * h) + "."); }],
    ["geo-solids", r => { const rd = ri(r, 2, 9), h = ri(r, 4, 14); return numMC(r, "A cone has radius " + rd + " and height " + h + ". Volume = ⅓πr²h ≈ ? (π ≈ 3.14)", r1(PI * rd * rd * h / 3), [r1(PI * rd * rd * h), r1(PI * rd * h / 3), r1(2 / 3 * PI * rd * rd * h)], v => "" + r1(v), "Volume of a cone = ⅓πr²h = ⅓ × 3.14 × " + rd + "² × " + h + " ≈ " + r1(PI * rd * rd * h / 3) + "."); }],
    ["geo-solids", r => { const rd = ri(r, 2, 9); return numMC(r, "A sphere has radius " + rd + ". Volume = (4/3)πr³ ≈ ? (π ≈ 3.14)", r1(4 / 3 * PI * rd * rd * rd), [r1(4 * PI * rd * rd), r1(4 / 3 * PI * rd * rd), r1(PI * rd * rd * rd)], v => "" + r1(v), "Volume of a sphere = (4/3)πr³ = (4/3) × 3.14 × " + rd + "³ ≈ " + r1(4 / 3 * PI * rd * rd * rd) + "."); }],
    ["geo-solids", r => { const s = ri(r, 3, 12), h = ri(r, 4, 14); return numMC(r, "A square pyramid has base edge " + s + " and height " + h + ". Volume = ⅓·B·h ≈ ?", r1(s * s * h / 3), [r1(s * s * h), r1(s * h / 3), r1(2 * s * s * h / 3)], v => "" + r1(v), "Volume of a pyramid = ⅓ × B × h, with base B = " + s + "² = " + (s * s) + ", so ⅓ × " + (s * s) + " × " + h + " ≈ " + r1(s * s * h / 3) + "."); }],
    ["geo-solids", r => { const l = ri(r, 3, 10), w = ri(r, 3, 10), h = ri(r, 3, 10); return numMC(r, "A rectangular prism is " + l + " by " + w + " by " + h + ". What is its surface area?", 2 * (l * w + l * h + w * h), [l * w * h, l + w + h, l * w + l * h + w * h], v => v + " units²", "SA of a prism = 2(lw+lh+wh) = 2(" + (l * w) + "+" + (l * h) + "+" + (w * h) + ") = " + (2 * (l * w + l * h + w * h)) + " units²."); }],
    ["geo-solids", r => { const rd = ri(r, 2, 9); return numMC(r, "A sphere has radius " + rd + ". Surface area = 4πr² ≈ ? (π ≈ 3.14)", r2(4 * PI * rd * rd), [r2(4 / 3 * PI * rd * rd * rd), r2(PI * rd * rd), r2(2 * PI * rd * rd)], v => "" + r2(v), "SA of a sphere = 4πr² = 4 × 3.14 × " + rd + "² ≈ " + r2(4 * PI * rd * rd) + "."); }],
    ["geo-righttri", r => { const a = ri(r, 3, 18), b = ri(r, 3, 18); return numMC(r, "A right triangle has legs " + a + " and " + b + ". What is the hypotenuse? (round to 0.01)", r2(Math.hypot(a, b)), [a + b, Math.max(a, b), r2(Math.sqrt(Math.abs(a * a - b * b)) || a)], v => "" + r2(v), "Pythagorean theorem: c = √(a²+b²) = √(" + a + "²+" + b + "²) = √" + (a * a + b * b) + " ≈ " + r2(Math.hypot(a, b)) + "."); }],
    ["geo-righttri", r => { const leg = ri(r, 3, 16), hyp = leg + ri(r, 2, 12); const o = r2(Math.sqrt(hyp * hyp - leg * leg)); return o > 0 ? numMC(r, "A right triangle has one leg " + leg + " and hypotenuse " + hyp + ". Find the other leg. (round to 0.01)", o, [r2(hyp - leg), r2(Math.hypot(leg, hyp)), leg], v => "" + r2(v), "Rearrange Pythagorean: leg = √(c²−a²) = √(" + hyp + "²−" + leg + "²) = √" + (hyp * hyp - leg * leg) + " ≈ " + o + ".") : null; }],
    ["geo-righttri", r => { const leg = ri(r, 3, 14); return numMC(r, "A 45-45-90 triangle has legs of " + leg + ". What is the hypotenuse? (leg·√2, round to 0.01)", r2(leg * Math.SQRT2), [2 * leg, r2(leg * Math.sqrt(3)), r2(leg / Math.SQRT2)], v => "" + r2(v), "In a 45-45-90 triangle, hypotenuse = leg × √2 = " + leg + " × 1.414 ≈ " + r2(leg * Math.SQRT2) + "."); }],
    ["geo-trig", r => { const a = ri(r, 3, 18), b = ri(r, 3, 18); const hyp = Math.hypot(a, b); return numMC(r, "In a right triangle the side opposite ∠A is " + a + " and the hypotenuse is " + r2(hyp) + ". What is sin A? (round to 0.01)", r2(a / hyp), [r2(b / hyp), r2(a / b), r2(hyp / a)], v => "" + r2(v), "SOH: sin A = opposite ÷ hypotenuse = " + a + " ÷ " + r2(hyp) + " ≈ " + r2(a / hyp) + "."); }],
    ["geo-trig", r => { const opp = ri(r, 2, 14), adj = ri(r, 2, 14); return numMC(r, "A right triangle has the side opposite ∠A = " + opp + " and adjacent = " + adj + ". Find m∠A using tan⁻¹. (round to 0.1°)", r1(Math.atan(opp / adj) * 180 / PI), [r1(90 - Math.atan(opp / adj) * 180 / PI), r1(Math.atan(adj / opp) * 180 / PI), r1(opp / adj)], v => v + "°", "TOA: tan A = opp ÷ adj = " + opp + " ÷ " + adj + ", so ∠A = tan⁻¹(" + opp + "/" + adj + ") ≈ " + r1(Math.atan(opp / adj) * 180 / PI) + "°."); }],
    ["geo-quads", r => { const n = ri(r, 3, 10), names = { 3: "triangle", 4: "quadrilateral", 5: "pentagon", 6: "hexagon", 7: "heptagon", 8: "octagon", 9: "nonagon", 10: "decagon" }; return numMC(r, "What is the sum of the interior angles of a " + names[n] + " (" + n + " sides)?", (n - 2) * 180, [n * 180, (n - 2) * 360, (n - 1) * 180], v => v + "°", "Interior angle sum = (n−2) × 180 = (" + n + "−2) × 180 = " + ((n - 2) * 180) + "°."); }],
    ["geo-quads", r => { const n = rp(r, [5, 6, 8, 9, 10, 12]); return numMC(r, "What is the measure of ONE interior angle of a regular " + n + "-gon?", r2((n - 2) * 180 / n), [r2(360 / n), r2((n - 2) * 180), r2(180 / n)], v => v + "°", "One interior angle = (n−2) × 180 ÷ n = (" + n + "−2) × 180 ÷ " + n + " ≈ " + r2((n - 2) * 180 / n) + "°."); }],
    ["geo-quads", r => { const n = rp(r, [3, 4, 5, 6, 8, 9, 10, 12]); return numMC(r, "What is the measure of ONE exterior angle of a regular " + n + "-gon?", r2(360 / n), [r2((n - 2) * 180 / n), r2(180 / n), r2((n - 2) * 180)], v => v + "°", "One exterior angle = 360 ÷ n = 360 ÷ " + n + " ≈ " + r2(360 / n) + "°."); }],
    ["geo-quads", r => { let a, b; do { a = ri(r, 25, 120); b = ri(r, 25, 120); } while (a + b >= 175); return numMC(r, "Two angles of a triangle are " + a + "° and " + b + "°. What is the third angle?", 180 - a - b, [a + b, 360 - a - b, Math.abs(a - b)], v => v + "°", "Angles of a triangle sum to 180°, so third = 180 − " + a + " − " + b + " = " + (180 - a - b) + "°."); }],
    ["geo-quads", r => { const a = ri(r, 4, 20), b = a + ri(r, 2, 16); return numMC(r, "A trapezoid has parallel bases " + a + " and " + b + ". What is the length of its midsegment? (½ of the sum)", (a + b) / 2, [a + b, b - a, (b - a) / 2], v => "" + r1(v), "Midsegment = ½(b₁+b₂) = ½(" + a + "+" + b + ") = " + r1((a + b) / 2) + "."); }],
    ["geo-similarity", r => { const p = ri(r, 2, 6), qq = p + ri(r, 1, 6), k = ri(r, 2, 5); const D = qq * k; return numMC(r, "Solve the proportion for x:  " + p + "/" + qq + " = x/" + D, p * k, [r2(qq * k / p), D - p, p + qq], v => "" + v, "Cross-multiply: " + qq + "·x = " + p + "·" + D + ", so x = " + (p * D) + " ÷ " + qq + " = " + (p * k) + "."); }],
  ];

  function geometryItems(rng, per) {
    const out = [];
    GEO.forEach(function (pair) {
      for (let i = 0; i < per; i++) {
        let it = null, tr = 0;
        while (!it && tr++ < 6) it = pair[1](rng);
        if (it) { it.topic = pair[0]; out.push(it); }
      }
    });
    return out;
  }
  function genGeometry(rng, per) {
    const byTopic = {};
    geometryItems(rng, per).forEach(it => { const tp = it.topic; delete it.topic; (byTopic[tp] = byTopic[tp] || []).push(it); });
    Object.keys(byTopic).forEach(function (tid) { const e = STUDY.topicIndex[tid]; if (e) STUDY.addQuestions(e.topic, byTopic[tid]); });
  }

  /* ---------------- 3. french conjugation drills ---------------- */
  const FR_VERBS = [
    { inf: "parler", stem: "parler" }, { inf: "regarder", stem: "regarder" }, { inf: "manger", stem: "manger" },
    { inf: "aimer", stem: "aimer" }, { inf: "travailler", stem: "travailler" }, { inf: "écouter", stem: "écouter" },
    { inf: "donner", stem: "donner" }, { inf: "jouer", stem: "jouer" },
    { inf: "finir", stem: "finir" }, { inf: "choisir", stem: "choisir" }, { inf: "vendre", stem: "vendr" },
    { inf: "prendre", stem: "prendr" }, { inf: "attendre", stem: "attendr" },
    { inf: "aller", stem: "ir" }, { inf: "avoir", stem: "aur" }, { inf: "être", stem: "ser" },
    { inf: "faire", stem: "fer" }, { inf: "pouvoir", stem: "pourr" }, { inf: "devoir", stem: "devr" },
    { inf: "voir", stem: "verr" }, { inf: "venir", stem: "viendr" }, { inf: "vouloir", stem: "voudr" },
  ];
  const FR_SUBJ = ["je", "tu", "il", "nous", "vous", "ils"];
  const FR_END = { cond: ["ais", "ais", "ait", "ions", "iez", "aient"], fut: ["ai", "as", "a", "ons", "ez", "ont"] };
  const VOWEL = /^[aeiouéèêh]/i;
  function frForm(stem, end, si) {
    const form = stem + FR_END[end][si];
    if (FR_SUBJ[si] === "je") return (VOWEL.test(form) ? "j'" : "je ") + form;
    return FR_SUBJ[si] + " " + form;
  }
  function frenchItems(rng, count) {
    const out = [], seen = {};
    let guard = 0;
    while (out.length < count && guard++ < count * 10) {
      const v = rp(rng, FR_VERBS), si = ri(rng, 0, 5), tense = rng() < 0.5 ? "cond" : "fut";
      const key = v.inf + si + tense; if (seen[key]) continue; seen[key] = 1;
      const correct = frForm(v.stem, tense, si);
      const si2 = (si + ri(rng, 1, 5)) % 6, other = tense === "cond" ? "fut" : "cond";
      const ds = [frForm(v.stem, tense, si2), frForm(v.stem, other, si), frForm(v.stem, other, si2)];
      const choices = rsh(rng, [correct].concat(ds));
      if (new Set(choices.map(c => c.toLowerCase())).size < 4) continue;
      const label = tense === "cond" ? "conditionnel (would)" : "futur (will)";
      out.push({ topic: tense === "cond" ? "fr-conditionnel" : "fr-futur", type: "mc",
        q: "Conjugate « " + v.inf + " » for « " + FR_SUBJ[si] + " » in the " + label + ":", choices: choices, answer: choices.indexOf(correct) });
    }
    return out;
  }
  function genFrench(rng, count) {
    const byTopic = {};
    frenchItems(rng, count).forEach(it => { const tp = it.topic; delete it.topic; (byTopic[tp] = byTopic[tp] || []).push(it); });
    Object.keys(byTopic).forEach(function (tid) { const e = STUDY.topicIndex[tid]; if (e) STUDY.addQuestions(e.topic, byTopic[tid]); });
  }

  /* ---------------- run at load (Math.random) ---------------- */
  try { genFromCards(); } catch (e) { if (window.console) console.warn("card-gen", e); }
  try { genGeometry(Math.random, 4); } catch (e) { if (window.console) console.warn("geo-gen", e); }
  try { genFrench(Math.random, 18); } catch (e) { if (window.console) console.warn("fr-gen", e); }

  // exposed for seeded test/exam generation (test.js)
  STUDY.QUIZGEN = { genFromCards: genFromCards, geometryItems: geometryItems, frenchItems: frenchItems };
})(window.STUDY);
