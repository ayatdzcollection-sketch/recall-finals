#!/usr/bin/env node
/* Generates data/ela-pool.js from the raw Blooket answer-key JSON.
   Converts {options:{a,b,c,d}, correct:'b'} -> {q, choices:[...], answer:<index>, tag}
   Classifies each question into an ELA topic, de-dupes near-identical stems. */
const fs = require("fs");
const path = require("path");
const root = path.resolve(__dirname, "..");

const files = ["data/raw/ela_literary.json", "data/raw/ela_la9.json"];
let raw = [];
files.forEach(f => { raw = raw.concat(JSON.parse(fs.readFileSync(path.join(root, f), "utf8"))); });

// ---- topic classifier (priority order) ----
const RULES = [
  ["grammar",   /\b(run-?on|fragment|comma splice|comma|independent clause|subordinate clause|punctuation|semicolon)\b/i],
  ["writing",   /\b(thesis|topic sentence|body paragraph|introduction|conclusion|transition|mla|citation|works cited|lead-?in|essay must|integrated|point of view|first person|third person)\b/i],
  ["nonfiction",/\b(nonfiction|non-fiction|fiction|biography|autobiography|memoir|objective|subjective|ethos|pathos|logos|\bfact\b|opinion|loaded word|main idea|persuade|inform|explain|anecdote|emotional appeal|logical appeal|ethical appeal|verify|credibility|essay)\b/i],
  ["sound",     /\b(alliteration|assonance|consonance|onomatopoeia|rhyme|\bmeter\b|stanza|rhythm)\b/i],
  ["story",     /\b(plot|climax|rising action|resolution|exposition|conflict|protagonist|antagonist|characterization|narrator|omniscient|setting|\btheme\b|inciting|foreshadow|suspense|flashback|close reading)\b/i],
  ["devices",   /\b(symbolism|allusion|irony|\bpun\b|connotation|denotation|\bmood\b|\btone\b|apostrophe|motif)\b/i],
  ["figurative",/\b(simile|metaphor|hyperbole|personification|imagery|idiom|oxymoron|sensory|euphemism|figurative)\b/i],
];
function classify(stem) {
  for (const [tag, re] of RULES) if (re.test(stem)) return tag;
  return "devices";
}

const norm = s => String(s).toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const seen = new Set();
const out = [];
for (const item of raw) {
  const keys = ["a", "b", "c", "d"].filter(k => item.options[k] != null);
  const choices = keys.map(k => item.options[k]);
  const answer = keys.indexOf(item.correct);
  if (answer < 0) continue;
  const key = norm(item.q) + "|" + norm(item.correct_text || choices[answer]);
  if (seen.has(key)) continue;
  seen.add(key);
  out.push({ type: "mc", q: item.q, choices, answer, tag: classify(item.q) });
}

// counts per tag (for visibility)
const counts = {};
out.forEach(q => counts[q.tag] = (counts[q.tag] || 0) + 1);

const banner = "/* AUTO-GENERATED from data/raw/ela_*.json by build/gen-ela.js. Do not edit by hand. */\n";
const body = "window.ELA_POOL = " + JSON.stringify(out, null, 0) + ";\n";
fs.writeFileSync(path.join(root, "data/ela-pool.js"), banner + body);
console.log("Wrote data/ela-pool.js with", out.length, "questions");
console.log("By topic:", counts);
