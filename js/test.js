/* ============================================================
   test.js — randomized printable practice-test generator
   Builds a mock that mirrors each subject's real exam format,
   with a separate answer key. Re-roll = a brand-new test.
   ============================================================ */
(function (STUDY) {
  "use strict";
  const SRS = STUDY.SRS;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const LET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  // exam blueprints (capped to whatever content is available)
  const BLUEPRINT = {
    history: { mc: 40, match: 20, fill: 0, free: 0, writing: 0,
      note: "Mirrors the real final: ~70 multiple choice + ~30 matching (People / Events / Vocabulary)." },
    ela: { mc: 45, match: 10, fill: 0, writing: 1,
      note: "Defines &amp; identifies literary, poetic and writing terms, plus a short writing response." },
    biology: { mc: 34, match: 8, fill: 2,
      note: "Multiple choice across genetics, evolution, cells &amp; body systems." },
    french: { mc: 6, fill: 14, writing: 1,
      note: "Conjugation (conditionnel / futur), Belgium &amp; environment vocab, and an écriture prompt." },
    geometry: { mc: 18, free: 12,
      note: "Multiple choice + free-response computation. Show work; radical or rounded form as noted." },
    all: { mc: 50, match: 12, fill: 8, free: 6, writing: 1, note: "Cumulative mock across all five subjects." },
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
    const cfg = { subjectId: params.s || "all", length: "standard" };

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

    const bar = el("div", "qbar");
    const gen = el("button", "btn primary", "🖨️ Generate &amp; print");
    gen.onclick = function () { const model = TEST.generate(cfg); TEST.print(model); };
    const prev = el("button", "btn", "👀 Preview");
    prev.onclick = function () { const model = TEST.generate(cfg); previewWrap.innerHTML = ""; TEST.renderPreview(previewWrap, model, el); previewWrap.scrollIntoView({ behavior: "smooth" }); };
    bar.appendChild(prev); bar.appendChild(gen);
    app.appendChild(bar);
  };

  /* ---------------- generation ---------------- */
  function pools(subjectId) {
    const subjects = subjectId === "all" ? STUDY.subjects : [STUDY.byId[subjectId]];
    const mc = [], fill = [], free = [], cards = [], match = [];
    subjects.forEach(function (s) {
      (s.topics || []).forEach(function (t) {
        (t.questions || []).forEach(function (q) {
          if (q.type === "mc") mc.push(q);
          else if (q.type === "tf") mc.push(q);
          else if (q.type === "fill") (s.id === "geometry" ? free : fill).push(q);
          else if (q.type === "free") free.push(q);
          else if (q.type === "match") match.push(q);
        });
        (t.cards || []).forEach(function (c) { if (c.front && c.back && c.back.length < 90) cards.push(c); });
      });
    });
    return { mc, fill, free, cards, match, subjects };
  }

  TEST.generate = function (cfg) {
    const bp = Object.assign({}, BLUEPRINT[cfg.subjectId] || BLUEPRINT.all);
    const scale = cfg.length === "short" ? 0.4 : cfg.length === "standard" ? 0.75 : 1;
    const P = pools(cfg.subjectId);
    const subjName = cfg.subjectId === "all" ? "Cumulative" : STUDY.byId[cfg.subjectId].name;

    const sections = [];
    let qno = 0;

    // Part I — multiple choice
    const mcCount = Math.min(P.mc.length, Math.round((bp.mc || 0) * scale) || 0);
    if (mcCount > 0) {
      const items = SRS.shuffle(P.mc).slice(0, mcCount).map(function (q) {
        if (q.type === "tf") {
          return { no: ++qno, stem: q.q, choices: ["True", "False"], ans: q.answer ? 0 : 1 };
        }
        const order = SRS.shuffle(q.choices.map((_, i) => i));
        return { no: ++qno, stem: q.q, choices: order.map(i => q.choices[i]), ans: order.indexOf(q.answer) };
      });
      sections.push({ kind: "mc", title: "Part I · Multiple Choice", instr: "Circle the letter of the best answer.", items: items });
    }

    // Geometry / free response
    const freeCount = Math.min(P.free.length, Math.round((bp.free || 0) * scale) || 0);
    if (freeCount > 0) {
      const items = SRS.shuffle(P.free).slice(0, freeCount).map(function (q) {
        const ans = q.answers ? q.answers[0] : (q.choices ? q.choices[q.answer] : "");
        return { no: ++qno, stem: q.q, ans: ans, work: cfg.subjectId === "geometry" || q.subjectId === "geometry" };
      });
      sections.push({ kind: "free", title: "Part II · Free Response (show your work)", instr: "Write your answer in the blank. Use radical or rounded form where the problem says to.", items: items });
    }

    // Fill in / short answer
    const fillCount = Math.min(P.fill.length, Math.round((bp.fill || 0) * scale) || 0);
    if (fillCount > 0) {
      const items = SRS.shuffle(P.fill).slice(0, fillCount).map(function (q) {
        return { no: ++qno, stem: q.q, ans: (q.answers || [])[0] || "" };
      });
      sections.push({ kind: "fill", title: "Part · Fill in the Blank", instr: "Write the correct word or phrase.", items: items });
    }

    // Matching (built from term/definition cards) — blocks of ~6
    const matchTotal = Math.min(P.cards.length, Math.round((bp.match || 0) * scale) || 0);
    if (matchTotal >= 3) {
      const chosen = SRS.shuffle(P.cards).slice(0, matchTotal);
      const blocks = [];
      const BLK = 6;
      for (let i = 0; i < chosen.length; i += BLK) {
        const grp = chosen.slice(i, i + BLK);
        const bank = SRS.shuffle(grp.map(c => c.front)); // term bank
        const prompts = grp.map(function (c) {
          return { no: ++qno, def: c.back, ansLetter: LET[bank.indexOf(c.front)] };
        });
        blocks.push({ prompts: prompts, bank: bank });
      }
      sections.push({ kind: "match", title: "Part · Matching", instr: "Write the letter of the term that matches each description.", blocks: blocks });
    }

    // Writing
    if (bp.writing && WRITING[cfg.subjectId === "all" ? "all" : cfg.subjectId]) {
      const prompts = WRITING[cfg.subjectId === "all" ? "all" : cfg.subjectId];
      const p = prompts[Math.floor(Math.random() * prompts.length)];
      sections.push({ kind: "writing", title: "Part · Written Response", prompt: p });
    }

    return { title: subjName + " — Practice Final", subjName: subjName, sections: sections, total: qno,
      stamp: new Date().toLocaleDateString() };
  };

  /* ---------------- print document ---------------- */
  function buildDoc(model) {
    const wrap = document.createElement("div");
    wrap.className = "print-doc";
    let html = "";
    html += "<h1>" + esc(model.title) + "</h1>";
    html += "<div class='print-meta'><span>Name: ______________________</span><span>Date: __________</span><span>" + model.total + " questions</span></div>";
    html += "<div class='print-instr'>Randomized practice mock · generated " + esc(model.stamp) + ". Answer key on the last page.</div>";

    const key = [];
    model.sections.forEach(function (sec) {
      html += "<h2>" + esc(sec.title) + "</h2>";
      if (sec.instr) html += "<div class='print-instr'>" + sec.instr + "</div>";
      if (sec.kind === "mc") {
        sec.items.forEach(function (it) {
          html += "<div class='pq'><div class='stem'>" + it.no + ". " + esc(it.stem) + "</div><div class='pchoices'>";
          it.choices.forEach(function (c, i) { html += "<div class='pchoice'>" + LET[i] + ") " + esc(c) + "</div>"; });
          html += "</div></div>";
          key.push(it.no + ". " + LET[it.ans]);
        });
      } else if (sec.kind === "free") {
        sec.items.forEach(function (it) {
          html += "<div class='pq free'><div class='stem'>" + it.no + ". " + esc(it.stem) + "</div>";
          html += it.work ? "<div class='pwork'></div>" : "<div class='answerspace'></div>";
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
          blk.prompts.forEach(function (p) { html += "<li>____  " + esc(p.def) + "</li>"; });
          html += "</ol></div><div class='bank'><b>Terms</b><br>";
          blk.bank.forEach(function (term, i) { html += LET[i] + ". " + esc(term) + "<br>"; });
          html += "</div></div>";
          blk.prompts.forEach(function (p) { key.push(p.no + ". " + p.ansLetter); });
        });
      } else if (sec.kind === "writing") {
        html += "<div class='pq'><div class='stem'>" + esc(sec.prompt) + "</div>";
        html += "<div style='height:2.6in;border:1px solid #999;margin-top:6px'></div></div>";
      }
    });

    // answer key
    html += "<div class='page-break'></div><h1>Answer Key</h1>";
    html += "<div class='print-instr'>" + esc(model.title) + " · " + esc(model.stamp) + "</div>";
    html += "<div class='akey'>" + key.map(k => "<div>" + esc(k) + "</div>").join("") + "</div>";

    wrap.innerHTML = html;
    return wrap;
  }

  TEST.print = function (model) {
    let host = document.getElementById("print-host");
    if (host) host.remove();
    host = document.createElement("div");
    host.id = "print-host"; host.className = "print-only";
    host.appendChild(buildDoc(model));
    document.body.appendChild(host);
    window.print();
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
