/* ============================================================
   app.js — router, screens, lesson & visual rendering
   ============================================================ */
(function (STUDY) {
  "use strict";
  const QUIZ = STUDY.QUIZ, SRS = STUDY.SRS, TEST = STUDY.TEST;
  const app = document.getElementById("app");

  const FINALS_TARGET = new Date(2026, 5, 9); // June 9, 2026 (French exam; finals week)
  const EXAM_NOTE = {
    french: "Oral June 9 · Written June 9–10",
    biology: "Finals week",
    ela: "Finals week",
    geometry: "Finals week",
    history: "Finals week",
  };

  /* ---------- tiny dom helpers ---------- */
  function el(tag, cls, html) { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }
  function esc(s) { return String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c])); }
  function mdInline(s) {
    return esc(s)
      .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*([^*]+)\*/g, "$1<em>$2</em>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\n/g, "<br>");
  }
  function clear() { app.innerHTML = ""; }
  function go(hash) { location.hash = hash; }

  /* ---------- top bar + breadcrumb ---------- */
  function topbar() {
    const bar = el("div", "topbar");
    const brand = el("div", "brand");
    brand.style.cursor = "pointer";
    brand.onclick = () => go("#/home");
    brand.appendChild(el("div", "logo", "R"));
    brand.appendChild(document.createTextNode("Recall"));
    bar.appendChild(brand);
    bar.appendChild(el("div", "spacer"));
    const dash = el("button", "iconbtn"); dash.title = "Progress"; dash.innerHTML = "📊";
    dash.onclick = () => go("#/dash");
    const t = el("button", "iconbtn"); t.title = "Toggle theme"; t.innerHTML = STUDY.theme() === "dark" ? "🌙" : "☀️";
    t.onclick = () => { const nx = STUDY.theme() === "dark" ? "light" : "dark"; STUDY.setTheme(nx); t.innerHTML = nx === "dark" ? "🌙" : "☀️"; };
    const set = el("button", "iconbtn"); set.title = "Settings"; set.innerHTML = "⚙️";
    set.onclick = () => go("#/settings");
    bar.appendChild(dash); bar.appendChild(t); bar.appendChild(set);
    return bar;
  }
  function crumb(parts) {
    const c = el("div", "crumb");
    parts.forEach(function (p, i) {
      if (i) c.appendChild(el("span", "sep", "›"));
      if (p.hash) { const a = el("a", null, esc(p.label)); a.onclick = () => go(p.hash); c.appendChild(a); }
      else c.appendChild(el("span", null, esc(p.label)));
    });
    return c;
  }

  function daysToFinals() {
    const now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.round((FINALS_TARGET - now) / 86400000);
  }

  /* ====================================================
     HOME
     ==================================================== */
  function renderHome() {
    clear();
    app.appendChild(topbar());

    const hero = el("div", "hero");
    const hr = new Date().getHours();
    const greet = hr < 12 ? "Good morning" : hr < 18 ? "Good afternoon" : "Good evening";
    hero.appendChild(el("h1", null, greet + ". Let's lock it in."));
    hero.appendChild(el("p", null, "Active recall &amp; spaced repetition for your five finals. Pick up where you left off."));
    const d = daysToFinals();
    const cd = el("div", "countdown");
    cd.innerHTML = "⏳ " + (d > 1 ? d + " days until finals" : d === 1 ? "Finals tomorrow" : d === 0 ? "Finals are here. You've got this" : "Finals week. Good luck!");
    hero.appendChild(cd);
    app.appendChild(hero);

    // stat chips
    const st = STUDY.store();
    const chips = el("div", "chips");
    chips.appendChild(statChip("🔥", st.streak.count, "day streak"));
    const due = STUDY.overallDue();
    chips.appendChild(statChip("🔁", due, "due to review"));
    const mastery = overallMastery();
    chips.appendChild(statChip("🎯", mastery + "%", "overall mastery"));
    app.appendChild(chips);

    // primary actions
    const actions = el("div", "actions");
    actions.appendChild(actionCard("wide", "⚡", "Smart Study", "Interleaved mix of new + due material across all subjects", () => startSmart(null)));
    actions.appendChild(actionCard("", "🔥", "Cram Mode", "Blitz a subject before the exam", () => go("#/cram")));
    actions.appendChild(actionCard("", "🔀", "Mixed Practice", "20 random questions, all subjects", () => startMixed(null, 20)));
    actions.appendChild(actionCard("", due ? "" : "", "🔁 Review", due ? due + " items due now" : "Nothing due. Nice.", () => startReview(null)));
    actions.appendChild(actionCard("", "📝", "Practice Test", "Print or take a timed mock final", () => go("#/test")));
    actions.appendChild(actionCard("", "📊", "My Progress", "Mastery, weak spots & streak", () => go("#/dash")));
    app.appendChild(actions);

    // subjects
    app.appendChild(sectionH("Subjects", "weighted by how much it matters on your finals"));
    const list = el("div", "subjects");
    STUDY.subjects.forEach(function (s) { list.appendChild(subjectCard(s)); });
    app.appendChild(list);

    app.appendChild(footerNote());
  }

  function statChip(icon, val, k) {
    const c = el("div", "chip");
    c.appendChild(el("span", null, icon));
    const box = el("div"); box.appendChild(el("b", null, String(val))); box.appendChild(el("div", "k", k));
    c.appendChild(box); return c;
  }
  function actionCard(extra, icon, title, desc, onclick) {
    const a = el("button", "action " + extra);
    if (icon) a.appendChild(el("div", "ic", icon));
    a.appendChild(el("div", "t", title));
    a.appendChild(el("div", "d", desc));
    a.onclick = onclick; return a;
  }
  function sectionH(title, hint) {
    const h = el("div", "sec-h");
    h.appendChild(el("h2", null, esc(title)));
    if (hint) h.appendChild(el("div", "hint", esc(hint)));
    return h;
  }

  function subjectCard(s) {
    const card = el("div", "subject");
    card.style.setProperty("--sub", s.accent);
    card.onclick = () => go("#/s/" + s.id);
    card.appendChild(el("div", "badge", s.icon));
    const info = el("div", "info");
    const prog = STUDY.subjectProgress(s.id);
    info.appendChild(el("h3", null, esc(s.name)));
    info.appendChild(el("div", "meta", prog.topics + " topics · " + prog.items + " items · " + esc(EXAM_NOTE[s.id] || "")));
    card.appendChild(info);

    const right = el("div", "prog");
    if (prog.due) right.appendChild(el("div", "due-pill", prog.due + " due"));
    const ring = el("div", "ring");
    const pct = Math.round(prog.mastery * 100);
    ring.style.setProperty("--p", pct);
    ring.style.setProperty("--sub", s.accent);
    ring.appendChild(el("div", "inner", pct + "%"));
    right.appendChild(ring);
    const dots = el("div", "weight-dots");
    for (let i = 0; i < 5; i++) { const d = el("i", i < s.weight ? "" : "off"); dots.appendChild(d); }
    right.appendChild(dots);
    card.appendChild(right);
    return card;
  }

  function overallMastery() {
    let sum = 0, n = 0;
    STUDY.subjects.forEach(function (s) { sum += STUDY.subjectProgress(s.id).mastery; n++; });
    return n ? Math.round(sum / n * 100) : 0;
  }

  function footerNote() {
    const f = el("div", "empty");
    f.style.cssText = "margin-top:30px;font-size:.78rem";
    f.innerHTML = "Progress saves automatically on this device. Share the link with a classmate and everyone gets their own progress.";
    return f;
  }

  /* ====================================================
     SUBJECT
     ==================================================== */
  function renderSubject(id) {
    const s = STUDY.byId[id];
    if (!s) return go("#/home");
    clear();
    app.appendChild(topbar());
    document.documentElement.style.setProperty("--accent", s.accent);
    app.appendChild(crumb([{ label: "Home", hash: "#/home" }, { label: s.name }]));

    const head = el("div", "hero");
    head.style.margin = "0 2px 8px";
    head.appendChild(el("h1", null, s.icon + " " + esc(s.name)));
    if (s.intro) head.appendChild(el("p", null, mdInline(s.intro)));
    app.appendChild(head);

    const prog = STUDY.subjectProgress(s.id);
    const chips = el("div", "chips");
    chips.appendChild(statChip("🎯", Math.round(prog.mastery * 100) + "%", "mastery"));
    chips.appendChild(statChip("📚", prog.topicsSeen + "/" + prog.topics, "topics started"));
    chips.appendChild(statChip("🔁", prog.due, "due now"));
    app.appendChild(chips);

    const actions = el("div", "actions");
    actions.appendChild(actionCard("wide", "🔥", "Cram " + s.name, "Fast last-minute drilling of your weak + unseen items", () => startCram(s.id)));
    actions.appendChild(actionCard("", "⚡", "Smart Study", "Interleaved smart mix", () => startSmart(s.id)));
    actions.appendChild(actionCard("", "🔀", "Mixed Practice", "Random questions", () => startMixed(s.id, 15)));
    actions.appendChild(actionCard("", "📝", "Exam Mode", "Timed & auto-graded", () => go("#/exam?s=" + s.id)));
    actions.appendChild(actionCard("", "🖨️", "Practice Test", "Print or share a mock", () => go("#/test?s=" + s.id)));
    if (s.id === "french") actions.appendChild(actionCard("", "🔊", "Listening", "Hear & recall (oral prep)", () => startListening()));
    app.appendChild(actions);

    app.appendChild(sectionH("Topics", "tap to learn, flip cards, then test yourself"));
    s.topics.forEach(function (t, i) {
      const tp = STUDY.topicProgress(t.id);
      const row = el("div", "topic");
      row.style.setProperty("--sub", s.accent);
      row.onclick = () => go("#/t/" + t.id);
      row.appendChild(el("div", "n", String(i + 1)));
      const tt = el("div", "tt");
      tt.appendChild(el("h4", null, esc(t.title)));
      tt.appendChild(el("p", null, esc(t.blurb || "")));
      const bar = el("div", "bar"); bar.appendChild(el("i")).style.width = Math.round(tp.mastery * 100) + "%";
      tt.appendChild(bar);
      // completion roadmap: Learn / Cards / Practice
      const d = STUDY.topicDone(t.id);
      const dots = el("div", "tdots");
      [["learn", "Learn"], ["cards", "Cards"], ["practice", "Practice"]].forEach(function (p) {
        if (p[0] === "cards" && !(t.cards && t.cards.length)) return;
        const on = !!d[p[0]];
        dots.appendChild(el("div", "tdot" + (on ? " on" : ""), (on ? "✓ " : "") + p[1]));
      });
      tt.appendChild(dots);
      row.appendChild(tt);
      let state = "○";
      if (d.practice && tp.mastery >= 0.8) state = "✅";
      else if (tp.due) state = "🔁";
      else if (d.practice) state = "✓";
      else if (tp.seen) state = "•";
      row.appendChild(el("div", "state", state));
      app.appendChild(row);
    });
  }

  /* ====================================================
     TOPIC  (Learn / Cards / Practice tabs)
     ==================================================== */
  function renderTopic(id, tab) {
    const entry = STUDY.topicIndex[id];
    if (!entry) return go("#/home");
    const s = entry.subject, t = entry.topic;
    STUDY.markSeen(id);
    clear();
    app.appendChild(topbar());
    document.documentElement.style.setProperty("--accent", s.accent);
    app.appendChild(crumb([{ label: "Home", hash: "#/home" }, { label: s.name, hash: "#/s/" + s.id }, { label: t.title }]));

    const h = el("div", "hero"); h.style.margin = "0 2px 10px";
    h.appendChild(el("h1", null, esc(t.title)));
    if (t.blurb) h.appendChild(el("p", null, esc(t.blurb)));
    app.appendChild(h);

    // tabs
    const seg = el("div", "seg");
    const tabs = [["learn", "📖 Learn"], ["cards", "🗂 Cards (" + (t.cards ? t.cards.length : 0) + ")"], ["practice", "✍️ Practice (" + (t.questions ? t.questions.length : 0) + ")"]];
    const body = el("div"); body.style.marginTop = "16px";
    tabs.forEach(function (tb) {
      const b = el("button", tab === tb[0] ? "on" : "", tb[1]);
      b.onclick = function () { go("#/t/" + id + "/" + tb[0]); };
      seg.appendChild(b);
    });
    app.appendChild(seg);
    app.appendChild(body);

    if (tab === "cards") {
      if (!t.cards || !t.cards.length) { body.innerHTML = '<div class="empty">No flashcards for this topic yet. Head to Practice.</div>'; return; }
      QUIZ.runCards(body, t.cards.slice(), { doneLabel: "Back to topic", onDone: () => { STUDY.markDone(id, "cards"); go("#/t/" + id + "/learn"); } });
    } else if (tab === "practice") {
      if (!t.questions || !t.questions.length) { body.innerHTML = '<div class="empty">No questions yet for this topic.</div>'; return; }
      // practice draws from the FULL pool for this topic (authored + variety + generated)
      QUIZ.run(body, SRS.shuffle(t.questions.slice()), {
        showTags: false, doneLabel: "Back to topic",
        onResults: (state) => STUDY.markDone(id, "practice", state.correct / Math.max(1, state.list.length)),
        onDone: () => go("#/t/" + id + "/learn"),
      });
    } else {
      renderLesson(body, t);
      const bar = el("div", "qbar");
      const c = el("button", "btn", "🗂 Cards");
      c.onclick = () => go("#/t/" + id + "/cards");
      const p = el("button", "btn primary", "Test yourself →");
      p.onclick = () => go("#/t/" + id + "/practice");
      if (t.cards && t.cards.length) bar.appendChild(c);
      bar.appendChild(p);
      body.appendChild(bar);
    }
  }

  /* ---------- lesson + visual rendering ---------- */
  function renderLesson(mount, t) {
    const wrap = el("div", "lesson card");
    (t.lesson || []).forEach(function (b) {
      if (b.h) wrap.appendChild(el("h3", "lh", esc(b.h)));
      else if (b.p) wrap.appendChild(el("p", null, mdInline(b.p)));
      else if (b.note) wrap.appendChild(el("p", "note", mdInline(b.note)));
      else if (b.list) { const ul = el("ul"); b.list.forEach(x => ul.appendChild(el("li", null, mdInline(x)))); wrap.appendChild(ul); }
      else if (b.olist) { const ol = el("ol"); b.olist.forEach(x => ol.appendChild(el("li", null, mdInline(x)))); wrap.appendChild(ol); }
      else if (b.term) { const d = el("div", "def"); d.appendChild(el("div", "term", esc(b.term))); d.appendChild(el("div", "d", mdInline(b.def))); wrap.appendChild(d); }
      else if (b.defs) { const dl = el("div", "deflist"); b.defs.forEach(function (p) { const d = el("div", "def"); d.appendChild(el("div", "term", esc(p[0]))); d.appendChild(el("div", "d", mdInline(p[1]))); dl.appendChild(d); }); wrap.appendChild(dl); }
      else if (b.example) { const e = el("div", "example"); e.appendChild(el("span", "lbl", b.as || "Example")); e.insertAdjacentHTML("beforeend", mdInline(b.example)); wrap.appendChild(e); }
      else if (b.tip) { const tp = el("div", "tip"); tp.appendChild(el("span", "i", "💡")); tp.appendChild(el("div", null, mdInline(b.tip))); wrap.appendChild(tp); }
    });
    if (t.visual) wrap.appendChild(renderVisual(t.visual));
    mount.appendChild(wrap);
  }

  function renderVisual(v) {
    const box = el("div", "visual");
    if (v.cap) box.appendChild(el("div", "vcap", esc(v.cap)));
    if (v.type === "table") {
      const tbl = el("table", "vt");
      if (v.head) { const tr = el("tr"); v.head.forEach(h => tr.appendChild(el("th", null, mdInline(h)))); tbl.appendChild(el("thead")).appendChild(tr); }
      const tb = el("tbody");
      (v.rows || []).forEach(function (r) { const tr = el("tr"); r.forEach(c => tr.appendChild(el("td", null, mdInline(c)))); tb.appendChild(tr); });
      tbl.appendChild(tb); box.appendChild(tbl);
    } else if (v.type === "flow") {
      const f = el("div", "flow");
      (v.steps || []).forEach(function (s, i) {
        if (i) f.appendChild(el("div", "arrow", "→"));
        const st = el("div", "step");
        if (s.i) st.appendChild(el("div", "si", s.i));
        st.appendChild(el("div", "sn", esc(s.n)));
        if (s.d) st.appendChild(el("div", "sd", esc(s.d)));
        f.appendChild(st);
      });
      box.appendChild(f);
    } else if (v.type === "compare") {
      const c = el("div", "compare");
      [v.left, v.right].forEach(function (col) {
        const cc = el("div", "col");
        cc.appendChild(el("h5", null, esc(col.h)));
        const ul = el("ul"); col.items.forEach(x => ul.appendChild(el("li", null, mdInline(x)))); cc.appendChild(ul);
        c.appendChild(cc);
      });
      box.appendChild(c);
    } else if (v.type === "concept") {
      const c = el("div", "concept");
      c.appendChild(el("div", "hubn", esc(v.hub)));
      const lv = el("div", "leaves");
      (v.leaves || []).forEach(function (n) { const leaf = el("div", "leaf"); leaf.appendChild(el("b", null, esc(n.b))); if (n.s) leaf.appendChild(el("span", null, mdInline(n.s))); lv.appendChild(leaf); });
      c.appendChild(lv); box.appendChild(c);
    } else if (v.type === "timeline") {
      const tl = el("div", "tline");
      (v.events || []).forEach(function (e) { const ev = el("div", "tev"); ev.appendChild(el("div", "td", esc(e.d))); ev.appendChild(el("div", "tx", mdInline(e.t))); tl.appendChild(ev); });
      box.appendChild(tl);
    } else if (v.type === "svg") {
      box.insertAdjacentHTML("beforeend", v.svg);
    }
    return box;
  }

  /* ====================================================
     STUDY SESSIONS
     ==================================================== */
  function sessionScreen(title, run) {
    clear();
    app.appendChild(topbar());
    const back = el("div", "crumb"); const a = el("a", null, "‹ Exit session"); a.onclick = () => history.length > 1 ? history.back() : go("#/home"); back.appendChild(a);
    app.appendChild(back);
    app.appendChild(el("div", "q-kicker", esc(title)));
    const mount = el("div"); app.appendChild(mount);
    run(mount);
  }
  function startSmart(subjectId) {
    sessionScreen(subjectId ? "Smart Study · " + STUDY.byId[subjectId].name : "Smart Study · all subjects", function (mount) {
      const q = SRS.buildSession({ size: 16, subjectId: subjectId });
      QUIZ.run(mount, q, { onDone: () => go(subjectId ? "#/s/" + subjectId : "#/home") });
    });
  }
  function startMixed(subjectId, n) {
    sessionScreen("Mixed Practice", function (mount) {
      let pool = STUDY.allQuestions(function (q, t, s) { return subjectId ? s.id === subjectId : true; });
      pool = SRS.interleave(SRS.shuffle(pool).slice(0, n));
      QUIZ.run(mount, pool, { onDone: () => go(subjectId ? "#/s/" + subjectId : "#/home") });
    });
  }
  function startReview(subjectId) {
    sessionScreen("Review", function (mount) {
      let items = STUDY.dueItems(subjectId);
      const wrong = STUDY.wrongItems(subjectId);
      const seen = {}; const all = [];
      items.concat(wrong).forEach(function (q) { if (!seen[q.id]) { seen[q.id] = 1; all.push(q); } });
      if (!all.length) {
        mount.innerHTML = '<div class="empty"><div class="big">✅</div>Nothing due right now. Come back later and earlier topics will resurface. That\'s the spacing working.</div>';
        const bar = el("div", "qbar"); const b = el("button", "btn primary", "Do a mixed set instead");
        b.onclick = () => startMixed(subjectId, 15); bar.appendChild(b); mount.appendChild(bar);
        return;
      }
      QUIZ.run(mount, SRS.interleave(all), { onDone: () => go(subjectId ? "#/s/" + subjectId : "#/home") });
    });
  }

  // ---- CRAM: criterion-based massed retrieval, weak/unseen prioritised ----
  function cramList(subjectId, cap) {
    const now = Date.now();
    const pool = STUDY.allQuestions(function (q, t, s) {
      return (subjectId ? s.id === subjectId : true) && (q.type === "mc" || q.type === "fill" || q.type === "tf");
    });
    const wrong = [], unseen = [], weak = [], rest = [];
    pool.forEach(function (q) {
      const st = STUDY.itemState(q.id);
      if (STUDY.store().wrong[q.id]) wrong.push(q);
      else if (!st) unseen.push(q);
      else if (st.box <= 2) weak.push(q);
      else rest.push(q);
    });
    const ordered = SRS.shuffle(wrong).concat(SRS.shuffle(unseen)).concat(SRS.shuffle(weak)).concat(SRS.shuffle(rest));
    const seen = {}, out = [];
    for (let i = 0; i < ordered.length && out.length < cap; i++) { if (!seen[ordered[i].id]) { seen[ordered[i].id] = 1; out.push(ordered[i]); } }
    return out;
  }
  function startCram(subjectId) {
    const s = STUDY.byId[subjectId];
    if (!s) return renderCramChooser();
    sessionScreen("🔥 Cram · " + s.name, function (mount) {
      const intro = el("div", "card");
      intro.innerHTML = "<b>Cram Mode</b><p class='muted' style='font-size:.9rem;margin:.4em 0 0'>Fast, repeated retrieval with instant feedback. Items you miss come back almost immediately; each card is <b>locked in</b> only after you get it right twice in a row. Keep going until everything's locked. This is the most effective way to drill the night before.</p>";
      mount.appendChild(intro);
      const list = cramList(subjectId, 40);
      const startBtn = el("button", "btn primary full", "Start cramming " + list.length + " items →");
      startBtn.onclick = function () { QUIZ.runCram(mount, list, { doneLabel: "Back to " + s.name, onDone: () => go("#/s/" + subjectId) }); };
      mount.appendChild(startBtn);
    });
  }
  function renderCramChooser() {
    clear(); app.appendChild(topbar());
    app.appendChild(crumb([{ label: "Home", hash: "#/home" }, { label: "Cram Mode" }]));
    app.appendChild(el("div", "hero", "<h1>🔥 Cram Mode</h1><p class='muted'>Last-minute drilling, maximised for fast memorisation. Pick a subject to blitz.</p>"));
    STUDY.subjects.forEach(function (s) {
      const row = el("div", "topic"); row.style.setProperty("--sub", s.accent);
      row.onclick = () => go("#/cram/" + s.id);
      row.appendChild(el("div", "n", s.icon));
      const tt = el("div", "tt"); tt.appendChild(el("h4", null, "Cram " + esc(s.name))); tt.appendChild(el("p", null, "Drill the weak + unseen items first"));
      row.appendChild(tt); row.appendChild(el("div", "state", "🔥"));
      app.appendChild(row);
    });
  }

  // ---- EXAM: on-screen, timed, auto-graded ----
  function startExam(params) {
    const cfg = { subjectId: params.s || "all", length: params.len || "standard", seed: params.seed || null };
    const qs = TEST.examQuestions(cfg);
    const name = cfg.subjectId === "all" ? "Cumulative" : (STUDY.byId[cfg.subjectId] || {}).name || "";
    sessionScreen("📝 Exam · " + name, function (mount) {
      if (!qs.length) { mount.innerHTML = '<div class="empty">No questions available for this exam.</div>'; return; }
      const secs = qs.length * 45;
      const intro = el("div", "card");
      intro.innerHTML = "<b>📝 Exam Mode — " + esc(name) + "</b><p class='muted' style='font-size:.9rem;margin:.4em 0 0'>" + qs.length + " questions · " + Math.round(secs / 60) + " min timer · no feedback until the end, just like the real thing. Your score and a full review come at the finish.</p>";
      mount.appendChild(intro);
      const start = el("button", "btn primary full", "Start the exam →");
      start.onclick = function () {
        QUIZ.run(mount, qs, {
          instant: false, timeLimit: secs, showTags: false,
          doneLabel: "Done", onDone: () => go("#/test?s=" + cfg.subjectId),
        });
      };
      mount.appendChild(start);
    });
  }

  // ---- LISTENING: French audio drill ----
  function startListening() {
    sessionScreen("🔊 French Listening", function (mount) {
      if (!QUIZ.canSpeak) { mount.innerHTML = '<div class="empty">Your browser doesn\'t support speech. Try Chrome or Safari.</div>'; return; }
      const cards = [];
      STUDY.byId.french.topics.forEach(t => (t.cards || []).forEach(c => cards.push(c)));
      const intro = el("div", "card");
      intro.innerHTML = "<b>🔊 Listening practice</b><p class='muted' style='font-size:.9rem;margin:.4em 0 0'>Each card reads the French aloud. Try to recall the meaning before you flip. Tap 🔊 to hear it again — great prep for the oral and listening sections.</p>";
      mount.appendChild(intro);
      const b = el("button", "btn primary full", "Start listening →");
      b.onclick = () => QUIZ.runCards(mount, cards, { audio: true, doneLabel: "Back to French", onDone: () => go("#/s/french") });
      mount.appendChild(b);
    });
  }

  /* ====================================================
     DASHBOARD
     ==================================================== */
  function renderDashboard() {
    clear();
    app.appendChild(topbar());
    app.appendChild(crumb([{ label: "Home", hash: "#/home" }, { label: "Progress" }]));
    app.appendChild(el("div", "hero", "<h1>Your progress</h1><p class='muted'>Mastery grows as you get items right across spaced sessions.</p>"));

    const st = STUDY.store();
    const chips = el("div", "chips");
    chips.appendChild(statChip("🔥", st.streak.count, "day streak"));
    chips.appendChild(statChip("🏆", st.streak.best || 0, "best streak"));
    chips.appendChild(statChip("🎯", overallMastery() + "%", "overall"));
    chips.appendChild(statChip("🔁", STUDY.overallDue(), "due now"));
    app.appendChild(chips);

    app.appendChild(sectionH("By subject"));
    STUDY.subjects.forEach(function (s) {
      const prog = STUDY.subjectProgress(s.id);
      const card = el("div", "panel");
      card.style.setProperty("--sub", s.accent);
      const row = el("div", "row");
      row.appendChild(el("div", null, "<b>" + s.icon + " " + esc(s.name) + "</b>"));
      row.appendChild(el("div", "spacer"));
      row.appendChild(el("div", "muted", prog.studied + "/" + prog.items + " items"));
      card.appendChild(row);
      const bar = el("div", "bar"); bar.style.setProperty("--sub", s.accent);
      bar.appendChild(el("i")).style.width = Math.round(prog.mastery * 100) + "%";
      card.appendChild(bar);
      card.style.cursor = "pointer"; card.onclick = () => go("#/s/" + s.id);
      app.appendChild(card);
    });

    const weak = STUDY.weakTopics(6);
    app.appendChild(sectionH("Weak spots", weak.length ? "lowest accuracy, revisit these" : "answer a few questions to see this"));
    if (weak.length) {
      weak.forEach(function (w) {
        const t = w.entry.topic, s = w.entry.subject;
        const row = el("div", "topic"); row.style.setProperty("--sub", s.accent);
        row.onclick = () => go("#/t/" + t.id + "/practice");
        row.appendChild(el("div", "n", Math.round(w.acc * 100) + "%"));
        const tt = el("div", "tt"); tt.appendChild(el("h4", null, esc(t.title))); tt.appendChild(el("p", null, esc(s.name)));
        row.appendChild(tt); row.appendChild(el("div", "state", "→"));
        app.appendChild(row);
      });
    } else {
      app.appendChild(el("div", "empty", "No data yet. Your weakest topics will show up here so you know exactly what to drill."));
    }

    const bar = el("div", "qbar");
    const b = el("button", "btn primary full", "🔁 Review everything due (" + STUDY.overallDue() + ")");
    b.onclick = () => startReview(null);
    bar.appendChild(b); app.appendChild(bar);
  }

  /* ====================================================
     TEST SETUP  (delegates generation to test.js)
     ==================================================== */
  function renderTestSetup(params) {
    clear();
    app.appendChild(topbar());
    app.appendChild(crumb([{ label: "Home", hash: "#/home" }, { label: "Practice Test" }]));
    app.appendChild(el("div", "hero", "<h1>🖨️ Practice Test Builder</h1><p class='muted'>Generates a randomized mock that mirrors the real final's format. Print it (or save as PDF) with a separate answer key for self-grading.</p>"));
    TEST.renderSetup(app, params, { el: el, esc: esc, sectionH: sectionH });
  }

  /* ====================================================
     SETTINGS
     ==================================================== */
  function renderSettings() {
    clear();
    app.appendChild(topbar());
    app.appendChild(crumb([{ label: "Home", hash: "#/home" }, { label: "Settings" }]));
    app.appendChild(el("div", "hero", "<h1>Settings</h1>"));

    const card = el("div", "card");
    // theme
    const row = el("div", "row");
    row.appendChild(el("div", null, "<b>Theme</b><div class='muted' style='font-size:.85rem'>Dark is easier at night</div>"));
    row.appendChild(el("div", "spacer"));
    const seg = el("div", "seg");
    ["dark", "light"].forEach(function (th) {
      const b = el("button", STUDY.theme() === th ? "on" : "", th[0].toUpperCase() + th.slice(1));
      b.onclick = function () { STUDY.setTheme(th); renderSettings(); };
      seg.appendChild(b);
    });
    row.appendChild(seg);
    card.appendChild(row);
    card.appendChild(el("hr", "div"));

    // export / import
    card.appendChild(el("div", null, "<b>Backup progress</b><div class='muted' style='font-size:.85rem'>Progress lives only in this browser. Export to move it to another device.</div>"));
    const er = el("div", "row"); er.style.marginTop = "10px";
    const exp = el("button", "btn sm", "⬇️ Export"); exp.onclick = exportProgress;
    const imp = el("button", "btn sm", "⬆️ Import"); imp.onclick = importProgress;
    er.appendChild(exp); er.appendChild(imp); card.appendChild(er);
    card.appendChild(el("hr", "div"));

    // reset
    card.appendChild(el("div", null, "<b>Reset</b><div class='muted' style='font-size:.85rem'>Wipe all progress on this device.</div>"));
    const rb = el("button", "btn sm", "Reset all progress"); rb.style.marginTop = "10px";
    rb.style.borderColor = "var(--bad)"; rb.style.color = "var(--bad)";
    rb.onclick = function () { if (confirm("Erase all your progress on this device? This can't be undone.")) { STUDY.reset(); QUIZ.toast("Progress reset"); go("#/home"); } };
    card.appendChild(rb);
    app.appendChild(card);

    const about = el("div", "empty");
    about.style.fontSize = ".8rem";
    about.innerHTML = "Recall · built for the 2026 spring finals.<br>Active recall · spaced repetition · interleaving.";
    app.appendChild(about);
  }

  function exportProgress() {
    const blob = new Blob([STUDY.exportData()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = "recall-progress.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }
  function importProgress() {
    const inp = document.createElement("input"); inp.type = "file"; inp.accept = "application/json";
    inp.onchange = function () {
      const f = inp.files[0]; if (!f) return;
      const r = new FileReader();
      r.onload = function () { if (STUDY.importData(r.result)) { QUIZ.toast("Progress imported"); go("#/home"); } else QUIZ.toast("Could not read that file"); };
      r.readAsText(f);
    };
    inp.click();
  }

  /* ====================================================
     ROUTER
     ==================================================== */
  function route() {
    const h = location.hash.replace(/^#\/?/, "");
    const [path, query] = h.split("?");
    const parts = path.split("/").filter(Boolean);
    const params = {};
    (query || "").split("&").forEach(function (kv) { const [k, v] = kv.split("="); if (k) params[k] = decodeURIComponent(v || ""); });
    window.scrollTo(0, 0);

    if (!parts.length || parts[0] === "home") return renderHome();
    if (parts[0] === "s") return renderSubject(parts[1]);
    if (parts[0] === "t") return renderTopic(parts[1], parts[2] || "learn");
    if (parts[0] === "dash") return renderDashboard();
    if (parts[0] === "test") return renderTestSetup(params);
    if (parts[0] === "exam") return startExam(params);
    if (parts[0] === "cram") return parts[1] ? startCram(parts[1]) : renderCramChooser();
    if (parts[0] === "settings") return renderSettings();
    return renderHome();
  }

  /* ---------- boot ---------- */
  function boot() {
    STUDY.load();
    document.documentElement.setAttribute("data-theme", STUDY.theme());
    // order subjects by weight (desc) then registration
    STUDY.subjects.sort((a, b) => (b.weight - a.weight));
    window.addEventListener("hashchange", route);
    // persist immediately when the tab is backgrounded or closed (mobile-safe)
    window.addEventListener("pagehide", STUDY.flush);
    window.addEventListener("beforeunload", STUDY.flush);
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") STUDY.flush(); });
    // service worker → full offline on the hosted site (skip on file://)
    if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
      window.addEventListener("load", function () { navigator.serviceWorker.register("sw.js").catch(function () {}); });
    }
    if (!location.hash) location.replace("#/home");
    route();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();

  STUDY.go = go;
})(window.STUDY);
