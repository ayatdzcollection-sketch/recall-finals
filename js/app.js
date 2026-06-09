/* ============================================================
   app.js, router, screens, lesson & visual rendering
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
    const search = el("button", "iconbtn"); search.title = "Search"; search.innerHTML = "🔍";
    search.onclick = () => go("#/search");
    bar.appendChild(search);
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
    chips.appendChild(statChip("🚀", STUDY.ADAPT.overallReadiness() + "%", "finals ready"));
    chips.appendChild(statChip("🔮", STUDY.ADAPT.overallForecast() + "%", "exam forecast"));
    chips.appendChild(statChip("🔥", st.streak.count, "day streak"));
    const due = STUDY.overallDue();
    chips.appendChild(statChip("🔁", due, "due to review"));
    app.appendChild(chips);

    // primary actions
    const actions = el("div", "actions");
    actions.appendChild(actionCard("wide foryou", "⚡", "For You", "One adaptive feed that learns what you know and serves exactly what to study next", () => startFeed()));
    actions.appendChild(actionCard("", "🧠", "Smart Study", "Interleaved new + due material", () => startSmart(null)));
    actions.appendChild(actionCard("", "🔥", "Cram Mode", "Blitz a subject before the exam", () => go("#/cram")));
    actions.appendChild(actionCard("", "🔀", "Mixed Practice", "20 random questions, all subjects", () => startMixed(null, 20)));
    actions.appendChild(actionCard("", "🔁", "Review", due ? due + " items due now" : "Nothing due. Nice.", () => startReview(null)));
    actions.appendChild(actionCard("", "📝", "Practice Test", "Print or take a timed mock final", () => go("#/test")));
    actions.appendChild(actionCard("", "✍️", "Enter Test Results", "Grade any test, update your mastery", () => go("#/results")));
    actions.appendChild(actionCard("", "📥", "Check a Test", "Import weak spots from a graded test", () => go("#/import")));
    actions.appendChild(actionCard("", "⭐", "Starred", "Your bookmarked questions", () => go("#/starred")));
    actions.appendChild(actionCard("", "📊", "My Progress", "Readiness, weak spots & streak", () => go("#/dash")));
    app.appendChild(actions);

    // work on these, items you flagged (Again/Hard) or missed
    const flagged = STUDY.wrongItems();
    if (flagged.length) {
      app.appendChild(sectionH("Work on these", "flagged Again/Hard or missed, clear them by getting them right twice"));
      const card = el("div", "panel");
      const row = el("div", "row");
      row.appendChild(el("div", null, "<b>🎯 " + flagged.length + " item" + (flagged.length > 1 ? "s" : "") + " to work on</b>"));
      row.appendChild(el("div", "spacer"));
      const b = el("button", "btn sm primary", "Review now");
      b.onclick = () => startReview(null);
      row.appendChild(b);
      card.appendChild(row);
      const byTopic = {};
      flagged.forEach(q => { byTopic[q.topicId] = (byTopic[q.topicId] || 0) + 1; });
      const tops = Object.keys(byTopic).sort((a, b2) => byTopic[b2] - byTopic[a]).slice(0, 6);
      if (tops.length) {
        const cw = el("div", "row wrap"); cw.style.marginTop = "10px";
        tops.forEach(function (tid) {
          const e = STUDY.topicIndex[tid]; if (!e) return;
          const c = el("button", "pill"); c.style.cursor = "pointer";
          c.textContent = e.subject.icon + " " + e.topic.title + " · " + byTopic[tid];
          c.onclick = () => go("#/t/" + tid + "/practice");
          cw.appendChild(c);
        });
        card.appendChild(cw);
      }
      app.appendChild(card);
    }

    // subjects
    app.appendChild(sectionH("Subjects", "weighted by how much it matters on your finals"));
    const list = el("div", "subjects");
    // exams you've finished (marked done or graded) sink to the bottom so your
    // active classes stay on top; weighted order is preserved within each group.
    const ordered = STUDY.subjects.map(function (s, i) { return { s: s, i: i, done: STUDY.ADAPT.examDone(s.id) }; })
      .sort(function (a, b) { return (a.done - b.done) || (a.i - b.i); })
      .map(function (x) { return x.s; });
    ordered.forEach(function (s) { list.appendChild(subjectCard(s)); });
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
    const rec = STUDY.examRecord(s.id);
    const done = !!(rec && rec.done);
    const graded = done && typeof rec.actual === "number";
    if (done) card.classList.add("done");

    const info = el("div", "info");
    const prog = STUDY.subjectProgress(s.id);
    const h = el("h3", null, esc(s.name));
    if (done) h.appendChild(el("span", "exam-tag", graded ? "✓ done · scored " + rec.actual + "%" : "✓ exam done"));
    info.appendChild(h);
    info.appendChild(el("div", "meta", prog.topics + " topics · " + prog.items + " items · " + esc(done ? "tap to review anytime" : (EXAM_NOTE[s.id] || ""))));
    card.appendChild(info);

    const right = el("div", "prog");
    if (done) {
      // no longer studying for it: drop the "due" nag, show the final state
      const ring = el("div", "ring done");
      const pct = graded ? rec.actual : 100;
      ring.style.setProperty("--p", pct);
      ring.appendChild(el("div", "inner", graded ? rec.actual + "%" : "✓"));
      right.appendChild(ring);
    } else {
      if (prog.due) right.appendChild(el("div", "due-pill", prog.due + " due"));
      const ring = el("div", "ring");
      const pct = STUDY.ADAPT.readiness(s.id);   // unified "ready" metric (builds on each topic's mastery)
      ring.style.setProperty("--p", pct);
      ring.style.setProperty("--sub", s.accent);
      ring.appendChild(el("div", "inner", pct + "%"));
      right.appendChild(ring);
    }
    const dots = el("div", "weight-dots");
    for (let i = 0; i < 5; i++) { const d = el("i", i < s.weight ? "" : "off"); dots.appendChild(d); }
    right.appendChild(dots);
    card.appendChild(right);
    return card;
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
  // exam accountability: mark taken (locks the prediction), then enter the real grade
  function examCard(s) {
    const A = STUDY.ADAPT, rec = STUDY.examRecord(s.id);
    const card = el("div", "panel exam-card"); card.style.setProperty("--sub", s.accent);
    if (!rec || !rec.done) {
      const row = el("div", "row");
      row.appendChild(el("div", null, "<b>🔮 Exam forecast " + A.forecast(s.id) + "% <span class='fc-band'>±" + A.forecastBand(s.id) + "</span></b><div class='muted' style='font-size:.8rem'>Taken your " + esc(s.name) + " exam? Mark it to lock in this prediction.</div>"));
      row.appendChild(el("div", "spacer"));
      const b = el("button", "btn sm", "✓ Mark taken"); b.onclick = function () { STUDY.markExamDone(s.id, A.forecast(s.id)); renderSubject(s.id); };
      row.appendChild(b); card.appendChild(row);
    } else if (typeof rec.actual !== "number") {
      card.appendChild(el("div", null, "<b>✅ " + esc(s.name) + " exam taken</b><div class='muted' style='font-size:.8rem'>It predicted <b>" + (rec.predicted != null ? rec.predicted : A.forecast(s.id)) + "%</b>. Enter your real grade when you get it to see how close it was.</div>"));
      const row = el("div", "row"); row.style.marginTop = "8px";
      const inp = document.createElement("input"); inp.type = "number"; inp.min = "0"; inp.max = "100"; inp.placeholder = "grade %";
      inp.style.cssText = "width:84px;border-radius:8px;border:1.5px solid var(--line-strong);background:var(--surface);color:var(--text);padding:7px;text-align:center;font-size:.9rem";
      const save = el("button", "btn sm good", "Save grade"); save.onclick = function () { const v = parseInt(inp.value, 10); if (isNaN(v)) return QUIZ.toast("Enter your grade 0-100"); STUDY.setExamGrade(s.id, v); renderSubject(s.id); };
      const un = el("button", "btn sm ghost", "Undo"); un.onclick = function () { STUDY.clearExam(s.id); renderSubject(s.id); };
      row.appendChild(inp); row.appendChild(save); row.appendChild(un); card.appendChild(row);
    } else {
      const err = rec.actual - rec.predicted, ae = Math.abs(err);
      const verdict = ae <= 3 ? "spot on ✓" : err > 0 ? ("forecast was " + err + " pts low") : ("forecast was " + ae + " pts high");
      const color = ae <= 5 ? "var(--good)" : ae <= 12 ? "var(--text)" : "var(--bad)";
      card.appendChild(el("div", null, "<b>🎯 " + esc(s.name) + " exam graded</b>"));
      const row = el("div", null); row.style.cssText = "margin-top:6px;font-size:.92rem";
      row.innerHTML = "Predicted <b>" + rec.predicted + "%</b> · Scored <b>" + rec.actual + "%</b> · <span style='color:" + color + "'>" + verdict + "</span>";
      card.appendChild(row);
      const un = el("button", "btn sm ghost", "Edit"); un.style.marginTop = "8px"; un.onclick = function () { STUDY.clearExam(s.id); renderSubject(s.id); };
      card.appendChild(un);
    }
    return card;
  }

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
    chips.appendChild(statChip("🚀", STUDY.ADAPT.readiness(s.id) + "%", "ready"));
    chips.appendChild(statChip("📚", prog.topicsSeen + "/" + prog.topics, "topics started"));
    chips.appendChild(statChip("🔁", prog.due, "due now"));
    app.appendChild(chips);

    app.appendChild(examCard(s));

    const actions = el("div", "actions");
    actions.appendChild(actionCard("wide foryou", "⚡", "For You · " + s.name, "One-click binge to mastery: an adaptive feed that covers every topic and drills your weak + forgotten items", () => go("#/feed/" + s.id)));
    actions.appendChild(actionCard("", "🔥", "Cram " + s.name, "Fast drilling to lock it in", () => startCram(s.id)));
    actions.appendChild(actionCard("", "🔀", "Mixed Practice", "Random questions", () => startMixed(s.id, 15)));
    actions.appendChild(actionCard("", "📝", "Exam Mode", "Timed & auto-graded", () => go("#/exam?s=" + s.id)));
    actions.appendChild(actionCard("", "🖨️", "Practice Test", "Print or share a mock", () => go("#/test?s=" + s.id)));
    if (s.id === "geometry") actions.appendChild(actionCard("", "📐", "Formula sheet", "Every geometry formula, one page", () => go("#/formulas")));
    if (s.id === "geometry") actions.appendChild(actionCard("", "📄", "Review packet", "Printable: formulas + worksheet + answers", printGeoReview));
    if (s.id === "french") actions.appendChild(actionCard("", "🔊", "Listening", "Hear & recall (oral prep)", () => startListening()));
    if (s.id === "biology" && (STUDY.DIAGRAMS || []).length) actions.appendChild(actionCard("", "🗺️", "Label It", "Recall diagram parts", () => go("#/label")));
    if (s.id === "history" && (STUDY.TIMELINE || []).length) actions.appendChild(actionCard("", "🕰️", "Timeline", "Events in order + a challenge", () => go("#/timeline")));
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
      // completion roadmap: Learn / Cards / Practice
      const d = STUDY.topicDone(t.id);
      const hasCards = !!(t.cards && t.cards.length);
      const availSecs = 2 + (hasCards ? 1 : 0);
      const doneSecs = (d.learn ? 1 : 0) + (hasCards && d.cards ? 1 : 0) + (d.practice ? 1 : 0);
      const completion = availSecs ? doneSecs / availSecs : 0;
      // bar shows the higher of "sections finished" and "mastery" → finishing fills it
      const bar = el("div", "bar"); bar.appendChild(el("i")).style.width = Math.round(Math.max(completion, tp.mastery) * 100) + "%";
      tt.appendChild(bar);
      const dots = el("div", "tdots");
      [["learn", "Learn"], ["cards", "Cards"], ["practice", "Practice"]].forEach(function (p) {
        if (p[0] === "cards" && !(t.cards && t.cards.length)) return;
        const on = !!d[p[0]];
        dots.appendChild(el("div", "tdot" + (on ? " on" : ""), (on ? "✓ " : "") + p[1]));
      });
      tt.appendChild(dots);
      row.appendChild(tt);
      let state = "○", stitle = "Not started";
      if (completion >= 1) { state = "✅"; stitle = "Finished all sections" + (tp.due ? " · some items are due to review" : ""); }
      else if (tp.due) { state = "🔁"; stitle = tp.due + " item" + (tp.due > 1 ? "s" : "") + " due for review"; }
      else if (d.practice) { state = "✓"; stitle = "Practiced"; }
      else if (tp.seen) { state = "•"; stitle = "Started"; }
      const sg = el("div", "state", state); sg.title = stitle;
      row.appendChild(sg);
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
      QUIZ.runCards(body, t.cards.slice(), { doneLabel: "Back to topic", mode: "flashcard", onComplete: () => STUDY.markDone(id, "cards"), onDone: () => { STUDY.markDone(id, "cards"); go("#/t/" + id + "/learn"); } });
    } else if (tab === "practice") {
      if (!t.questions || !t.questions.length) { body.innerHTML = '<div class="empty">No questions yet for this topic.</div>'; return; }
      const lvl = STUDY.store().settings.practiceLevel || "mixed";
      const seg2 = el("div", "seg"); seg2.style.marginBottom = "12px";
      [["mixed", "🔀 Mixed"], ["easy", "🟢 Easy"], ["hard", "🔴 Hard"]].forEach(function (o) {
        const b = el("button", lvl === o[0] ? "on" : "", o[1]);
        // re-render in place: go() to the same hash would not fire a route change
        b.onclick = function () { STUDY.store().settings.practiceLevel = o[0]; STUDY.save(); renderTopic(id, "practice"); };
        seg2.appendChild(b);
      });
      body.appendChild(seg2);
      body.appendChild(el("p", "muted", lvl === "easy" ? "Easy: definitions & recall, balanced across every concept in the lesson." : lvl === "hard" ? "Hard: examples, discrimination & application, still covering every concept." : "A balanced mix across every concept in the lesson."));
      const qmount = el("div"); body.appendChild(qmount);
      // concept-balanced set, capped to a focused ~20 (big banks live in For You / the final quiz)
      const set = STUDY.practiceSet(id, lvl, 20);
      QUIZ.run(qmount, set, {
        showTags: false, doneLabel: "Back to topic", mode: "practice", level: lvl === "easy" ? 1 : lvl === "hard" ? 2 : 0,
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

  // Inline lesson peek: overlays the lesson OVER the current screen (e.g. the For
  // You feed) so a wrong answer can pull up the relevant lesson without tearing
  // down the session. Two one-tap ways back, so you never lose your place.
  STUDY.showLesson = function (topicId, fromItemId) {
    const e = STUDY.topicIndex[topicId]; if (!e) return;
    const t = e.topic, s = e.subject;
    if (document.querySelector(".sheet-back")) return;            // one at a time
    if (STUDY.logUsage) STUDY.logUsage("lesson_peek", { it: fromItemId || "", tp: t.id, s: s.id });
    document.documentElement.style.setProperty("--accent", s.accent);
    const back = el("div", "sheet-back");
    const sheet = el("div", "sheet"); sheet.style.setProperty("--sub", s.accent);
    const head = el("div", "sheet-head");
    head.appendChild(el("div", null, "<b>" + s.icon + " " + esc(t.title) + "</b><div class='muted' style='font-size:.72rem'>Quick refresher, then back to your set</div>"));
    const x = el("button", "btn sm", "✕ Back"); head.appendChild(x);
    sheet.appendChild(head);
    const body = el("div", "sheet-body"); renderLesson(body, t); sheet.appendChild(body);
    const foot = el("div", "sheet-foot");
    const cont = el("button", "btn primary full", "Got it, keep going →"); foot.appendChild(cont);
    sheet.appendChild(foot);
    back.appendChild(sheet); document.body.appendChild(back);
    const close = function () { back.remove(); document.removeEventListener("keydown", onKey); };
    function onKey(ev) { if (ev.key === "Escape") close(); }
    document.addEventListener("keydown", onKey);
    x.onclick = close; cont.onclick = close;
    back.onclick = function (ev) { if (ev.target === back) close(); };
    if (window.requestAnimationFrame) requestAnimationFrame(function () { back.classList.add("on"); }); else back.classList.add("on");
    body.scrollTop = 0;
  };

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
      QUIZ.run(mount, q, { mode: "smart", onDone: () => go(subjectId ? "#/s/" + subjectId : "#/home") });
    });
  }
  function startMixed(subjectId, n) {
    sessionScreen("Mixed Practice", function (mount) {
      let pool = STUDY.allQuestions(function (q, t, s) { return subjectId ? s.id === subjectId : true; });
      pool = SRS.interleave(SRS.shuffle(pool).slice(0, n));
      QUIZ.run(mount, pool, { mode: "mixed", onDone: () => go(subjectId ? "#/s/" + subjectId : "#/home") });
    });
  }
  function startReview(subjectId) {
    sessionScreen("Review", function (mount) {
      const seen = {}, all = [];
      STUDY.dueItems(subjectId).concat(STUDY.wrongItems(subjectId)).forEach(function (it) { if (!seen[it.id]) { seen[it.id] = 1; all.push(it); } });
      // split: questions go through the quiz runner, flashcards through the card flipper
      const cards = all.filter(x => x && x.front !== undefined && x.back !== undefined);
      const questions = all.filter(x => x && (x.type === "mc" || x.type === "fill" || x.type === "tf" || x.type === "match"));
      const back = () => go(subjectId ? "#/s/" + subjectId : "#/home");
      if (!questions.length && !cards.length) {
        mount.innerHTML = '<div class="empty"><div class="big">✅</div>Nothing due right now. Come back later and earlier topics will resurface. That\'s the spacing working.</div>';
        const bar = el("div", "qbar"); const b = el("button", "btn primary", "Do a mixed set instead");
        b.onclick = () => startMixed(subjectId, 15); bar.appendChild(b); mount.appendChild(bar);
        return;
      }
      const runCs = () => cards.length ? QUIZ.runCards(mount, SRS.shuffle(cards.slice()), { mode: "flashcard", doneLabel: "Done", onDone: back }) : back();
      if (questions.length) {
        QUIZ.run(mount, SRS.interleave(questions), {
          mode: "review", doneLabel: cards.length ? "Review " + cards.length + " cards →" : "Done",
          onDone: cards.length ? runCs : back,
        });
      } else { runCs(); }
    });
  }

  // ---- RESCUE DRILL: the items most likely to slip below passing by exam day ----
  function startDrill(subjectId) {
    sessionScreen("🎯 Rescue drill", function (mount) {
      let list = [];
      if (subjectId) list = STUDY.ADAPT.shakyItems(subjectId, 25);
      else STUDY.subjects.forEach(function (s) { list = list.concat(STUDY.ADAPT.shakyItems(s.id, 8)); });
      const back = () => go(subjectId ? "#/s/" + subjectId : "#/dash");
      if (!list.length) {
        mount.innerHTML = '<div class="empty"><div class="big">✅</div>No shaky items yet, answer some questions and the ones most likely to slip by exam day will collect here.</div>';
        const bar = el("div", "qbar"); const b = el("button", "btn primary", "Start the For You feed"); b.onclick = () => startFeed(subjectId); bar.appendChild(b); mount.appendChild(bar);
        return;
      }
      QUIZ.run(mount, SRS.interleave(list), { mode: "drill", onDone: back });
    });
  }

  // ---- FOR YOU: the adaptive feed (all subjects, or scoped to one) ----
  function startFeed(subjectId) {
    const nm = subjectId ? (STUDY.byId[subjectId] || {}).name : null;
    if (subjectId && !STUDY.byId[subjectId]) return go("#/home");
    sessionScreen(nm ? "⚡ For You · " + nm : "⚡ For You", function (mount) {
      QUIZ.runFeed(mount, { subjectId: subjectId || null, onDone: () => go(subjectId ? "#/s/" + subjectId : "#/home") });
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
      intro.innerHTML = "<b>📝 Exam Mode, " + esc(name) + "</b><p class='muted' style='font-size:.9rem;margin:.4em 0 0'>" + qs.length + " questions · " + Math.round(secs / 60) + " min timer · no feedback until the end, just like the real thing. Score and full review at the finish, and <b>every answer updates your mastery and forecast.</b></p>";
      mount.appendChild(intro);
      const start = el("button", "btn primary full", "Start the exam →");
      start.onclick = function () {
        QUIZ.run(mount, qs, {
          instant: false, timeLimit: secs, showTags: false, mode: "exam", examSubject: cfg.subjectId,
          doneLabel: "Done", onDone: () => go("#/test?s=" + cfg.subjectId),
        });
      };
      mount.appendChild(start);
    });
  }

  // ---- LISTENING: French audio comprehension ----
  function startListening() {
    sessionScreen("🔊 French Listening", function (mount) {
      if (!QUIZ.canSpeak) { mount.innerHTML = '<div class="empty">Your browser doesn\'t support speech. Try Chrome or Safari, then come back.</div>'; return; }
      const intro = el("div", "card");
      intro.innerHTML = "<b>🔊 Listening comprehension</b><p class='muted' style='font-size:.9rem;margin:.4em 0 0'>You'll <b>hear French</b> (no text) and answer a question about what was said, vocab, sentences, and conjugations by ear. Tap 🔊 to replay. Real prep for the listening and oral sections.</p>";
      mount.appendChild(intro);
      const seg = el("div", "row"); seg.style.margin = "10px 0 4px";
      const b1 = el("button", "btn primary", "Start listening quiz →");
      b1.onclick = () => QUIZ.run(mount, SRS.shuffle((STUDY.FR_LISTEN || []).slice()), { showTags: false, doneLabel: "Back to French", onDone: () => go("#/s/french") });
      const b2 = el("button", "btn", "Just hear the vocab (flashcards)");
      b2.onclick = function () { const cards = []; STUDY.byId.french.topics.forEach(t => (t.cards || []).forEach(c => cards.push(c))); QUIZ.runCards(mount, cards, { audio: true, doneLabel: "Back to French", onDone: () => go("#/s/french") }); };
      seg.appendChild(b1); seg.appendChild(b2); mount.appendChild(seg);
    });
  }

  // ---- LABEL IT: image-occlusion diagrams ----
  function startDiagram(id) {
    const d = (STUDY.DIAGRAMS || []).find(x => x.id === id);
    if (!d) return renderLabelChooser();
    sessionScreen("🗺️ Label · " + d.title, function (mount) {
      QUIZ.runDiagram(mount, d, { doneLabel: "More diagrams", onDone: () => go("#/label") });
    });
  }
  function renderLabelChooser() {
    clear(); app.appendChild(topbar());
    app.appendChild(crumb([{ label: "Home", hash: "#/home" }, { label: "Biology", hash: "#/s/biology" }, { label: "Label It" }]));
    app.appendChild(el("div", "hero", "<h1>🗺️ Label the Diagram</h1><p class='muted'>The labels are hidden, recall each part (typing is forgiving). Great for the heart, the nucleotide, and chromosome questions.</p>"));
    (STUDY.DIAGRAMS || []).forEach(function (d) {
      const row = el("div", "topic"); row.style.setProperty("--sub", (STUDY.byId[d.subjectId] || {}).accent || "#27c89b");
      row.onclick = () => startDiagram(d.id);
      row.appendChild(el("div", "n", "🗺️"));
      const tt = el("div", "tt"); tt.appendChild(el("h4", null, esc(d.title))); tt.appendChild(el("p", null, d.parts.length + " parts to label"));
      row.appendChild(tt); row.appendChild(el("div", "state", "→"));
      app.appendChild(row);
    });
  }

  // ---- HISTORY TIMELINE (read + order challenge) ----
  function renderTimeline(mode) {
    mode = mode || "read";
    clear(); app.appendChild(topbar());
    document.documentElement.style.setProperty("--accent", STUDY.byId.history.accent);
    app.appendChild(crumb([{ label: "Home", hash: "#/home" }, { label: "History", hash: "#/s/history" }, { label: "Timeline" }]));
    app.appendChild(el("div", "hero", "<h1>🕰️ History Timeline</h1><p class='muted'>From the Industrial Revolution to the modern era. Read it through, then test the order.</p>"));
    const seg = el("div", "seg");
    [["read", "📖 Read"], ["challenge", "🎯 Order challenge"]].forEach(function (o) {
      const b = el("button", mode === o[0] ? "on" : "", o[1]); b.onclick = () => renderTimeline(o[0]); seg.appendChild(b);
    });
    app.appendChild(seg);
    const body = el("div"); body.style.marginTop = "16px"; app.appendChild(body);
    const events = (STUDY.TIMELINE || []).slice().sort((a, b) => a.year - b.year);
    if (mode === "challenge") return timelineChallenge(body, events);

    const tl = el("div", "tline"); tl.style.marginTop = "4px";
    events.forEach(function (e) {
      const ev = el("div", "tev");
      ev.appendChild(el("div", "td", e.year + " · " + esc(e.era)));
      const head = el("div"); head.style.cssText = "font-weight:650;cursor:pointer";
      head.textContent = e.label + "  ▾";
      const detail = el("div", "tx"); detail.style.display = "none"; detail.innerHTML = mdInline(e.text);
      head.onclick = function () { const open = detail.style.display === "block"; detail.style.display = open ? "none" : "block"; head.textContent = e.label + (open ? "  ▾" : "  ▴"); };
      ev.appendChild(head); ev.appendChild(detail);
      tl.appendChild(ev);
    });
    body.appendChild(tl);
  }
  function timelineChallenge(body, allEvents) {
    const pick = SRS.shuffle(allEvents.slice()).slice(0, 6).sort((a, b) => a.year - b.year); // correct order
    const correct = pick.map(e => e.label);
    const shuffled = SRS.shuffle(correct.slice());   // shuffle the labels (strings)
    const chosen = [];
    body.appendChild(el("p", "muted", "Tap the events in order from <b>earliest to latest</b>."));
    const slots = el("div"); slots.style.cssText = "display:flex;flex-direction:column;gap:7px;margin:10px 0";
    const pool = el("div", "row wrap"); pool.style.gap = "8px";
    body.appendChild(slots); body.appendChild(el("hr", "div")); body.appendChild(pool);

    function paint() {
      slots.innerHTML = ""; pool.innerHTML = "";
      chosen.forEach(function (lab, i) {
        const row = el("div", "match-row");
        const n = el("div", "n"); n.textContent = i + 1; n.style.flex = "none";
        const c = el("div", "ml"); c.textContent = lab;
        row.appendChild(n); row.appendChild(c); slots.appendChild(row);
      });
      shuffled.forEach(function (lab) {
        if (chosen.indexOf(lab) >= 0) return;
        const b = el("button", "btn sm", lab); b.onclick = function () { chosen.push(lab); if (chosen.length === pick.length) grade(); else paint(); };
        pool.appendChild(b);
      });
    }
    function grade() {
      slots.innerHTML = ""; pool.innerHTML = "";
      let right = 0;
      chosen.forEach(function (lab, i) {
        const ok = lab === correct[i]; if (ok) right++;
        const row = el("div", "match-row");
        const n = el("div", "n"); n.textContent = (i + 1); n.style.cssText = "flex:none";
        const c = el("div", "ml"); c.style.borderColor = ok ? "var(--good)" : "var(--bad)";
        c.innerHTML = (ok ? "✓ " : "✗ ") + esc(lab) + (ok ? "" : " <span class='muted'>→ should be: " + esc(correct[i]) + "</span>");
        row.appendChild(n); row.appendChild(c); slots.appendChild(row);
      });
      STUDY.touchStreak();
      const fb = el("div", "explain " + (right === pick.length ? "ok" : "no"));
      fb.innerHTML = "<span class='v'>" + right + " / " + pick.length + " in the right place</span>" + (right === pick.length ? "Perfect chronological order!" : "Correct order: " + correct.map(esc).join(" → "));
      slots.appendChild(fb);
      const bar = el("div", "qbar"); const again = el("button", "btn primary", "New round"); again.onclick = () => renderTimeline("challenge"); bar.appendChild(again); slots.appendChild(bar);
    }
    paint();
  }

  // ---- activity heatmap + mastery sparkline (for the dashboard) ----
  function heatmap() {
    const box = el("div", "panel");
    box.appendChild(el("div", "vcap", "Study activity (last 12 weeks)"));
    const st = STUDY.store();
    const grid = el("div", "heat");
    const today = new Date(); today.setHours(0, 0, 0, 0);
    const start = new Date(today.getTime() - 12 * 7 * 86400000);
    start.setDate(start.getDate() - start.getDay()); // back to Sunday
    let max = 1; Object.keys(st.activity).forEach(k => { max = Math.max(max, st.activity[k]); });
    for (let d = new Date(start); d <= today; d.setDate(d.getDate() + 1)) {
      const key = STUDY.dayKey(d.getTime());
      const n = st.activity[key] || 0;
      const lvl = n === 0 ? 0 : n >= max * 0.66 ? 4 : n >= max * 0.33 ? 3 : n >= 2 ? 2 : 1;
      const cell = el("div", "hcell l" + lvl); cell.title = key + ": " + n + (n === 1 ? " answer" : " answers");
      grid.appendChild(cell);
    }
    box.appendChild(grid);
    const legend = el("div", "row"); legend.style.cssText = "justify-content:flex-end;gap:5px;font-size:.7rem;color:var(--text-faint);margin-top:8px";
    legend.appendChild(el("span", null, "less"));
    [0, 1, 2, 3, 4].forEach(l => legend.appendChild(el("div", "hcell l" + l)));
    legend.appendChild(el("span", null, "more"));
    box.appendChild(legend);
    return box;
  }
  function masterySpark() {
    const st = STUDY.store();
    const keys = Object.keys(st.masteryHist).sort();
    if (keys.length < 2) return null;
    const pts = keys.slice(-21).map(k => st.masteryHist[k]);
    const box = el("div", "panel");
    box.appendChild(el("div", "vcap", "Overall readiness over time"));
    const W = 300, H = 70, max = 100;
    const step = pts.length > 1 ? W / (pts.length - 1) : W;
    const path = pts.map((v, i) => (i ? "L" : "M") + (i * step).toFixed(1) + " " + (H - v / max * (H - 8) - 4).toFixed(1)).join(" ");
    box.insertAdjacentHTML("beforeend",
      "<svg viewBox='0 0 " + W + " " + H + "' style='width:100%;height:auto'>" +
      "<path d='" + path + "' fill='none' stroke='var(--accent)' stroke-width='2.5' stroke-linejoin='round'/>" +
      "<circle cx='" + ((pts.length - 1) * step).toFixed(1) + "' cy='" + (H - pts[pts.length - 1] / max * (H - 8) - 4).toFixed(1) + "' r='4' fill='var(--accent)'/>" +
      "</svg><div class='row' style='justify-content:space-between;font-size:.72rem;color:var(--text-faint)'><span>" + pts[0] + "%</span><span>now " + pts[pts.length - 1] + "%</span></div>");
    return box;
  }

  // ---- STARRED: bookmarked items ----
  function renderStarred() {
    clear(); app.appendChild(topbar());
    app.appendChild(crumb([{ label: "Home", hash: "#/home" }, { label: "Starred" }]));
    app.appendChild(el("div", "hero", "<h1>⭐ Starred</h1><p class='muted'>Your bookmarked questions and cards. Star anything from the answer feedback or a flashcard.</p>"));
    const st = STUDY.starred();
    if (!st.questions.length && !st.cards.length) {
      app.appendChild(el("div", "empty", "<div class='big'>☆</div>Nothing starred yet. Tap ☆ on a flashcard or in answer feedback to bookmark it."));
      return;
    }
    const mount = el("div"); app.appendChild(mount);
    const bar = el("div", "qbar");
    if (st.questions.length) { const b = el("button", "btn primary", "Practice " + st.questions.length + " starred questions"); b.onclick = () => sessionScreen("⭐ Starred", m => QUIZ.run(m, SRS.shuffle(st.questions.slice()), { onDone: () => go("#/starred") })); bar.appendChild(b); }
    if (st.cards.length) { const b = el("button", "btn", "Review " + st.cards.length + " starred cards"); b.onclick = () => sessionScreen("⭐ Starred cards", m => QUIZ.runCards(m, st.cards.slice(), { onDone: () => go("#/starred") })); bar.appendChild(b); }
    app.appendChild(bar);
  }

  // ---- IMPORT weak spots from a graded test ----
  /* ====================================================
     ENTER TEST RESULTS (grade any test → update mastery)
     ==================================================== */
  function renderTestResults() {
    clear(); app.appendChild(topbar());
    app.appendChild(crumb([{ label: "Home", hash: "#/home" }, { label: "Enter test results" }]));
    app.appendChild(el("div", "hero", "<h1>✍️ Enter test results</h1><p class='muted'>Took a test on paper or online? Tell it what you got right and it updates your mastery, weak spots and exam forecast, just like answering in the app.</p>"));

    // --- A) grade the last app-generated test, question by question ---
    const lt = STUDY.lastTest();
    app.appendChild(sectionH("Your last practice test", lt ? "tap a question to flip it to wrong" : "make one in Practice Test, take it, then come back"));
    if (lt) {
      const meta = el("div", "muted", esc(lt.title) + " · " + new Date(lt.when).toLocaleDateString() + " · " + lt.items.length + " questions");
      meta.style.cssText = "font-size:.82rem;margin-bottom:8px"; app.appendChild(meta);
      const results = {}; const paints = [];
      lt.items.forEach(function (it) { results[it.id] = true; });
      const quick = el("div", "row wrap"); quick.style.margin = "0 0 8px";
      const repaint = function () { paints.forEach(function (p) { p(); }); };
      const ar = el("button", "btn sm ghost", "Mark all right"); ar.onclick = function () { lt.items.forEach(it => results[it.id] = true); repaint(); };
      const aw = el("button", "btn sm ghost", "Mark all wrong"); aw.onclick = function () { lt.items.forEach(it => results[it.id] = false); repaint(); };
      quick.appendChild(ar); quick.appendChild(aw); app.appendChild(quick);
      lt.items.forEach(function (it) {
        const row = el("div", "panel"); row.style.cssText = "display:flex;align-items:center;gap:10px;padding:9px 12px;cursor:pointer;margin:6px 0";
        const num = el("span", "muted", "Q" + it.no); num.style.cssText = "font-weight:700;flex:0 0 36px";
        const stem = el("span", null, esc(it.stem.length > 72 ? it.stem.slice(0, 72) + "…" : it.stem)); stem.style.cssText = "flex:1;font-size:.84rem";
        const mark = el("span", null, ""); mark.style.cssText = "flex:0 0 auto;font-weight:800;font-size:.82rem";
        const paint = function () { const ok = results[it.id]; mark.textContent = ok ? "✓ right" : "✗ wrong"; mark.style.color = ok ? "var(--good)" : "var(--bad)"; row.style.opacity = ok ? "1" : ".72"; };
        row.onclick = function () { results[it.id] = !results[it.id]; paint(); };
        paint(); paints.push(paint);
        row.appendChild(num); row.appendChild(stem); row.appendChild(mark); app.appendChild(row);
      });
      const bar = el("div", "qbar");
      const apply = el("button", "btn primary full", "Apply " + lt.items.length + " answers to my mastery");
      apply.onclick = function () {
        const arr = lt.items.map(function (it) { return { id: it.id, correct: !!results[it.id] }; });
        const n = STUDY.applyTestResults(arr);
        const right = arr.filter(a => a.correct).length;
        QUIZ.toast("Logged " + n + " questions (" + right + " right). Mastery updated.");
        go("#/dash");
      };
      bar.appendChild(apply); app.appendChild(bar);
    } else {
      app.appendChild(el("div", "empty", "No app-made test yet. Open <b>Practice Test</b>, generate one (it's saved here), take it, then return to grade it."));
    }

    // --- B) log ANY other test (online/teacher) by topic ---
    app.appendChild(sectionH("Any other test", "for an online or paper test from elsewhere, log how you did per topic"));
    const pick = el("div", "seg"); pick.style.flexWrap = "wrap";
    let curSub = STUDY.subjects[0].id;
    const body = el("div");
    STUDY.subjects.forEach(function (s) {
      const b = el("button", s.id === curSub ? "on" : "", s.icon + " " + s.name);
      b.onclick = function () { curSub = s.id; Array.from(pick.children).forEach(x => x.className = ""); b.className = "on"; renderTopicInputs(); };
      pick.appendChild(b);
    });
    app.appendChild(pick); app.appendChild(body);
    const inputs = {};   // topicId -> {c, t}
    function renderTopicInputs() {
      body.innerHTML = ""; for (const k in inputs) delete inputs[k];
      const s = STUDY.byId[curSub];
      s.topics.forEach(function (t) {
        const row = el("div", "panel"); row.style.cssText = "display:flex;align-items:center;gap:8px;padding:8px 12px;margin:6px 0";
        row.appendChild(el("div", null, "<b>" + esc(t.title) + "</b>")).style.flex = "1";
        const ci = document.createElement("input"); ci.type = "number"; ci.min = "0"; ci.placeholder = "right";
        const ti = document.createElement("input"); ti.type = "number"; ti.min = "0"; ti.placeholder = "of";
        [ci, ti].forEach(function (x) { x.style.cssText = "width:54px;border-radius:8px;border:1.5px solid var(--line-strong);background:var(--surface);color:var(--text);padding:6px;font-size:.85rem;text-align:center"; });
        inputs[t.id] = { c: ci, t: ti };
        row.appendChild(ci); row.appendChild(el("span", "muted", "/")); row.appendChild(ti);
        body.appendChild(row);
      });
      const bar = el("div", "qbar");
      const apply = el("button", "btn primary full", "Log these results");
      apply.onclick = function () {
        let topics = 0, items = 0;
        Object.keys(inputs).forEach(function (tid) {
          const t = parseInt(inputs[tid].t.value, 10) || 0, c = parseInt(inputs[tid].c.value, 10) || 0;
          if (t > 0) { items += STUDY.applyTopicResult(tid, c, t); topics++; }
        });
        if (!items) { QUIZ.toast("Enter at least one topic's score (right / of)"); return; }
        QUIZ.toast("Logged " + items + " items across " + topics + " topics. Mastery updated.");
        go("#/dash");
      };
      bar.appendChild(apply); body.appendChild(bar);
    }
    renderTopicInputs();
  }

  function renderImport() {
    clear(); app.appendChild(topbar());
    app.appendChild(crumb([{ label: "Home", hash: "#/home" }, { label: "Import test results" }]));
    app.appendChild(el("div", "hero", "<h1>📥 Find my weak spots</h1><p class='muted'>Turn a graded test into a targeted review list. Online Exam Mode does this automatically; for a paper or PDF test, use the steps below with any AI.</p>"));

    const c1 = el("div", "card");
    c1.appendChild(el("div", "vcap", "Step 1, copy this prompt"));
    c1.appendChild(el("p", "muted", "Then open Claude (or another AI), paste it, and attach a photo/PDF of your graded test."));
    const copyBtn = el("button", "btn primary", "📋 Copy the AI prompt");
    copyBtn.onclick = function () { const p = STUDY.aiImportPrompt(); copyText(p, "Prompt copied, paste it into Claude with your test"); };
    c1.appendChild(copyBtn);
    app.appendChild(c1);

    const c2 = el("div", "card");
    c2.appendChild(el("div", "vcap", "Step 2, paste the AI's reply here"));
    c2.appendChild(el("p", "muted", "The AI replies with a RECALL-WEAK block. Paste the whole thing and import."));
    const ta = document.createElement("textarea");
    ta.placeholder = "RECALL-WEAK\nbio-mendel\nela-figurative\nEND";
    ta.style.cssText = "width:100%;min-height:120px;border-radius:12px;border:1.5px solid var(--line-strong);background:var(--surface);color:var(--text);padding:12px;font-family:var(--mono);font-size:.85rem";
    c2.appendChild(ta);
    const imp = el("button", "btn primary full", "Import weak spots →"); imp.style.marginTop = "10px";
    const out = el("div"); out.style.marginTop = "10px";
    imp.onclick = function () {
      const parsed = STUDY.parseWeakImport(ta.value);
      if (!parsed.topics.length) { out.innerHTML = "<div class='explain no'><span class='v'>No topics found</span>Make sure you pasted the RECALL-WEAK block with topic IDs from the prompt.</div>"; return; }
      const res = STUDY.markTopicsWeak(parsed.topics);
      const names = parsed.topics.map(t => (STUDY.topicIndex[t] ? STUDY.topicIndex[t].topic.title : t));
      out.innerHTML = "<div class='explain ok'><span class='v'>✓ Imported " + res.topics.length + " weak topics (" + res.items + " items queued for review)</span>" + names.map(esc).join(", ") + "</div>";
      const go2 = el("div", "qbar"); const r = el("button", "btn primary", "Review them now"); r.onclick = () => startReview(null); const c = el("button", "btn", "Cram them"); c.onclick = () => go("#/cram"); go2.appendChild(r); go2.appendChild(c); out.appendChild(go2);
    };
    c2.appendChild(imp); c2.appendChild(out);
    app.appendChild(c2);

    app.appendChild(el("div", "empty", "<div class='big'>💡</div>Tip: take a Practice Test from this app (it prints an answer key), grade it, then import, or just use Exam Mode on your phone and weak spots are tracked for you."));
  }

  // ---- SEARCH ----
  function renderSearch(params) {
    clear(); app.appendChild(topbar());
    app.appendChild(crumb([{ label: "Home", hash: "#/home" }, { label: "Search" }]));
    const head = el("div", "hero"); head.style.margin = "0 2px 12px"; head.appendChild(el("h1", null, "🔍 Search"));
    app.appendChild(head);
    const inp = el("input"); inp.type = "search"; inp.placeholder = "Search topics, terms, questions…";
    inp.style.cssText = "width:100%;font-size:1.05rem;padding:13px 14px;border-radius:13px;border:1.5px solid var(--line-strong);background:var(--surface);color:var(--text)";
    inp.value = params.q || "";
    app.appendChild(inp);
    const results = el("div"); results.style.marginTop = "14px"; app.appendChild(results);
    function run() {
      const q = QUIZ.norm(inp.value);
      results.innerHTML = "";
      if (q.length < 2) { results.appendChild(el("div", "empty", "Type at least 2 letters.")); return; }
      const hits = [];
      STUDY.subjects.forEach(function (s) {
        s.topics.forEach(function (t) {
          if (QUIZ.norm(t.title + " " + (t.blurb || "")).indexOf(q) >= 0) hits.push({ kind: "topic", s: s, t: t, label: t.title, sub: s.name });
          (t.cards || []).forEach(function (c) { if (QUIZ.norm(c.front + " " + c.back).indexOf(q) >= 0) hits.push({ kind: "card", s: s, t: t, label: c.front, sub: s.name + " · " + t.title }); });
          (t.questions || []).forEach(function (qq) { if (QUIZ.norm(qq.q).indexOf(q) >= 0) hits.push({ kind: "q", s: s, t: t, label: qq.q, sub: s.name + " · " + t.title }); });
        });
      });
      if (!hits.length) { results.appendChild(el("div", "empty", "No matches for “" + esc(inp.value) + "”.")); return; }
      results.appendChild(el("div", "q-kicker", hits.length + " result" + (hits.length > 1 ? "s" : "")));
      hits.slice(0, 60).forEach(function (h) {
        const row = el("div", "topic"); row.style.setProperty("--sub", h.s.accent);
        row.onclick = () => go("#/t/" + h.t.id + (h.kind === "card" ? "/cards" : h.kind === "q" ? "/practice" : "/learn"));
        row.appendChild(el("div", "n", h.kind === "topic" ? "📂" : h.kind === "card" ? "🗂" : "✍️"));
        const tt = el("div", "tt"); tt.appendChild(el("h4", null, esc(h.label.length > 70 ? h.label.slice(0, 70) + "…" : h.label))); tt.appendChild(el("p", null, esc(h.sub)));
        row.appendChild(tt); row.appendChild(el("div", "state", "→"));
        results.appendChild(row);
      });
    }
    inp.oninput = run; inp.focus(); if (inp.value) run();
  }

  function copyText(text, okMsg) {
    if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(() => QUIZ.toast(okMsg || "Copied"), () => prompt("Copy:", text));
    else prompt("Copy:", text);
  }

  /* ====================================================
     DASHBOARD
     ==================================================== */
  // exam-day forecast + study-time plan (powered by ADAPT.studyPlan)
  function examForecastPanel() {
    const A = STUDY.ADAPT, plan = A.studyPlan(60);
    const box = el("div", "panel forecast");
    const head = el("div", "row");
    head.appendChild(el("div", null, "<b>🔮 Exam-day forecast</b>"));
    head.appendChild(el("div", "spacer"));
    head.appendChild(el("div", "fc-overall", plan.overall + "%<span class='fc-band'> ±" + A.overallBand() + "</span>"));
    box.appendChild(head);
    box.appendChild(el("div", "muted fc-sub", plan.mode === "final"
      ? "Final stretch: predicted score for your next exam, after the forgetting between now and then."
      : "Predicted score on exam day. It climbs as you study and space your reps."));
    plan.rows.slice().sort((a, b) => (b.weight || 0) - (a.weight || 0)).forEach(function (r) {
      const row = el("div", "fc-row");
      row.appendChild(el("span", "fc-ic", r.icon));
      row.appendChild(el("span", "fc-nm", esc(r.name)));
      const bw = el("div", "bar fc-bar"); bw.appendChild(el("i")).style.width = r.forecast + "%"; row.appendChild(bw);
      const rec = STUDY.examRecord(r.id);
      const graded = rec && typeof rec.actual === "number";
      row.appendChild(el("span", "fc-pct", (graded ? rec.actual + "%" : r.forecast + "<span class='fc-band'>±" + A.forecastBand(r.id) + "</span>")));
      row.appendChild(el("span", "fc-min", r.done ? "✓ done" : (r.minutes + "m")));
      box.appendChild(row);
    });
    const alloc = plan.rows.filter(r => r.minutes > 0 && !r.done).map(r => r.minutes + "m " + r.name).join(" · ");
    if (alloc) box.appendChild(el("div", "muted fc-plan", "📋 Best use of your next " + plan.minutes + " min: " + alloc));
    // forecast accuracy, once any real grades are in
    const cal = STUDY.examCalibration();
    if (cal.n) {
      const acc = el("div", "fc-plan"); acc.style.marginTop = "8px";
      acc.innerHTML = "📈 <b>Forecast accuracy:</b> " + cal.pairs.map(function (p) { const sn = (STUDY.byId[p.subject] || {}).name || p.subject; return esc(sn) + " predicted " + p.predicted + "→ scored " + p.actual; }).join(" · ") + " · avg miss ±" + cal.mae + (cal.n >= 2 ? " (now self-correcting other forecasts)" : "");
      box.appendChild(acc);
    }
    const totalShaky = plan.rows.reduce((a, b) => a + b.shaky, 0);
    if (totalShaky > 0) {
      const bar = el("div", "qbar");
      const b = el("button", "btn primary full", "🎯 Drill my " + totalShaky + " shakiest item" + (totalShaky > 1 ? "s" : ""));
      b.onclick = () => startDrill(null);
      bar.appendChild(b); box.appendChild(bar);
    }
    return box;
  }
  // misconception radar: the wrong answers you pick most
  function mixupsPanel() {
    const mx = STUDY.topMixups(null, 5);
    if (!mx.length) return null;
    const box = el("div", null);
    box.appendChild(sectionH("Common mix-ups", "the wrong answers you pick most, watch for these"));
    mx.forEach(function (m) {
      const row = el("div", "panel mixup");
      row.appendChild(el("span", "mx-c", esc(m.chosen)));
      row.appendChild(el("span", "mx-arrow", "✗ should be"));
      row.appendChild(el("span", "mx-a", esc(m.answer)));
      if (m.n > 1) row.appendChild(el("span", "mx-n", "×" + m.n));
      box.appendChild(row);
    });
    return box;
  }
  // reported (broken) questions, hidden from the feed; restorable here
  function flaggedPanel() {
    const list = STUDY.flaggedList ? STUDY.flaggedList() : [];
    if (!list.length) return null;
    const box = el("div", null);
    box.appendChild(sectionH("Reported questions", "hidden from your feed and excluded from your scores"));
    list.slice(0, 10).forEach(function (f) {
      const row = el("div", "panel"); row.style.cssText = "display:flex;align-items:center;gap:10px";
      row.appendChild(el("div", null, "<span class='muted' style='font-size:.72rem'>⚐</span> " + esc((f.q || "(question)").slice(0, 90))));
      const un = el("button", "btn sm ghost", "Restore"); un.style.marginLeft = "auto";
      un.onclick = function () { STUDY.unflag(f.id); renderDashboard(); };
      row.appendChild(un); box.appendChild(row);
    });
    return box;
  }
  // crowd-flagged: questions most students miss (suspected mis-keyed/ambiguous)
  function crowdSuspectPanel() {
    if (!(STUDY.CROWD && STUDY.CROWD.suspectList)) return null;
    const list = STUDY.CROWD.suspectList();
    if (!list.length) return null;
    const box = el("div", null);
    box.appendChild(sectionH("Crowd flags", "most students miss these, worth a second look"));
    list.slice(0, 8).forEach(function (f) {
      const row = el("div", "panel"); row.style.cssText = "display:flex;align-items:center;gap:10px";
      row.appendChild(el("div", null, "<span class='muted' style='font-size:.72rem'>👥 " + Math.round(f.rate * 100) + "% · n" + f.n + "</span> " + esc((f.q || "").slice(0, 84))));
      box.appendChild(row);
    });
    return box;
  }

  function renderDashboard() {
    clear();
    app.appendChild(topbar());
    app.appendChild(crumb([{ label: "Home", hash: "#/home" }, { label: "Progress" }]));
    app.appendChild(el("div", "hero", "<h1>Your progress</h1><p class='muted'>Readiness grows as you recall items correctly across spaced sessions. Finishing a topic's sections gets you started; getting items right over time is what makes you ready.</p>"));

    const st = STUDY.store();
    const chips = el("div", "chips");
    chips.appendChild(statChip("🔥", st.streak.count, "day streak"));
    chips.appendChild(statChip("🏆", st.streak.best || 0, "best streak"));
    chips.appendChild(statChip("🚀", STUDY.ADAPT.overallReadiness() + "%", "overall ready"));
    chips.appendChild(statChip("🔁", STUDY.overallDue(), "due now"));
    app.appendChild(chips);

    app.appendChild(examForecastPanel());

    app.appendChild(heatmap());
    const spark = masterySpark(); if (spark) app.appendChild(spark);

    app.appendChild(sectionH("By subject"));
    STUDY.subjects.forEach(function (s) {
      const prog = STUDY.subjectProgress(s.id);
      const card = el("div", "panel");
      card.style.setProperty("--sub", s.accent);
      const row = el("div", "row");
      row.appendChild(el("div", null, "<b>" + s.icon + " " + esc(s.name) + "</b>"));
      row.appendChild(el("div", "spacer"));
      row.appendChild(el("div", "muted", "🚀 " + STUDY.ADAPT.readiness(s.id) + "% ready · 🔮 " + STUDY.ADAPT.forecast(s.id) + "%"));
      card.appendChild(row);
      const bar = el("div", "bar"); bar.style.setProperty("--sub", s.accent);
      bar.appendChild(el("i")).style.width = STUDY.ADAPT.readiness(s.id) + "%";
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

    const mix = mixupsPanel(); if (mix) app.appendChild(mix);
    const flg = flaggedPanel(); if (flg) app.appendChild(flg);
    const csp = crowdSuspectPanel(); if (csp) app.appendChild(csp);

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
    app.appendChild(el("div", "hero", "<h1>🖨️ Practice Test Builder</h1><p class='muted'>Generates a randomized <b>multiple-choice (scantron-style)</b> mock to match your real finals. Print it (or save as PDF) with a separate answer key, or take it on screen in Exam Mode.</p>"));
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

    // exam dates → powers the "For You" urgency weighting
    card.appendChild(el("div", null, "<b>Exam dates</b><div class='muted' style='font-size:.85rem'>The closer an exam, the more the For You feed prioritizes it. Defaults to finals week.</div>"));
    STUDY.subjects.forEach(function (s) {
      const er = el("div", "exam-row");
      er.appendChild(el("div", "nm", s.icon + " " + esc(s.name)));
      const dd = el("div", "dd");
      const inp = document.createElement("input"); inp.type = "date";
      inp.value = STUDY.examDate(s.id) || STUDY.FINALS_DEFAULT;
      function refreshDays() { const d = STUDY.daysToExam(s.id); dd.textContent = d > 1 ? d + " days" : d === 1 ? "tomorrow" : d === 0 ? "today" : "past"; }
      inp.onchange = function () { STUDY.setExamDate(s.id, inp.value); refreshDays(); };
      refreshDays();
      er.appendChild(inp); er.appendChild(dd);
      card.appendChild(er);
    });
    card.appendChild(el("hr", "div"));

    // cross-device sync (opt-in)
    syncSection(card);

    // export / import, files
    card.appendChild(el("div", null, "<b>Move or back up your data</b><div class='muted' style='font-size:.85rem'>Everything lives only in this browser. \"Copy everything\" packs your <b>entire</b> data (compressed, ~5× smaller) into one code you can paste back here or on another device.</div>"));
    const er = el("div", "row wrap"); er.style.marginTop = "10px";
    const exp = el("button", "btn sm", "⬇️ Export file"); exp.onclick = exportProgress;
    const imp = el("button", "btn sm", "⬆️ Import file"); imp.onclick = importProgress;
    const copyc = el("button", "btn sm", "📋 Copy everything"); copyc.onclick = () => copyText(STUDY.packData(), "Everything copied (compressed). Paste it to restore anywhere.");
    const pastec = el("button", "btn sm", "📥 Paste");
    er.appendChild(exp); er.appendChild(imp); er.appendChild(copyc); er.appendChild(pastec); card.appendChild(er);
    const pasteWrap = el("div"); pasteWrap.style.display = "none"; pasteWrap.style.marginTop = "10px";
    const pta = document.createElement("textarea");
    pta.placeholder = "Paste your code here (compressed or raw JSON)…";
    pta.style.cssText = "width:100%;min-height:90px;border-radius:12px;border:1.5px solid var(--line-strong);background:var(--surface);color:var(--text);padding:11px;font-family:var(--mono);font-size:.78rem";
    const applyc = el("button", "btn sm good", "Apply code"); applyc.style.marginTop = "8px";
    applyc.onclick = function () { if (STUDY.importData(pta.value.trim())) { QUIZ.toast("Progress imported"); go("#/home"); } else QUIZ.toast("That code didn't read, copy the whole thing"); };
    pasteWrap.appendChild(pta); pasteWrap.appendChild(applyc); card.appendChild(pasteWrap);
    pastec.onclick = function () { pasteWrap.style.display = pasteWrap.style.display === "none" ? "block" : "none"; if (pasteWrap.style.display === "block") pta.focus(); };
    card.appendChild(el("hr", "div"));

    // study-data export (for your own analysis)
    const sd = STUDY.studyData();
    card.appendChild(el("div", null, "<b>Study data</b><div class='muted' style='font-size:.85rem'>" + sd.totals.events + " events logged on this device, every answer's timestamp, subject/topic, right/wrong, speed and mode. Behaviour only, no personal info. Download it to analyze your own study.</div>"));
    const dr = el("div", "row wrap"); dr.style.marginTop = "10px";
    const dj = el("button", "btn sm", "⬇️ Download JSON");
    dj.onclick = () => downloadFile(JSON.stringify(STUDY.studyData(), null, 2), "recall-study-data.json", "application/json");
    const dc = el("button", "btn sm", "⬇️ Download CSV");
    dc.onclick = () => downloadFile(STUDY.studyDataCSV(), "recall-study-data.csv", "text/csv");
    const cf = el("button", "btn sm", "📋 Copy raw JSON");
    cf.onclick = () => copyText(STUDY.exportData(), "Full raw JSON copied (uncompressed, human-readable).");
    dr.appendChild(dj); dr.appendChild(dc); dr.appendChild(cf); card.appendChild(dr);
    card.appendChild(el("hr", "div"));

    // privacy & data (anonymous, opt-out), mentioned only here
    const teleOn = STUDY.store().settings.telemetry !== false;
    const prow = el("div", "row");
    prow.appendChild(el("div", null, "<b>Privacy &amp; data</b><div class='muted' style='font-size:.85rem'>Recall shares <b>anonymous</b> usage &amp; study events (timestamps, subject/topic, right/wrong, speed, mode) to help improve the app. No name, account, location, or trackers. Turn it off anytime.</div>"));
    prow.appendChild(el("div", "spacer"));
    const pseg = el("div", "seg");
    [["on", "On"], ["off", "Off"]].forEach(function (o) {
      const b = el("button", (o[0] === "on") === teleOn ? "on" : "", o[1]);
      b.onclick = function () { if (STUDY.TELE) STUDY.TELE.setEnabled(o[0] === "on"); else STUDY.store().settings.telemetry = (o[0] === "on"); STUDY.save(); renderSettings(); };
      pseg.appendChild(b);
    });
    prow.appendChild(pseg);
    card.appendChild(prow);
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

  function syncTimeAgo(ts) {
    if (!ts) return "never";
    const s = Math.round((Date.now() - ts) / 1000);
    if (s < 60) return "just now";
    const m = Math.round(s / 60); if (m < 60) return m + " min ago";
    const h = Math.round(m / 60); if (h < 24) return h + " hr ago";
    return Math.round(h / 24) + " days ago";
  }
  function syncSection(card) {
    if (!STUDY.SYNC) return;
    const SY = STUDY.SYNC;
    card.appendChild(el("div", null, "<b>🔄 Sync across devices <span class='exam-tag'>beta</span></b><div class='muted' style='font-size:.85rem'>Keep your progress in step on your phone and laptop. Turn it on here, then open the link (or type the code) on your other device. It syncs automatically over Wi-Fi and <b>merges</b> both devices, so nothing is lost.</div>"));
    const box = el("div"); box.style.marginTop = "10px";
    if (!SY.enabled()) {
      const r = el("div", "row wrap");
      const on = el("button", "btn sm primary", "🔄 Turn on sync");
      on.onclick = function () { SY.enable(); QUIZ.toast("Sync on, copy the link onto your other device."); renderSettings(); };
      const link = el("button", "btn sm", "🔗 I have a code");
      r.appendChild(on); r.appendChild(link); box.appendChild(r);
      const linkWrap = el("div"); linkWrap.style.cssText = "display:none;margin-top:10px;width:100%";
      const ta = document.createElement("input"); ta.type = "text"; ta.placeholder = "Paste the sync code or link from your other device";
      ta.style.cssText = "width:100%;border-radius:10px;border:1.5px solid var(--line-strong);background:var(--surface);color:var(--text);padding:10px;font-size:.85rem";
      const go2 = el("button", "btn sm good", "Link this device"); go2.style.marginTop = "8px";
      go2.onclick = function () { if (SY.linkWith(ta.value)) { QUIZ.toast("Linked, merging your progress…"); renderSettings(); } else QUIZ.toast("That code didn't look right"); };
      link.onclick = function () { linkWrap.style.display = linkWrap.style.display === "none" ? "block" : "none"; if (linkWrap.style.display === "block") ta.focus(); };
      linkWrap.appendChild(ta); linkWrap.appendChild(go2); box.appendChild(linkWrap);
    } else {
      const status = SY.status();
      const stxt = status === "ok" ? ("✓ Synced " + syncTimeAgo(SY.lastSync()))
        : status === "syncing" ? "Syncing…"
        : status === "offline" ? "Offline, will sync when you're back online"
        : status === "error" ? "Couldn't reach sync (is it set up on the server yet?)"
        : ("Synced " + syncTimeAgo(SY.lastSync()));
      box.appendChild(el("div", "muted", "Status: " + esc(stxt)));
      const codeBox = el("div");
      codeBox.style.cssText = "font-family:var(--mono);font-size:.95rem;letter-spacing:.05em;background:var(--surface-2);border:1px solid var(--line-strong);border-radius:10px;padding:9px 12px;margin-top:8px;display:inline-block";
      codeBox.textContent = SY.formatCode(SY.code());
      box.appendChild(codeBox);
      const r2 = el("div", "row wrap"); r2.style.marginTop = "10px";
      const cp = el("button", "btn sm", "🔗 Copy device link"); cp.onclick = () => copyText(SY.linkURL(), "Pairing link copied, open it on your other device.");
      const cc = el("button", "btn sm", "📋 Copy code"); cc.onclick = () => copyText(SY.formatCode(SY.code()), "Sync code copied.");
      const now = el("button", "btn sm", "🔄 Sync now"); now.onclick = function () { QUIZ.toast("Syncing…"); SY.syncNow("manual").then(function () { renderSettings(); }); };
      const off = el("button", "btn sm", "Unlink"); off.style.borderColor = "var(--bad)"; off.style.color = "var(--bad)";
      off.onclick = function () { if (confirm("Unlink this device? Your progress stays here, it just stops syncing.")) { SY.unlink(); renderSettings(); } };
      r2.appendChild(cp); r2.appendChild(cc); r2.appendChild(now); r2.appendChild(off);
      box.appendChild(r2);
      box.appendChild(el("div", "muted", "<span style='font-size:.78rem'>Anyone with this code can read and merge this progress, so keep it to yourself. It only ever holds study progress, never personal info.</span>"));
    }
    card.appendChild(box);
    card.appendChild(el("hr", "div"));
  }
  function renderLinkConfirm(code) {
    clear(); app.appendChild(topbar());
    app.appendChild(crumb([{ label: "Home", hash: "#/home" }, { label: "Link device" }]));
    app.appendChild(el("div", "hero", "<h1>🔗 Link this device?</h1>"));
    const card = el("div", "card");
    const clean = STUDY.SYNC ? STUDY.SYNC.cleanCode(code) : "";
    if (!STUDY.SYNC || !clean || clean.length < 8) {
      card.appendChild(el("div", null, "<b>That link doesn't look valid.</b><div class='muted' style='font-size:.85rem'>Ask your other device for a fresh sync link from Settings.</div>"));
      const no = el("button", "btn", "Back home"); no.style.marginTop = "12px"; no.onclick = () => go("#/home"); card.appendChild(no);
    } else {
      card.appendChild(el("div", null, "<b>Sync this device with your other one?</b><div class='muted' style='font-size:.9rem;margin-top:4px'>This <b>merges</b> the two devices' progress (nothing gets deleted) and keeps them in step from now on.<br>Code: <span style='font-family:var(--mono)'>" + esc(STUDY.SYNC.formatCode(clean)) + "</span></div>"));
      const r = el("div", "row wrap"); r.style.marginTop = "14px";
      const yes = el("button", "btn primary", "🔄 Link & sync");
      yes.onclick = function () { STUDY.SYNC.linkWith(clean); QUIZ.toast("Linked, merging your progress…"); go("#/settings"); };
      const no = el("button", "btn", "Cancel"); no.onclick = () => go("#/home");
      r.appendChild(yes); r.appendChild(no); card.appendChild(r);
    }
    app.appendChild(card);
  }

  // Geometry formula sheet (quick reference for the final)
  const GEO_FORMULAS = [
    { h: "Area", rows: [
      ["Rectangle", "A = l × w"],
      ["Triangle", "A = ½ × b × h"],
      ["Parallelogram", "A = b × h"],
      ["Trapezoid", "A = ½(b₁ + b₂) × h"],
      ["Rhombus / Kite", "A = ½ × d₁ × d₂"],
      ["Regular polygon", "A = ½ × a × P  (apothem × perimeter)"],
      ["Circle", "A = π r²"],
    ] },
    { h: "Circles", rows: [
      ["Circumference", "C = 2π r = π d"],
      ["Arc length", "(θ / 360) × 2π r"],
      ["Sector area", "(θ / 360) × π r²"],
      ["Inscribed angle", "½ × the central angle on the same arc"],
    ] },
    { h: "Volume", rows: [
      ["Prism", "V = B × h  (B = base area)"],
      ["Cylinder", "V = π r² h"],
      ["Cone", "V = ⅓ π r² h"],
      ["Pyramid", "V = ⅓ × B × h"],
      ["Sphere", "V = ⁴⁄₃ π r³"],
      ["Cube", "V = s³"],
    ] },
    { h: "Surface area", rows: [
      ["Rectangular prism", "SA = 2(lw + lh + wh)"],
      ["Cylinder", "SA = 2π r² + 2π r h"],
      ["Sphere", "SA = 4π r²"],
      ["Cube", "SA = 6 s²"],
    ] },
    { h: "Right triangles", rows: [
      ["Pythagorean", "a² + b² = c²  (c = hypotenuse)"],
      ["45–45–90", "legs x, x → hypotenuse x√2"],
      ["30–60–90", "short x, long x√3, hyp 2x"],
    ] },
    { h: "Trig · SOH-CAH-TOA", rows: [
      ["sin θ", "opposite / hypotenuse"],
      ["cos θ", "adjacent / hypotenuse"],
      ["tan θ", "opposite / adjacent"],
      ["Find an angle", "θ = tan⁻¹(opp/adj)  (or sin⁻¹, cos⁻¹)"],
    ] },
    { h: "Angles & polygons", rows: [
      ["Triangle angles", "sum = 180°"],
      ["Polygon interior sum", "(n − 2) × 180°"],
      ["One interior angle (regular)", "(n − 2) × 180° / n"],
      ["Exterior angles", "sum = 360°"],
      ["One exterior angle (regular)", "360° / n"],
    ] },
    { h: "Similarity", rows: [
      ["Similar figures", "corresponding sides are proportional"],
      ["Scale factor k", "perimeter × k · area × k² · volume × k³"],
      ["Solve a proportion", "a/b = c/d → a·d = b·c (cross-multiply)"],
    ] },
  ];
  function renderFormulas() {
    clear(); app.appendChild(topbar());
    app.appendChild(crumb([{ label: "Home", hash: "#/home" }, { label: "Geometry", hash: "#/s/geometry" }, { label: "Formula sheet" }]));
    app.appendChild(el("div", "hero", "<h1>📐 Geometry formula sheet</h1><p class='muted'>Every formula for the final in one place. Most volume problems are just B × h (or a third of it); most circle problems are π r² or 2π r.</p>"));
    const accent = (STUDY.byId.geometry && STUDY.byId.geometry.accent) || "var(--accent)";
    GEO_FORMULAS.forEach(function (grp) {
      const card = el("div", "card"); card.style.marginBottom = "12px"; card.style.setProperty("--sub", accent);
      card.appendChild(el("div", "fs-h", esc(grp.h)));
      grp.rows.forEach(function (r) {
        const row = el("div", "fs-row");
        row.appendChild(el("div", "fs-name", esc(r[0])));
        row.appendChild(el("div", "fs-form", esc(r[1])));
        card.appendChild(row);
      });
      app.appendChild(card);
    });
    const back = el("button", "btn", "← Back to Geometry"); back.style.marginTop = "4px"; back.onclick = () => go("#/s/geometry");
    app.appendChild(back);
    const pr = el("button", "btn primary full", "📄 Printable review packet"); pr.style.marginTop = "8px"; pr.onclick = printGeoReview;
    app.appendChild(pr);
  }

  // the hardest / most-missed geometry concepts (callout box in the packet)
  const GEO_HARD = [
    ["Special right triangles", "45-45-90 → hypotenuse = leg × √2. 30-60-90 → short leg x, long leg x√3, hypotenuse 2x. Don't swap √2 and √3."],
    ["Arc length vs sector area", "Both use (θ/360). Arc length × 2π r (a length); sector area × π r² (an area)."],
    ["Surface area vs volume", "Volume is units³ (space inside); surface area is units² (the outside). Cone & pyramid volumes have the ⅓."],
    ["Trig: side vs angle", "To find a SIDE use sin/cos/tan of the angle. To find an ANGLE use the inverse: tan⁻¹, sin⁻¹, cos⁻¹ of the ratio."],
    ["Polygon angles", "Interior sum = (n − 2) × 180. One interior angle (regular) = that ÷ n. Exterior angles ALWAYS sum to 360."],
    ["Similar figures", "Scale factor k → sides × k, area × k², volume × k³."],
  ];
  const REVIEW_CSS =
    "*{box-sizing:border-box}body{font-family:Georgia,'Times New Roman',serif;color:#111;margin:0;background:#eef0f4}" +
    ".bar{position:sticky;top:0;z-index:9;display:flex;gap:8px;align-items:center;flex-wrap:wrap;padding:10px 14px;background:#15163a;color:#fff}" +
    ".bar b{font-family:system-ui,sans-serif;font-size:14px;margin-right:auto}" +
    ".bar button{font:600 14px system-ui;padding:10px 15px;border-radius:9px;border:0;cursor:pointer;background:#fff;color:#15163a}.bar button.p{background:#6c5ce7;color:#fff}" +
    ".sheet{max-width:760px;margin:16px auto;background:#fff;padding:30px 38px;box-shadow:0 3px 18px rgba(0,0,0,.14)}" +
    "h1{font-size:22px;margin:0 0 2px}.sub{color:#444;font-size:13px;font-family:system-ui,sans-serif;margin-bottom:8px}" +
    "h2{font-size:15px;font-family:system-ui,sans-serif;border-bottom:1.5px solid #111;padding-bottom:3px;margin:20px 0 9px}" +
    ".fsgrid{display:grid;grid-template-columns:1fr 1fr;gap:4px 24px}.fsg{break-inside:avoid;margin-bottom:7px}" +
    ".fsgh{font:700 12.5px system-ui;color:#6c5ce7;margin-bottom:2px}" +
    ".fsr{display:flex;justify-content:space-between;gap:10px;font-size:12.5px;border-bottom:1px solid #eee;padding:2px 0}.fsr b{font-family:'Courier New',monospace}" +
    ".hard{font-size:12.7px;margin:5px 0;padding:6px 9px;background:#fff7ed;border-left:3px solid #f59e0b;break-inside:avoid}" +
    ".pq{margin:0 0 9px;break-inside:avoid}.pq .stem{font-weight:bold;font-size:13.5px;margin-bottom:2px}.pwork{height:.8in;border-bottom:1px dotted #c4c4c4}" +
    ".akey-page{display:none;border-top:3px double #111;margin-top:24px;padding-top:10px}" +
    ".akey div{font-size:11.7px;margin:3px 0;break-inside:avoid;padding-bottom:3px;border-bottom:1px solid #f0f0f0}" +
    "@media print{body{background:#fff}.bar{display:none}.sheet{box-shadow:none;margin:0;max-width:none;padding:0}.akey-page{display:block;break-before:page}@page{margin:.55in}}" +
    "@media(max-width:560px){.sheet{padding:18px 15px;margin:0}.fsgrid{grid-template-columns:1fr}}";

  function printGeoReview() {
    const geo = STUDY.byId.geometry; if (!geo) return;
    const titleOf = {}; (geo.topics || []).forEach(function (t) { titleOf[t.id] = t.title; });
    let items = [];
    try { if (STUDY.QUIZGEN && STUDY.QUIZGEN.geometryItems) items = STUDY.QUIZGEN.geometryItems(Math.random, 2); } catch (e) { items = []; }
    const order = ["geo-area", "geo-circlemeasure", "geo-solids", "geo-righttri", "geo-trig", "geo-quads", "geo-similarity"];
    const byTopic = {}; items.forEach(function (it) { (byTopic[it.topic] = byTopic[it.topic] || []).push(it); });
    let n = 0, work = "", key = "";
    order.forEach(function (tid) {
      const list = byTopic[tid]; if (!list || !list.length) return;
      work += "<h2>" + esc(titleOf[tid] || tid) + "</h2>";
      list.forEach(function (it) {
        n++;
        work += "<div class='pq'><div class='stem'>" + n + ". " + esc(it.q) + "</div><div class='pwork'></div></div>";
        const ans = (it.choices && it.choices[it.answer] != null) ? it.choices[it.answer] : "";
        key += "<div><b>" + n + ".</b> " + esc(ans) + (it.explain ? " &nbsp;— " + esc(it.explain) : "") + "</div>";
      });
    });
    let fs = "<div class='fsgrid'>";
    GEO_FORMULAS.forEach(function (g) {
      fs += "<div class='fsg'><div class='fsgh'>" + esc(g.h) + "</div>";
      g.rows.forEach(function (r) { fs += "<div class='fsr'><span>" + esc(r[0]) + "</span><b>" + esc(r[1]) + "</b></div>"; });
      fs += "</div>";
    });
    fs += "</div>";
    let hard = ""; GEO_HARD.forEach(function (h) { hard += "<div class='hard'><b>" + esc(h[0]) + ":</b> " + esc(h[1]) + "</div>"; });
    const stamp = new Date().toLocaleDateString();
    const html = "<!doctype html><html lang='en'><head><meta charset='utf-8'><meta name='viewport' content='width=device-width,initial-scale=1'>" +
      "<title>Geometry Review Packet</title><style>" + REVIEW_CSS + "</style></head><body>" +
      "<div class='bar'><b>Geometry review packet</b>" +
      "<button class='p' onclick='window.print()'>🖨️ Print / Save as PDF</button>" +
      "<button id='kbtn' onclick='tk()'>Show answer key</button></div>" +
      "<div class='sheet'>" +
      "<h1>📐 Geometry Final — Review Packet</h1>" +
      "<div class='sub'>Generated " + esc(stamp) + ". Skim the formulas, read the hardest-concepts box, then work the problems. Worked answers are on the last page (print on their own).</div>" +
      "<h2>Formulas</h2>" + fs +
      "<h2>⚠️ Hardest concepts — where points get lost</h2>" + hard +
      "<h2>Worksheet · " + n + " problems</h2>" + work +
      "<div class='akey-page' id='akey'><h2>Answer key (worked)</h2>" + key + "</div>" +
      "</div>" +
      "<script>function tk(){var k=document.getElementById('akey'),b=document.getElementById('kbtn');var on=k.style.display==='block';k.style.display=on?'none':'block';b.textContent=on?'Show answer key':'Hide answer key';if(!on)k.scrollIntoView({behavior:'smooth'});}<\/script>" +
      "</body></html>";
    let w = null; try { w = window.open("", "_blank"); } catch (e) { w = null; }
    if (w && w.document) { w.document.open(); w.document.write(html); w.document.close(); w.focus && w.focus(); return; }
    try {
      const blob = new Blob([html], { type: "text/html" }); const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.target = "_blank"; a.rel = "noopener"; a.download = "geometry-review.html";
      document.body.appendChild(a); a.click(); a.remove(); setTimeout(function () { URL.revokeObjectURL(url); }, 30000);
      if (STUDY.QUIZ && STUDY.QUIZ.toast) STUDY.QUIZ.toast("Saved the review packet. Open it, then Print / Save PDF");
    } catch (e) {}
  }

  function downloadFile(content, name, type) {
    const blob = new Blob([content], { type: type || "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1500);
  }
  function exportProgress() { downloadFile(STUDY.exportData(), "recall-progress.json", "application/json"); }
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
    if (parts[0] === "feed") return startFeed(parts[1]);
    if (parts[0] === "exam") return startExam(params);
    if (parts[0] === "cram") return parts[1] ? startCram(parts[1]) : renderCramChooser();
    if (parts[0] === "label") return parts[1] ? startDiagram(parts[1]) : renderLabelChooser();
    if (parts[0] === "timeline") return renderTimeline();
    if (parts[0] === "starred") return renderStarred();
    if (parts[0] === "import") return renderImport();
    if (parts[0] === "results") return renderTestResults();
    if (parts[0] === "search") return renderSearch(params);
    if (parts[0] === "link") return renderLinkConfirm(parts[1]);
    if (parts[0] === "formulas") return renderFormulas();
    if (parts[0] === "settings") return renderSettings();
    return renderHome();
  }

  /* ---------- boot ---------- */
  function boot() {
    STUDY.load();
    if (STUDY.TELE) try { STUDY.TELE.start(); } catch (e) {}
    if (STUDY.CROWD) try { STUDY.CROWD.start(); } catch (e) {}
    if (STUDY.SYNC) try { STUDY.SYNC.init(); } catch (e) {}
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
