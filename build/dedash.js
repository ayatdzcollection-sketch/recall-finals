#!/usr/bin/env node
/* Removes em dashes from the content data files. Card-front labels become a
   colon ("Cross Tt × Tt — ratio?" -> "Cross Tt × Tt: ratio?"); everywhere else
   the em dash becomes a comma, which reads cleanly in study prose. */
const fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, "..");
const files = ["data/ela.js", "data/biology.js", "data/french.js", "data/geometry.js", "data/history.js"];

let total = 0;
for (const f of files) {
  const p = path.join(root, f);
  const out = fs.readFileSync(p, "utf8").split("\n").map(function (line) {
    if (line.indexOf("—") === -1) return line;
    const isFront = /\bfront:\s*"/.test(line);
    const repl = isFront ? ": " : ", ";
    let l = line.replace(/ +— +/g, repl);   // spaced em dash
    l = l.replace(/—/g, ", ");               // any stray em dash
    l = l.replace(/, ,/g, ",").replace(/:\s*,/g, ":");
    total += (line.match(/—/g) || []).length;
    return l;
  }).join("\n");
  fs.writeFileSync(p, out);
}
console.log("Removed " + total + " em dashes from data files");
