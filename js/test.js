/* ============================================================
   test.js, randomized printable practice-test generator
   Builds a mock that mirrors each subject's real exam format,
   with a separate answer key. Re-roll = a brand-new test.
   ============================================================ */
(function (STUDY) {
  "use strict";
  const SRS = STUDY.SRS;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // --- seeded RNG so a seed reproduces an identical test on any device ---
  function hashStr(s) { s = String(s); let h = 1779033703 ^ s.length; for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = (h << 13) | (h >>> 19); } return h >>> 0; }
  function mulberry32(a) { return function () { a = (a + 0x6D2B79F5) | 0; let t = Math.imul(a ^ (a >>> 15), 1 | a); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; }
  const rshuf = (rng, a) => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(rng() * (i + 1)); const t = a[i]; a[i] = a[j]; a[j] = t; } return a; };
  const rpick = (rng, a) => a[Math.floor(rng() * a.length)];
  function newSeed() { return Math.floor(Math.random() * 1e9).toString(36) + Math.floor(Math.random() * 1e9).toString(36); }

  // exam blueprints, your finals are MULTIPLE CHOICE (scantron). Writing,
  // fill-in and listening stay in the practice modes for retention, not here.
  const BLUEPRINT = {
    history: { mc: 50, match: 20,
      note: "Scantron: multiple choice + a matching block (People / Events / Vocabulary)." },
    ela: { mc: 48, match: 10,
      note: "All multiple choice (scantron), with a small matching block for terms. Essay writing is for retention, not the final." },
    biology: { mc: 40,
      note: "All multiple choice (scantron). Focus: meiosis big-picture, p53/cancer, basic Punnett &amp; pedigrees, DNA processes, and evolution (the most questions)." },
    french: { mc: 30,
      note: "All multiple choice (scantron): conjugation, Belgium &amp; vocab. Listening &amp; the written e-mail live in their own practice modes." },
    geometry: { mc: 30,
      note: "All multiple choice (scantron) computation, area, volume, trig, circles, angles." },
    all: { mc: 60, match: 12, note: "Cumulative scantron-style mock across all five subjects." },
  };

  const WRITING = {
    ela: ["In a well-organized paragraph, state a debatable thesis about a theme in Romeo and Juliet, support it with one piece of textual evidence, and analyze how the evidence proves your claim. Use MLA in-text citation format (Author Page).",
          "Choose one poem from the unit (\"The Road Not Taken,\" \"Fog,\" \"I Wandered Lonely as a Cloud,\" \"Seven Ages of Man,\" or \"A Narrow Fellow in the Grass\"). Identify its central theme and explain how TWO poetic devices develop that theme."],
    french: ["Écris un court e-mail (5–7 phrases) à ta famille d'accueil belge. Explique 3 choses que tu aimerais faire et 1 chose que tu ne ferais pas pendant ta visite. Utilise le conditionnel. Termine par une question.",
             "Décris l'environnement : écris 4 phrases sur les canicules, la sécheresse ou les incendies, et ce qu'on pourrait faire pour protéger la planète (utilise le conditionnel)."],
    all: ["Pick any subject and write a short response a teacher could grade: state a claim and support it with two specific facts from that unit."],
  };

  const TEST = {};

  /* ---------------- setup UI ---------------- */
  TEST.renderSetup = function (app, params, h) {
    const el = h.el, sectionH = h.sectionH;
    const cfg = { subjectId: params.s || "all", length: params.len || "standard", seed: params.seed || null };
    const toast = (STUDY.QUIZ && STUDY.QUIZ.toast) || function () {};

    const card = el("div", "card");

    // subject choice
    card.appendChild(el("div", "vcap", "Subject"));
    const subjSeg = el("div", "seg"); subjSeg.style.marginBottom = "14px";
    const subjOpts = [["all", "🎓 Cumulative"]].concat(STUDY.subjects.map(s => [s.id, s.icon + " " + s.name]));
    subjOpts.forEach(function (o) {
      const b = el("button", cfg.subjectId === o[0] ? "on" : "", o[1]);
      b.onclick = function () { cfg.subjectId = o[0]; refresh(); };
      subjSeg.appendChild(b);
    });
    card.appendChild(subjSeg);

    // length choice
    card.appendChild(el("div", "vcap", "Length"));
    const lenSeg = el("div", "seg");
    [["short", "Quick"], ["standard", "Standard"], ["full", "Full final"]].forEach(function (o) {
      const b = el("button", cfg.length === o[0] ? "on" : "", o[1]);
      b.onclick = function () { cfg.length = o[0]; refresh(); };
      lenSeg.appendChild(b);
    });
    card.appendChild(lenSeg);

    const noteBox = el("div", "tip"); noteBox.style.marginTop = "14px";
    card.appendChild(noteBox);
    app.appendChild(card);

    const previewWrap = el("div");
    app.appendChild(previewWrap);

    function refresh() {
      // rerender segments' active states
      Array.from(subjSeg.children).forEach((b, i) => b.classList.toggle("on", subjOpts[i][0] === cfg.subjectId));
      Array.from(lenSeg.children).forEach((b, i) => b.classList.toggle("on", ["short", "standard", "full"][i] === cfg.length));
      const bp = BLUEPRINT[cfg.subjectId] || BLUEPRINT.all;
      noteBox.innerHTML = "<span class='i'>📋</span><div>" + bp.note + "</div>";
      previewWrap.innerHTML = "";
    }
    refresh();

    // action buttons
    const actions = el("div", "actions"); actions.style.marginTop = "6px";
    actions.appendChild(mkAction("📝", "Take it on screen", "Timed & auto-graded", function () {
      STUDY.go("#/exam?s=" + cfg.subjectId + "&len=" + cfg.length + (cfg.seed ? "&seed=" + encodeURIComponent(cfg.seed) : ""));
    }));
    actions.appendChild(mkAction("🖨️", "Make printable test", "Print or Save as PDF ↗", function () { const m = TEST.generate(cfg); if (STUDY.saveLastTest) STUDY.saveLastTest(m); TEST.print(m); }));
    actions.appendChild(mkAction("👀", "Preview on screen", "Read it, reveal answers", function () { const m = TEST.generate(cfg); if (STUDY.saveLastTest) STUDY.saveLastTest(m); previewWrap.innerHTML = ""; TEST.renderPreview(previewWrap, m, el); previewWrap.scrollIntoView({ behavior: "smooth" }); }));
    actions.appendChild(mkAction("🔗", "Share this test", "Same test for a classmate", function () {
      const seed = cfg.seed || newSeed(); cfg.seed = seed;
      const url = TEST.shareURL(cfg);
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(url).then(() => toast("Share link copied!"), () => prompt("Copy this link:", url));
      else prompt("Copy this share link:", url);
    }));
    app.appendChild(actions);

    function mkAction(icon, title, desc, onclick) {
      const a = el("button", "action"); a.appendChild(el("div", "ic", icon)); a.appendChild(el("div", "t", title)); a.appendChild(el("div", "d", desc)); a.onclick = onclick; return a;
    }

    // opened via a shared link → show the exact test immediately
    if (cfg.seed) {
      const banner = el("div", "tip"); banner.innerHTML = "<span class='i'>🔗</span><div>Shared test, this is the same randomized test for everyone with this link.</div>";
      previewWrap.appendChild(banner);
      const m = TEST.generate(cfg);
      TEST.renderPreview(previewWrap, m, el);
    }
  };

  /* ---------------- generation ----------------
     When cfg.seed is set the test is built deterministically (same on any
     device) from STATIC content only, authored/pool questions plus
     seed-generated parametric Geometry/French, so share links reproduce
     it exactly. Without a seed it draws from the full live pool. */
  function pools(subjectId, rng, deterministic) {
    const subjects = subjectId === "all" ? STUDY.subjects : [STUDY.byId[subjectId]];
    const mc = [], fill = [], free = [], cards = [], match = [];
    function bucket(q, sid) {
      if (q.type === "mc" || q.type === "tf") mc.push(q);
      else if (q.type === "fill") ((sid || q.subjectId) === "geometry" ? free : fill).push(q);
      else if (q.type === "free") free.push(q);
      else if (q.type === "match") match.push(q);
    }
    subjects.forEach(function (s) {
      (s.topics || []).forEach(function (t) {
        (t.questions || []).forEach(function (q) { if (deterministic && q.gen) return; bucket(q, s.id); });
        (t.cards || []).forEach(function (c) { if (c.front && c.back && c.back.length < 90) cards.push(c); });
      });
    });
    if (deterministic && STUDY.QUIZGEN) {                 // add reproducible parametric items
      const want = subjectId === "all" ? ["geometry", "french"] : [subjectId];
      if (want.indexOf("geometry") >= 0) STUDY.QUIZGEN.geometryItems(rng, 3).forEach(q => { q.subjectId = "geometry"; q.topicId = q.topic; mc.push(q); });
      if (want.indexOf("french") >= 0) STUDY.QUIZGEN.frenchItems(rng, 10).forEach(q => { q.subjectId = "french"; q.topicId = q.topic; mc.push(q); });
    }
    return { mc, fill, free, cards, match, subjects };
  }

  TEST.generate = function (cfg) {
    const det = !!cfg.seed;
    const rng = det ? mulberry32(hashStr(cfg.seed + "|" + cfg.subjectId + "|" + cfg.length)) : Math.random;
    const sh = (a) => det ? rshuf(rng, a) : SRS.shuffle(a);
    const bp = Object.assign({}, BLUEPRINT[cfg.subjectId] || BLUEPRINT.all);
    const scale = cfg.length === "short" ? 0.4 : cfg.length === "standard" ? 0.75 : 1;
    const P = pools(cfg.subjectId, rng, det);
    const subjName = cfg.subjectId === "all" ? "Cumulative" : STUDY.byId[cfg.subjectId].name;

    const sections = [];
    let qno = 0;

    const mcCount = Math.min(P.mc.length, Math.round((bp.mc || 0) * scale) || 0);
    if (mcCount > 0) {
      const items = sh(P.mc).slice(0, mcCount).map(function (q) {
        if (q.type === "tf") return { no: ++qno, id: q.id, stem: q.q, choices: ["True", "False"], ans: q.answer ? 0 : 1 };
        const order = sh(q.choices.map((_, i) => i));
        return { no: ++qno, id: q.id, stem: q.q, choices: order.map(i => q.choices[i]), ans: order.indexOf(q.answer) };
      });
      sections.push({ kind: "mc", title: "Part I · Multiple Choice", instr: "Circle the letter of the best answer.", items: items });
    }

    const freeCount = Math.min(P.free.length, Math.round((bp.free || 0) * scale) || 0);
    if (freeCount > 0) {
      const items = sh(P.free).slice(0, freeCount).map(function (q) {
        const ans = q.answers ? q.answers[0] : (q.choices ? q.choices[q.answer] : "");
        return { no: ++qno, id: q.id, stem: q.q, ans: ans, work: cfg.subjectId === "geometry" || q.subjectId === "geometry" };
      });
      sections.push({ kind: "free", title: "Part II · Free Response (show your work)", instr: "Write your answer in the blank. Use radical or rounded form where the problem says to.", items: items });
    }

    const fillCount = Math.min(P.fill.length, Math.round((bp.fill || 0) * scale) || 0);
    if (fillCount > 0) {
      const items = sh(P.fill).slice(0, fillCount).map(function (q) { return { no: ++qno, id: q.id, stem: q.q, ans: (q.answers || [])[0] || "" }; });
      sections.push({ kind: "fill", title: "Part · Fill in the Blank", instr: "Write the correct word or phrase.", items: items });
    }

    const matchTotal = Math.min(P.cards.length, Math.round((bp.match || 0) * scale) || 0);
    if (matchTotal >= 3) {
      const chosen = sh(P.cards).slice(0, matchTotal);
      const blocks = [];
      for (let i = 0; i < chosen.length; i += 6) {
        const grp = chosen.slice(i, i + 6);
        const bank = sh(grp.map(c => c.front));
        const prompts = grp.map(c => ({ no: ++qno, def: c.back, ansLetter: LET[bank.indexOf(c.front)] }));
        blocks.push({ prompts: prompts, bank: bank });
      }
      sections.push({ kind: "match", title: "Part · Matching", instr: "Write the letter of the term that matches each description.", blocks: blocks });
    }

    if (bp.writing && WRITING[cfg.subjectId === "all" ? "all" : cfg.subjectId]) {
      const prompts = WRITING[cfg.subjectId === "all" ? "all" : cfg.subjectId];
      sections.push({ kind: "writing", title: "Part · Written Response", prompt: det ? prompts[Math.floor(rng() * prompts.length)] : rpick(Math.random, prompts) });
    }

    return { title: subjName + ": Practice Final", subjName: subjName, subjectId: cfg.subjectId, length: cfg.length,
      seed: cfg.seed || null, sections: sections, total: qno, stamp: new Date().toLocaleDateString() };
  };

  /* flat question list for on-screen Exam Mode, MULTIPLE CHOICE only (scantron) */
  TEST.examQuestions = function (cfg) {
    const det = !!cfg.seed;
    const rng = det ? mulberry32(hashStr((cfg.seed || "") + "|exam|" + cfg.subjectId)) : Math.random;
    const P = pools(cfg.subjectId, rng, det);
    let qs = P.mc.slice();
    qs = (det ? rshuf(rng, qs) : SRS.shuffle(qs));
    // de-dupe by stem
    const seen = {}, out = [];
    qs.forEach(q => { const k = (q.q || "").toLowerCase(); if (!seen[k]) { seen[k] = 1; out.push(q); } });
    const n = cfg.count || (cfg.length === "short" ? 15 : cfg.length === "full" ? 40 : 25);
    return out.slice(0, Math.min(out.length, n));
  };

  TEST.newSeed = newSeed;
  TEST.shareURL = function (cfg) {
    const seed = cfg.seed || newSeed();
    const base = location.href.split("#")[0];
    return base + "#/test?s=" + encodeURIComponent(cfg.subjectId) + "&len=" + encodeURIComponent(cfg.length || "standard") + "&seed=" + encodeURIComponent(seed);
  };

  /* ---------------- printable document (its own page) ---------------- */
  function buildBody(model) {
    let html = "";
    const key = [];
    model.sections.forEach(function (sec) {
      html += "<h2>" + esc(sec.title) + "</h2>";
      if (sec.instr) html += "<div class='instr'>" + sec.instr + "</div>";
      if (sec.kind === "mc") {
        sec.items.forEach(function (it) {
          html += "<div class='pq'><div class='stem'>" + it.no + ". " + esc(it.stem) + "</div><div class='pchoices'>";
          it.choices.forEach(function (c, i) { html += "<div>" + LET[i] + ") " + esc(c) + "</div>"; });
          html += "</div></div>";
          key.push(it.no + ". " + LET[it.ans]);
        });
      } else if (sec.kind === "free") {
        sec.items.forEach(function (it) {
          html += "<div class='pq'><div class='stem'>" + it.no + ". " + esc(it.stem) + "</div>";
          html += it.work ? "<div class='pwork'></div>" : "";
          html += "<div>Answer: ____________________</div></div>";
          key.push(it.no + ". " + esc(it.ans));
        });
      } else if (sec.kind === "fill") {
        sec.items.forEach(function (it) {
          html += "<div class='pq'><div class='stem'>" + it.no + ". " + esc(it.stem) + " &nbsp;____________________</div></div>";
          key.push(it.no + ". " + esc(it.ans));
        });
      } else if (sec.kind === "match") {
        sec.blocks.forEach(function (blk) {
          html += "<div class='pmatch'><div><ol start='" + blk.prompts[0].no + "'>";
          blk.prompts.forEach(function (p) { html += "<li>____&nbsp;&nbsp;" + esc(p.def) + "</li>"; });
          html += "</ol></div><div class='bank'><b>Terms</b><br>";
          blk.bank.forEach(function (term, i) { html += LET[i] + ". " + esc(term) + "<br>"; });
          html += "</div></div>";
          blk.prompts.forEach(function (p) { key.push(p.no + ". " + p.ansLetter); });
        });
      } else if (sec.kind === "writing") {
        html += "<div class='pq'><div class='stem'>" + esc(sec.prompt) + "</div>";
        html += "<div class='wbox'></div></div>";
      }
    });
    return { html: html, key: key };
  }

  const PRINT_CSS =
    "*{box-sizing:border-box}body{font-family:Georgia,'Times New Roman',serif;color:#111;margin:0;background:#eef0f4}" +
    ".bar{position:sticky;top:0;z-index:9;display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:10px 14px;background:#15163a;color:#fff}" +
    ".bar b{font-family:system-ui,sans-serif;font-size:14px;margin-right:auto}" +
    ".bar button{font:600 14px system-ui;padding:10px 15px;border-radius:9px;border:0;cursor:pointer;background:#fff;color:#15163a}" +
    ".bar button.p{background:#6c5ce7;color:#fff}" +
    ".sheet{max-width:740px;margin:16px auto;background:#fff;padding:32px 40px;box-shadow:0 3px 18px rgba(0,0,0,.14)}" +
    "h1{font-size:22px;margin:0 0 4px}h2{font-size:15px;font-family:system-ui,sans-serif;border-bottom:1.5px solid #111;padding-bottom:3px;margin:22px 0 10px}" +
    ".meta{display:flex;justify-content:space-between;gap:8px;flex-wrap:wrap;border:1px solid #111;padding:7px 12px;font-size:13px;font-family:system-ui,sans-serif;margin:8px 0}" +
    ".instr{font-size:12.5px;font-style:italic;color:#333;margin-bottom:10px}" +
    ".pq{margin:0 0 13px;break-inside:avoid}.pq .stem{font-weight:bold;margin-bottom:3px}" +
    ".pchoices{display:grid;grid-template-columns:1fr 1fr;gap:2px 18px;padding-left:16px;font-size:14px}" +
    ".pwork{height:1.05in}.wbox{height:2.4in;border:1px solid #999;margin-top:6px}" +
    ".pmatch{display:grid;grid-template-columns:1fr 1fr;gap:16px;break-inside:avoid}.pmatch ol{margin:0;padding-left:22px}.pmatch li{margin:5px 0}" +
    ".bank{border:1px solid #111;padding:8px 11px;font-size:13px;height:max-content}" +
    ".akey-page{display:none;border-top:3px double #111;margin-top:26px;padding-top:12px}" +
    ".akey{font-size:13px;columns:2;column-gap:26px}.akey div{margin:2px 0;break-inside:avoid}" +
    "@media print{body{background:#fff}.bar{display:none}.sheet{box-shadow:none;margin:0;max-width:none;padding:0}.akey-page{display:block;break-before:page}@page{margin:.6in}}" +
    "@media(max-width:560px){.sheet{padding:20px 16px;margin:0}.pchoices{grid-template-columns:1fr}.pmatch{grid-template-columns:1fr}.akey{columns:1}}";

  function buildPrintHTML(model) {
    const b = buildBody(model);
    const keyHtml = b.key.map(k => "<div>" + esc(k) + "</div>").join("");
    return "<!doctype html><html lang='en'><head><meta charset='utf-8'>" +
      "<meta name='viewport' content='width=device-width,initial-scale=1'>" +
      "<title>" + esc(model.title) + "</title><style>" + PRINT_CSS + "</style></head><body>" +
      "<div class='bar'><b>" + esc(model.title) + "</b>" +
      "<button class='p' onclick='window.print()'>🖨️ Print / Save as PDF</button>" +
      "<button id='kbtn' onclick='tk()'>Show answer key</button></div>" +
      "<div class='sheet'>" +
      "<h1>" + esc(model.title) + "</h1>" +
      "<div class='meta'><span>Name: __________________</span><span>Date: __________</span><span>" + model.total + " questions</span></div>" +
      "<div class='instr'>Randomized practice mock, generated " + esc(model.stamp) + ". On a phone: tap Print / Save as PDF, then choose Save to Files or a printer. Answer key prints on its own page.</div>" +
      b.html +
      "<div class='akey-page' id='akey'><h2>Answer Key</h2><div class='akey'>" + keyHtml + "</div></div>" +
      "</div>" +
      "<script>function tk(){var k=document.getElementById('akey'),b=document.getElementById('kbtn');var on=k.style.display==='block';k.style.display=on?'none':'block';b.textContent=on?'Show answer key':'Hide answer key';if(!on)k.scrollIntoView({behavior:'smooth'});}<\/script>" +
      "</body></html>";
  }

  TEST.print = function (model) {
    const html = buildPrintHTML(model);
    let w = null;
    try { w = window.open("", "_blank"); } catch (e) { w = null; }
    if (w && w.document) { w.document.open(); w.document.write(html); w.document.close(); w.focus && w.focus(); return; }
    // pop-up blocked: fall back to a downloadable/openable file
    try {
      const blob = new Blob([html], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.target = "_blank"; a.rel = "noopener"; a.download = (model.subjName || "practice") + "-test.html";
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 30000);
      if (STUDY.QUIZ && STUDY.QUIZ.toast) STUDY.QUIZ.toast("Saved the printable test. Open it, then Print/Save PDF");
    } catch (e) {
      if (STUDY.QUIZ && STUDY.QUIZ.toast) STUDY.QUIZ.toast("Couldn't open the print view. Try Preview instead");
    }
  };

  /* ---------------- on-screen preview (mobile-friendly) ---------------- */
  TEST.renderPreview = function (mount, model, el) {
    const head = el("div", "row"); head.style.margin = "8px 2px";
    head.appendChild(el("div", null, "<b>" + esc(model.title) + "</b><div class='muted' style='font-size:.82rem'>" + model.total + " questions · generated " + esc(model.stamp) + "</div>"));
    head.appendChild(el("div", "spacer"));
    let showKey = false;
    const toggle = el("button", "btn sm", "Show answers");
    head.appendChild(toggle);
    mount.appendChild(head);

    const docWrap = el("div", "card");
    mount.appendChild(docWrap);

    function paint() {
      docWrap.innerHTML = "";
      model.sections.forEach(function (sec) {
        docWrap.appendChild(el("h3", "lh", sec.title));
        if (sec.instr) docWrap.appendChild(el("p", "note", sec.instr));
        if (sec.kind === "mc") {
          sec.items.forEach(function (it) {
            const q = el("div"); q.style.margin = "0 0 12px";
            q.innerHTML = "<div style='font-weight:600'>" + it.no + ". " + esc(it.stem) + "</div>";
            it.choices.forEach(function (c, i) {
              const ok = showKey && i === it.ans;
              q.innerHTML += "<div style='padding:2px 0 2px 14px;" + (ok ? "color:var(--good);font-weight:700" : "") + "'>" + LET[i] + ") " + esc(c) + (ok ? " ✓" : "") + "</div>";
            });
            docWrap.appendChild(q);
          });
        } else if (sec.kind === "free" || sec.kind === "fill") {
          sec.items.forEach(function (it) {
            const q = el("div"); q.style.margin = "0 0 10px";
            q.innerHTML = "<div style='font-weight:600'>" + it.no + ". " + esc(it.stem) + "</div>" +
              (showKey ? "<div style='color:var(--good);font-weight:700;padding-left:14px'>✓ " + esc(it.ans) + "</div>" : "<div style='color:var(--text-faint);padding-left:14px'>____________________</div>");
            docWrap.appendChild(q);
          });
        } else if (sec.kind === "match") {
          sec.blocks.forEach(function (blk) {
            const bank = el("div", "panel"); bank.style.margin = "6px 0";
            bank.innerHTML = "<b>Terms:</b> " + blk.bank.map((t, i) => LET[i] + ". " + esc(t)).join(" &nbsp; ");
            docWrap.appendChild(bank);
            blk.prompts.forEach(function (p) {
              const q = el("div"); q.style.margin = "0 0 6px";
              q.innerHTML = "<span style='color:var(--text-faint)'>" + (showKey ? "<b style='color:var(--good)'>" + p.ansLetter + "</b>" : "____") + "</span> &nbsp;" + p.no + ". " + esc(p.def);
              docWrap.appendChild(q);
            });
          });
        } else if (sec.kind === "writing") {
          docWrap.appendChild(el("p", null, "<b>" + esc(sec.prompt) + "</b>"));
          docWrap.appendChild(el("div", "panel", "<span class='muted'>Write your response on paper or a doc.</span>"));
        }
      });
    }
    toggle.onclick = function () { showKey = !showKey; toggle.textContent = showKey ? "Hide answers" : "Show answers"; paint(); };
    paint();

    const bar = el("div", "qbar");
    const pr = el("button", "btn primary", "🖨️ Print / Save PDF");
    pr.onclick = function () { TEST.print(model); };
    const re = el("button", "btn", "🎲 Re-roll");
    re.onclick = function () { const m2 = TEST.generate({ subjectId: model.subjName === "Cumulative" ? "all" : (STUDY.subjects.find(s => s.name === model.subjName) || {}).id || "all", length: "standard" }); mount.innerHTML = ""; TEST.renderPreview(mount, m2, el); };
    bar.appendChild(re); bar.appendChild(pr);
    mount.appendChild(bar);
  };

  STUDY.TEST = TEST;
})(window.STUDY);
