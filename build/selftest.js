#!/usr/bin/env node
/* Headless sanity check: loads the engine + data with DOM stubs, then validates
   every question and exercises session/test generation. Not shipped. */
const fs = require("fs"), path = require("path"), vm = require("vm");
const root = path.resolve(__dirname, "..");

// --- minimal browser stubs ---
const store = {};
const fakeEl = () => new Proxy(function () {}, {
  get: (t, k) => (k === "style" ? { setProperty() {} } : k in t ? t[k] : (() => fakeEl())),
  set: () => true, apply: () => fakeEl(),
});
const sandbox = {
  console,
  localStorage: { getItem: k => store[k] || null, setItem: (k, v) => store[k] = v, removeItem: k => delete store[k] },
  document: {
    readyState: "loading", // keep app.js boot() from auto-running
    getElementById: () => null,
    createElement: () => fakeEl(),
    addEventListener: () => {},
    documentElement: { setAttribute() {}, style: { setProperty() {} } },
  },
  location: { hash: "", replace() {} },
  setTimeout, clearTimeout,
};
sandbox.window = sandbox;
const ctx = vm.createContext(sandbox);

const files = [
  "js/storage.js", "js/srs.js", "js/adaptive.js", "js/telemetry.js", "data/ela-pool.js",
  "data/ela.js", "data/biology.js", "data/french.js", "data/french-listen.js", "data/geometry.js", "data/history.js", "data/history-timeline.js",
  "data/extra.js", "data/hard.js", "data/diagrams.js", "data/pedigrees.js",
  "js/quizgen.js",
  "js/quiz.js", "js/test.js", "js/app.js",
];
for (const f of files) {
  try { vm.runInContext(fs.readFileSync(path.join(root, f), "utf8"), ctx, { filename: f }); }
  catch (e) { console.error("✗ Load error in", f, "\n", e.message); process.exit(1); }
}

const STUDY = sandbox.STUDY;
let errors = 0, q = 0, cards = 0;
const fail = (m) => { console.error("✗", m); errors++; };

if (STUDY.subjects.length !== 5) fail("expected 5 subjects, got " + STUDY.subjects.length);

const report = [];
for (const s of STUDY.subjects) {
  let sq = 0, sc = 0, types = {};
  for (const t of s.topics) {
    if (!t.lesson || !t.lesson.length) fail(`${s.id}/${t.id} has no lesson`);
    if (!t.visual) fail(`${s.id}/${t.id} has no visual`);
    (t.cards || []).forEach(c => { sc++; cards++; if (!c.front || !c.back) fail(`${t.id} card missing front/back`); });
    (t.questions || []).forEach((qq, i) => {
      q++; sq++; types[qq.type] = (types[qq.type] || 0) + 1;
      if (!qq.q) fail(`${t.id} q${i} missing stem`);
      if (qq.type === "mc") {
        if (!Array.isArray(qq.choices) || qq.choices.length < 2) fail(`${t.id} q${i} mc needs >=2 choices`);
        if (typeof qq.answer !== "number" || qq.answer < 0 || qq.answer >= qq.choices.length) fail(`${t.id} q${i} mc answer index out of range (${qq.answer}/${qq.choices.length})`);
        if (new Set(qq.choices.map(c => String(c).trim())).size !== qq.choices.length) fail(`${t.id} q${i} mc has duplicate choices: ${JSON.stringify(qq.choices)}`);
      } else if (qq.type === "fill") {
        if (!Array.isArray(qq.answers) || !qq.answers.length) fail(`${t.id} q${i} fill needs answers[]`);
      } else if (qq.type === "tf") {
        if (typeof qq.answer !== "boolean") fail(`${t.id} q${i} tf needs boolean answer`);
      } else if (qq.type === "match") {
        if (!Array.isArray(qq.pairs)) fail(`${t.id} q${i} match needs pairs[]`);
      } else fail(`${t.id} q${i} unknown type ${qq.type}`);
    });
  }
  report.push(`  ${s.icon} ${s.name.padEnd(10)} weight ${s.weight} · ${s.topics.length} topics · ${sq} Q (${JSON.stringify(types)}) · ${sc} cards`);
}

console.log("Subjects:");
report.forEach(r => console.log(r));
let genCount = 0;
STUDY.subjects.forEach(s => s.topics.forEach(t => (t.questions || []).forEach(qq => { if (qq.gen) genCount++; })));
console.log(`Totals: ${q} questions (${genCount} auto-generated, ${q - genCount} authored/pool), ${cards} flashcards`);

// exercise engine
try {
  const sess = STUDY.SRS.buildSession({ size: 16 });
  if (!sess.length) fail("buildSession returned empty");
  for (const cfg of [{ subjectId: "all", length: "standard" }, { subjectId: "history", length: "full" }, { subjectId: "geometry", length: "standard" }, { subjectId: "french", length: "full" }, { subjectId: "ela", length: "full" }]) {
    const m = STUDY.TEST.generate(cfg);
    if (!m.sections.length) fail("test.generate empty for " + JSON.stringify(cfg));
    // verify every mc answer index valid in generated test
    m.sections.forEach(sec => {
      if (sec.kind === "mc") sec.items.forEach(it => { if (it.ans < 0 || it.ans >= it.choices.length) fail("generated mc bad ans " + cfg.subjectId); });
    });
    console.log(`  test[${cfg.subjectId}/${cfg.length}]: ${m.total} items, sections: ${m.sections.map(s => s.kind).join("+")}`);
  }
} catch (e) { fail("engine exercise threw: " + e.message + "\n" + e.stack); }

console.log(errors ? `\n✗ ${errors} problem(s) found` : "\n✓ All checks passed");
process.exit(errors ? 1 : 0);
