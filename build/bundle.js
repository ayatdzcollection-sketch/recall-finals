#!/usr/bin/env node
/* Inlines the CSS + all JS into a single self-contained study-app.html that
   works by double-click (file://) or hosted anywhere — easy to share. */
const fs = require("fs"), path = require("path");
const root = path.resolve(__dirname, "..");
const read = p => fs.readFileSync(path.join(root, p), "utf8");

let html = read("index.html");

// drop external-asset links that don't apply to a single self-contained file
html = html.replace(/\s*<link rel="manifest"[^>]*>/g, "")
           .replace(/\s*<link rel="apple-touch-icon"[^>]*>/g, "");

// inline stylesheet
html = html.replace(/<link rel="stylesheet" href="([^"]+)">/g, (_, href) =>
  "<style>\n" + read(href) + "\n</style>");

// inline scripts (in document order)
html = html.replace(/<script src="([^"]+)"><\/script>/g, (_, src) =>
  "<script>\n" + read(src) + "\n</script>");

const banner = "<!-- Recall · Finals Trainer — single-file build. Generated from the multi-file project. Open by double-clicking, or host anywhere. -->\n";
const out = path.join(root, "study-app.html");
fs.writeFileSync(out, banner + html);
const kb = (fs.statSync(out).size / 1024).toFixed(0);
console.log("Wrote study-app.html (" + kb + " KB, fully self-contained)");
