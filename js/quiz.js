/* ============================================================
   quiz.js, interactive question + flashcard runner
   Question shapes:
     {type:'mc',   q, choices:[...], answer:<index>, explain}
     {type:'fill', q, answers:['accepted', ...], explain, placeholder}
     {type:'tf',   q, answer:true|false, explain}
     {type:'match',q, pairs:[{left,right}], explain}
   ============================================================ */
(function (STUDY) {
  "use strict";
  const SRS = STUDY.SRS;
  const el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  function norm(s) {
    return String(s || "")
      .toLowerCase().trim()
      .normalize("NFD").replace(/[̀-ͯ]/g, "")  // strip accents
      .replace(/[’']/g, "")
      .replace(/[^a-z0-9]+/g, " ").trim();
  }

  const QUIZ = {};

  function toast(msg) {
    const t = document.getElementById("toast");
    if (!t) return;
    t.textContent = msg; t.classList.add("show");
    clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove("show"), 1400);
  }
  QUIZ.toast = toast;

  /* ---------------- text-to-speech (French listening / oral practice) ---------------- */
  QUIZ.canSpeak = (typeof window !== "undefined" && "speechSynthesis" in window);
  QUIZ.speak = function (text, lang) {
    if (!QUIZ.canSpeak) return;
    try {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(String(text).replace(/[*_`«»]/g, "").trim());
      u.lang = lang || "fr-FR"; u.rate = 0.92;
      const want = (lang || "fr").slice(0, 2).toLowerCase();
      const v = (window.speechSynthesis.getVoices() || []).find(x => x.lang && x.lang.toLowerCase().slice(0, 2) === want);
      if (v) u.voice = v;
      window.speechSynthesis.speak(u);
    } catch (e) {}
  };
  QUIZ.speakerBtn = function (text, lang, cls) {
    const b = el("button", "spk" + (cls ? " " + cls : ""), "🔊");
    b.type = "button"; b.title = "Hear it";
    b.onclick = function (e) { e.stopPropagation(); e.preventDefault(); QUIZ.speak(text, lang); };
    return b;
  };
  // some browsers load voices async
  if (QUIZ.canSpeak && typeof window.speechSynthesis.getVoices === "function") {
    try { window.speechSynthesis.getVoices(); window.speechSynthesis.onvoiceschanged = function () { window.speechSynthesis.getVoices(); }; } catch (e) {}
  }

  /* ---------------- lenient answer matching (typos & wording OK, offline) ---------------- */
  function lev(a, b) {
    a = a || ""; b = b || ""; const m = a.length, n = b.length;
    if (!m) return n; if (!n) return m;
    let prev = new Array(n + 1), cur = new Array(n + 1);
    for (let j = 0; j <= n; j++) prev[j] = j;
    for (let i = 1; i <= m; i++) {
      cur[0] = i;
      for (let j = 1; j <= n; j++) { const c = a[i - 1] === b[j - 1] ? 0 : 1; cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + c); }
      const t = prev; prev = cur; cur = t;
    }
    return prev[n];
  }
  function tokens(s) { return norm(s).split(" ").filter(w => w.length > 2); }
  function fuzzyMatch(input, accepted) {
    const v = norm(input); if (!v) return false;
    return (accepted || []).map(norm).some(function (a) {
      if (!a) return false;
      if (a === v) return true;
      if (a.length > 4 && (v.includes(a) || a.includes(v))) return true;
      const tol = a.length <= 4 ? 1 : a.length <= 8 ? 2 : 3;          // typo tolerance
      if (lev(v, a) <= tol) return true;
      const A = new Set(tokens(a)), B = new Set(tokens(v));            // keyword overlap
      if (A.size >= 2 && B.size) {
        let i = 0; A.forEach(w => { if (B.has(w)) i++; });
        if (i >= 2 && (i / A.size >= 0.5 || i / B.size >= 0.6)) return true; // your key words are mostly right
      }
      return false;
    });
  }
  QUIZ.fuzzyMatch = fuzzyMatch;

  /* ---------------- "explain why I'm wrong" (offline, from lesson content) ---------------- */
  function topicDefs(topicId) {
    const e = STUDY.topicIndex[topicId]; if (!e) return [];
    const out = [];
    (e.topic.lesson || []).forEach(function (b) {
      if (b.term) out.push([b.term, b.def]);
      else if (b.defs) b.defs.forEach(p => out.push([p[0], p[1]]));
    });
    return out;
  }
  function explainFor(q) {
    if (!q) return null;
    if (q.explain) return q.explain;
    const ans = q.type === "mc" ? (q.choices ? q.choices[q.answer] : "") : (q.answers ? q.answers[0] : "");
    const defs = topicDefs(q.topicId);
    const stemN = norm(q.q || "");
    for (let k = 0; k < defs.length; k++) { const t = defs[k][0], d = defs[k][1]; if (t && stemN.indexOf(norm(t)) >= 0) return t + ": " + String(d).replace(/\*\*/g, ""); }
    if (ans) for (let k = 0; k < defs.length; k++) { const t = defs[k][0], d = defs[k][1]; if (d && norm(d).indexOf(norm(ans)) >= 0) return "Correct because this matches " + t + "."; }
    return null;
  }
  QUIZ.explainFor = explainFor;

  /* ---------------- shared feedback block (used by Practice & Cram) ---------------- */
  function buildFeedback(ok, correctText, q, extraHtml) {
    const fb = el("div", "explain " + (ok ? "ok" : "no"));
    fb.appendChild(el("span", "v", ok ? "✓ Correct" : "✗ Not quite"));
    let body = "";
    if (!ok && correctText) body += "<b>Answer:</b> " + esc(correctText) + "<br>";
    const ex = explainFor(q);
    if (ex) body += "<span class='why'>" + esc(ex) + "</span>";
    if (extraHtml) body += (body ? "<br>" : "") + extraHtml;
    if (body) fb.insertAdjacentHTML("beforeend", body);
    if (q && q.subjectId === "french" && correctText && QUIZ.canSpeak) { fb.appendChild(document.createElement("br")); fb.appendChild(QUIZ.speakerBtn(correctText, "fr-FR")); }
    if (q && (q.topicId && STUDY.topicIndex[q.topicId] || q.id)) {
      const row = el("div", "row"); row.style.marginTop = "9px";
      if (q.topicId && STUDY.topicIndex[q.topicId]) {
        const lb = el("button", "btn sm ghost", "📖 Review lesson");
        lb.onclick = function () { if (STUDY.go) STUDY.go("#/t/" + q.topicId + "/learn"); };
        row.appendChild(lb);
      }
      if (q.id) {
        const star = el("button", "btn sm ghost", STUDY.isStarred(q.id) ? "★ Starred" : "☆ Star");
        star.onclick = function () { const on = STUDY.toggleStar(q.id); star.textContent = on ? "★ Starred" : "☆ Star"; };
        row.appendChild(star);
      }
      fb.appendChild(row);
    }
    return fb;
  }
  QUIZ.buildFeedback = buildFeedback;

  /* ---------------- main quiz runner ---------------- */
  QUIZ.run = function (mount, questions, opts) {
    opts = opts || {};
    if (!questions || !questions.length) {
      mount.innerHTML = '<div class="empty"><div class="big">🎉</div>Nothing to practice here right now.</div>';
      if (opts.onDone) {/* still allow caller buttons */ }
      return;
    }
    const state = { i: 0, correct: 0, answered: 0, results: [], list: questions };
    const instant = opts.instant !== false;       // exam mode passes instant:false
    let remain = opts.timeLimit || 0, ticker = null, timerEl = null;

    function startTimer() {
      if (!opts.timeLimit || ticker) return;
      ticker = setInterval(function () {
        remain--;
        paintTimer();
        if (remain <= 0) { stopTimer(); results(true); }
      }, 1000);
    }
    function stopTimer() { if (ticker) { clearInterval(ticker); ticker = null; } }
    function paintTimer() {
      if (!timerEl) return;
      const m = Math.floor(remain / 60), s = remain % 60;
      timerEl.textContent = "⏱ " + m + ":" + String(s).padStart(2, "0");
      timerEl.className = "exam-timer" + (remain <= 30 ? " danger" : remain <= 90 ? " warn" : "");
    }

    function render() {
      const q = state.list[state.i];
      mount.innerHTML = "";
      // progress
      const top = el("div", "q-top");
      const pr = el("div", "q-progress");
      pr.appendChild(el("i")).style.width = ((state.i) / state.list.length * 100) + "%";
      top.appendChild(pr);
      if (opts.timeLimit) { timerEl = el("div", "exam-timer"); paintTimer(); top.appendChild(timerEl); }
      top.appendChild(el("div", "q-count", (state.i + 1) + " / " + state.list.length));
      mount.appendChild(top);
      startTimer();

      const subj = STUDY.byId[q.subjectId];
      const topic = STUDY.topicIndex[q.topicId] ? STUDY.topicIndex[q.topicId].topic : null;
      if (opts.showTags !== false && subj) {
        mount.appendChild(el("div", "q-kicker", esc(subj.name) + (topic ? " · " + esc(topic.title) : "")));
      }

      if (q.type === "match") return renderMatch(q);
      if (q.type === "listen") return renderListen(q);
      if (q.type === "fill") return renderFill(q);
      if (q.type === "tf") return renderTF(q);
      return renderMC(q);
    }

    /* ----- listening comprehension (audio prompt, MC answer) ----- */
    function renderListen(q) {
      const bar = el("div", "row"); bar.style.cssText = "margin-bottom:14px;align-items:center;gap:11px";
      bar.appendChild(QUIZ.speakerBtn(q.say, "fr-FR", "big"));
      bar.appendChild(el("div", "muted", "🎧 Listen, then answer. Tap 🔊 to replay."));
      mount.appendChild(bar);
      if (QUIZ.canSpeak) setTimeout(function () { QUIZ.speak(q.say, "fr-FR"); }, 280);
      mount.appendChild(el("h2", "q-stem", esc(q.q || "What did you hear?")));
      const order = q._order || (q._order = SRS.shuffle(q.choices.map((_, i) => i)));
      const wrap = el("div", "choices"); const btns = [];
      order.forEach(function (oi, n) {
        const c = el("button", "choice");
        c.appendChild(el("span", "key", String.fromCharCode(65 + n)));
        c.appendChild(el("span", "ct", esc(q.choices[oi])));
        c.onclick = function () { choose(oi, c); };
        wrap.appendChild(c); btns.push(c);
      });
      mount.appendChild(wrap);
      function choose(oi, node) {
        const ok = oi === q.answer; btns.forEach(b => b.disabled = true);
        if (!instant) { node.classList.add("selected"); commit(q, ok ? 2 : 0, ok); if (state.i + 1 < state.list.length) setTimeout(function () { state.i++; render(); window.scrollTo(0, 0); }, 180); else nextBar(); return; }
        btns.forEach(function (b, k) { if (order[k] === q.answer) b.classList.add("correct"); else if (b === node) b.classList.add("wrong"); else b.classList.add("dim"); });
        mount.appendChild(feedbackBlock(ok, q.choices[q.answer], q));
        commit(q, ok ? 2 : 0, ok); nextBar();
      }
    }

    const feedbackBlock = buildFeedback;   // (ok, correctText, q, extraHtml)

    function advanceBar() {
      // grow the top progress bar after answering
      const bar = mount.querySelector(".q-progress > i");
      if (bar) bar.style.width = ((state.i + 1) / state.list.length * 100) + "%";
    }

    function commit(q, grade, ok, chosen) {
      const meta = { mode: opts.mode || "practice", level: opts.level || 0 };
      if (typeof chosen === "number") meta.chosen = chosen;
      STUDY.recordItem(q.id, grade, q.topicId, meta);
      state.answered++;
      if (ok) state.correct++;
      state.results.push({ q: q, ok: ok });
      advanceBar();
    }

    function nextBar(extra) {
      const bar = el("div", "qbar");
      const b = el("button", "btn primary", (state.i + 1 < state.list.length ? "Next →" : "See results"));
      b.onclick = function () {
        if (state.i + 1 < state.list.length) { state.i++; render(); window.scrollTo(0, 0); }
        else results();
      };
      if (extra) bar.appendChild(extra);
      bar.appendChild(b);
      mount.appendChild(b._wrap = bar);
      b.focus();
    }

    /* ----- multiple choice ----- */
    function renderMC(q) {
      mount.appendChild(el("h2", "q-stem", esc(q.q)));
      // build display order (shuffle) keeping track of correct
      const order = q._order || (q._order = SRS.shuffle(q.choices.map((_, i) => i)));
      const wrap = el("div", "choices");
      const btns = [];
      order.forEach(function (origIdx, n) {
        const c = el("button", "choice");
        c.appendChild(el("span", "key", String.fromCharCode(65 + n)));
        c.appendChild(el("span", "ct", esc(q.choices[origIdx])));
        c.dataset.orig = origIdx;
        c.onclick = function () { choose(origIdx, c); };
        wrap.appendChild(c); btns.push(c);
      });
      mount.appendChild(wrap);

      function choose(origIdx, node) {
        const ok = origIdx === q.answer;
        btns.forEach(function (b) { b.disabled = true; });
        document.onkeydown = null;
        if (!instant) {                    // exam mode: just mark the pick, no reveal
          node.classList.add("selected");
          commit(q, ok ? 2 : 0, ok, origIdx);
          if (state.i + 1 < state.list.length) { setTimeout(function () { state.i++; render(); window.scrollTo(0, 0); }, 180); }
          else nextBar();
          return;
        }
        btns.forEach(function (b) {
          const oi = +b.dataset.orig;
          if (oi === q.answer) b.classList.add("correct");
          else if (b === node) b.classList.add("wrong");
          else b.classList.add("dim");
        });
        mount.appendChild(feedbackBlock(ok, q.choices[q.answer], q));
        commit(q, ok ? 2 : 0, ok, origIdx);
        nextBar();
      }

      // keyboard a-d / 1-4
      document.onkeydown = function (e) {
        const k = e.key.toLowerCase();
        let idx = -1;
        if (k >= "1" && k <= "9") idx = +k - 1;
        else if (k >= "a" && k <= "z") idx = k.charCodeAt(0) - 97;
        if (idx >= 0 && idx < btns.length && !btns[idx].disabled) { e.preventDefault(); btns[idx].click(); }
      };
    }

    /* ----- true / false ----- */
    function renderTF(q) {
      mount.appendChild(el("h2", "q-stem", esc(q.q)));
      const wrap = el("div", "choices");
      [["True", true], ["False", false]].forEach(function (pair, n) {
        const c = el("button", "choice");
        c.appendChild(el("span", "key", String.fromCharCode(65 + n)));
        c.appendChild(el("span", "ct", pair[0]));
        c.onclick = function () {
          const ok = pair[1] === q.answer;
          Array.from(wrap.children).forEach(function (b) { b.disabled = true; });
          if (!instant) {
            c.classList.add("selected"); commit(q, ok ? 2 : 0, ok);
            if (state.i + 1 < state.list.length) setTimeout(function () { state.i++; render(); window.scrollTo(0, 0); }, 180); else nextBar();
            return;
          }
          c.classList.add(ok ? "correct" : "wrong");
          mount.appendChild(feedbackBlock(ok, q.answer ? "True" : "False", q));
          commit(q, ok ? 2 : 0, ok); nextBar();
        };
        wrap.appendChild(c);
      });
      mount.appendChild(wrap);
    }

    /* ----- fill in the blank ----- */
    function renderFill(q) {
      mount.appendChild(el("h2", "q-stem", esc(q.q)));
      const row = el("div", "fill-in");
      const inp = el("input");
      inp.type = "text"; inp.autocomplete = "off"; inp.autocapitalize = "off"; inp.spellcheck = false;
      inp.placeholder = q.placeholder || "Type your answer…";
      const go = el("button", "btn primary", "Check");
      row.appendChild(inp); row.appendChild(go);
      mount.appendChild(row);
      inp.focus();

      let done = false;
      function check() {
        if (done) return;
        const val = norm(inp.value);
        if (!val) { inp.focus(); return; }
        const ok = fuzzyMatch(inp.value, q.answers);
        done = true; inp.disabled = true; go.disabled = true;
        if (!instant) {
          inp.classList.add("selected"); commit(q, ok ? 2 : 0, ok);
          if (state.i + 1 < state.list.length) setTimeout(function () { state.i++; render(); window.scrollTo(0, 0); }, 160); else nextBar();
          return;
        }
        inp.classList.add(ok ? "correct" : "wrong");
        mount.appendChild(feedbackBlock(ok, (q.answers || [])[0], q));
        commit(q, ok ? 2 : 0, ok);
        // let the user override self-grade (lenient subject matter)
        const extra = el("div", "row");
        if (!ok) {
          const mark = el("button", "btn sm good", "I was right →");
          mark.onclick = function () { STUDY.recordItem(q.id, 2, q.topicId, { mode: opts.mode || "practice" }); state.correct++; state.results[state.results.length - 1].ok = true; mark.remove(); toast("Counted as correct"); };
          extra.appendChild(mark);
        }
        nextBar(extra.children.length ? extra : null);
      }
      go.onclick = check;
      inp.onkeydown = function (e) { if (e.key === "Enter") { e.preventDefault(); done ? (mount.querySelector(".qbar .primary") || {}).click && mount.querySelector(".qbar .primary").click() : check(); } };
    }

    /* ----- matching ----- */
    function renderMatch(q) {
      mount.appendChild(el("h2", "q-stem", esc(q.q || "Match each item to its pair.")));
      const lefts = q.pairs.map(p => p.left);
      const rights = SRS.shuffle(q.pairs.map(p => p.right));
      const grid = el("div", "match-grid");
      const selects = [];
      lefts.forEach(function (lf, i) {
        const r = el("div", "match-row");
        r.appendChild(el("div", "ml", esc(lf)));
        const sel = el("select");
        sel.appendChild(el("option", null, "choose…")).value = "";
        rights.forEach(function (rt) { const o = el("option", null, esc(rt)); o.value = rt; sel.appendChild(o); });
        r.appendChild(sel); grid.appendChild(r);
        selects.push(sel);
      });
      mount.appendChild(grid);
      const check = el("button", "btn primary full", "Check matches");
      check.style.marginTop = "12px";
      mount.appendChild(check);
      check.onclick = function () {
        let allOk = true;
        selects.forEach(function (sel, i) {
          const want = q.pairs[i].right;
          const ok = sel.value === want;
          sel.classList.add(ok ? "correct" : "wrong");
          sel.disabled = true;
          if (!ok) { allOk = false; const o = Array.from(sel.options).find(o => o.value === want); }
        });
        check.disabled = true;
        const detail = allOk ? "" : "Correct pairs:<br>" + q.pairs.map(p => "• " + esc(p.left) + " → " + esc(p.right)).join("<br>");
        mount.appendChild(feedbackBlock(allOk, "", q, detail));
        commit(q, allOk ? 2 : 0, allOk);
        nextBar();
      };
    }

    /* ----- results ----- */
    function results(timedOut) {
      stopTimer();
      document.onkeydown = null;
      mount.innerHTML = "";
      if (timedOut) mount.appendChild(el("div", "q-kicker", "⏱ Time's up"));
      const pct = Math.round(state.correct / state.list.length * 100);
      const big = el("div", "result-big");
      big.appendChild(el("div", "score", pct + "%"));
      big.appendChild(el("div", "lbl", state.correct + " of " + state.list.length + " correct"));
      mount.appendChild(big);

      const bar = el("div", "scorebar");
      const g = el("div", "s-good"); g.style.flex = state.correct || 0.0001;
      const b = el("div", "s-bad"); b.style.flex = (state.list.length - state.correct) || 0.0001;
      bar.appendChild(g); bar.appendChild(b); mount.appendChild(bar);

      // review wrong ones
      const wrong = state.results.filter(r => !r.ok);
      if (wrong.length) {
        const p = el("div", "panel");
        p.appendChild(el("div", "vcap", "Flagged for review (" + wrong.length + ")"));
        wrong.forEach(function (r) {
          const line = el("div");
          line.style.cssText = "padding:6px 0;border-top:1px solid var(--line);font-size:.9rem";
          let ans = r.q.type === "mc" ? r.q.choices[r.q.answer] : (r.q.answers ? r.q.answers[0] : (r.q.answer === true ? "True" : r.q.answer === false ? "False" : ""));
          const why = explainFor(r.q);
          line.innerHTML = "<b>" + esc(r.q.q) + "</b><br><span class='muted'>✓ " + esc(ans || "") + "</span>" + (why ? "<br><span class='why' style='font-size:.85rem'>" + esc(why) + "</span>" : "");
          p.appendChild(line);
        });
        mount.appendChild(p);
      } else if (state.list.length > 2) {
        mount.appendChild(el("div", "panel center", "🔥 Clean sweep! Every answer correct."));
      }

      const bar2 = el("div", "qbar");
      if (wrong.length) {
        const again = el("button", "btn", "Retry missed (" + wrong.length + ")");
        again.onclick = function () { QUIZ.run(mount, SRS.shuffle(wrong.map(r => r.q)), opts); };
        bar2.appendChild(again);
      }
      const done = el("button", "btn primary", opts.doneLabel || "Done");
      done.onclick = function () { if (opts.onDone) opts.onDone(state); };
      bar2.appendChild(done);
      mount.appendChild(bar2);
      if (opts.onResults) opts.onResults(state);
    }

    render();
  };

  /* ---------------- flashcard runner ---------------- */
  QUIZ.runCards = function (mount, cards, opts) {
    opts = opts || {};
    if (!cards || !cards.length) { mount.innerHTML = '<div class="empty">No flashcards here.</div>'; return; }
    const list = SRS.shuffle(cards);
    let i = 0;

    function render() {
      const c = list[i];
      mount.innerHTML = "";
      const top = el("div", "q-top");
      const pr = el("div", "q-progress"); pr.appendChild(el("i")).style.width = (i / list.length * 100) + "%";
      top.appendChild(pr); top.appendChild(el("div", "q-count", (i + 1) + " / " + list.length));
      mount.appendChild(top);

      const subj = STUDY.byId[c.subjectId];
      const topic = STUDY.topicIndex[c.topicId] ? STUDY.topicIndex[c.topicId].topic : null;
      const krow = el("div", "row"); krow.style.alignItems = "center";
      if (subj) krow.appendChild(el("div", "q-kicker", esc(subj.name) + (topic ? " · " + esc(topic.title) : "")));
      krow.appendChild(el("div", "spacer"));
      if (c.id) { const star = el("button", "btn sm ghost", STUDY.isStarred(c.id) ? "★" : "☆"); star.title = "Bookmark"; star.onclick = function (e) { e.stopPropagation(); star.textContent = STUDY.toggleStar(c.id) ? "★" : "☆"; }; krow.appendChild(star); }
      mount.appendChild(krow);

      const lang = c.subjectId === "french" ? "fr-FR" : "en-US";
      function addSpeaker(face, text) {
        if (!QUIZ.canSpeak) return;
        const sp = QUIZ.speakerBtn(text, lang);
        sp.style.cssText = "position:absolute;top:10px;right:12px";
        face.appendChild(sp);
      }
      const flash = el("div", "flash");
      const inner = el("div", "inner");
      const front = el("div", "face");
      front.appendChild(el("div", "lbl", "Prompt"));
      front.appendChild(el("div", "ct", esc(c.front)));
      if (c.hint) front.appendChild(el("div", "hint", "Hint: " + esc(c.hint)));
      addSpeaker(front, c.front);
      const back = el("div", "face back");
      back.appendChild(el("div", "lbl", "Answer"));
      back.appendChild(el("div", "ct", esc(c.back)));
      addSpeaker(back, c.back);
      inner.appendChild(front); inner.appendChild(back);
      flash.appendChild(inner);
      mount.appendChild(flash);
      if (opts.audio && c.subjectId === "french") QUIZ.speak(c.front, "fr-FR");
      mount.appendChild(el("div", "flash-hint", "Tap the card (or press Space) to flip"));

      let flipped = false;
      function flip() {
        flipped = !flipped;
        flash.classList.toggle("flipped", flipped);
        rate.style.display = flipped ? "grid" : "none";
        hintBar.style.display = flipped ? "none" : "block";
      }
      flash.onclick = flip;

      const hintBar = mount.querySelector(".flash-hint");
      const rate = el("div", "rate");
      rate.style.display = "none";
      [["Again", "again", 0], ["Hard", "hard", 1], ["Good", "good", 2], ["Easy", "easy", 3]].forEach(function (r) {
        const intervalTxt = r[2] === 0 ? "soon" : humanHours(STUDY.predictStabilityHours(c.id, r[2]));
        const b = el("button", r[1], r[0] + "<small>" + intervalTxt + "</small>");
        b.onclick = function (e) { e.stopPropagation(); STUDY.recordItem(c.id, r[2], c.topicId, { mode: "flashcard" }); next(); };
        rate.appendChild(b);
      });
      mount.appendChild(rate);

      // optional typed recall (lenient: typos / wording OK), type then it flips
      if (!opts.audio) {
        const typeRow = el("div", "fill-in"); typeRow.style.marginTop = "10px";
        const tinp = el("input"); tinp.type = "text"; tinp.autocomplete = "off"; tinp.spellcheck = false; tinp.placeholder = "Optional: type your answer, press Enter";
        typeRow.appendChild(tinp); mount.appendChild(typeRow);
        tinp.onkeydown = function (e) {
          if (e.key !== "Enter") return;
          e.preventDefault();
          const ok = QUIZ.fuzzyMatch(tinp.value, [c.back]);
          tinp.classList.add(ok ? "correct" : "wrong");
          if (!flipped) flip();
          toast(ok ? "✓ Close enough, you recalled it" : "Not quite, check the answer");
        };
      }

      document.onkeydown = function (e) {
        if (e.target && e.target.tagName === "INPUT") return;
        if (e.code === "Space") { e.preventDefault(); flip(); }
        else if (flipped && e.key >= "1" && e.key <= "4") { rate.children[+e.key - 1].click(); }
      };
    }
    function next() {
      i++;
      if (i >= list.length) { document.onkeydown = null; finish(); }
      else { render(); window.scrollTo(0, 0); }
    }
    function finish() {
      if (opts.onComplete) opts.onComplete();   // mark done as soon as the deck is finished
      mount.innerHTML = "";
      mount.appendChild(el("div", "result-big", "<div class='score'>✓</div><div class='lbl'>Reviewed " + list.length + " cards</div>"));
      const bar = el("div", "qbar");
      const again = el("button", "btn", "Go again");
      again.onclick = function () { i = 0; QUIZ.runCards(mount, cards, opts); };
      const done = el("button", "btn primary", opts.doneLabel || "Done");
      done.onclick = function () { if (opts.onDone) opts.onDone(); };
      bar.appendChild(again); bar.appendChild(done); mount.appendChild(bar);
    }
    render();
  };

  function humanInterval(ms) {
    if (!ms) return "";
    if (ms < 3600000) return Math.round(ms / 60000) + "m";
    if (ms < 86400000) return Math.round(ms / 3600000) + "h";
    return Math.round(ms / 86400000) + "d";
  }
  function humanHours(h) {
    if (h < 1) return Math.max(1, Math.round(h * 60)) + "m";
    if (h < 24) return Math.round(h) + "h";
    if (h < 24 * 7) return Math.round(h / 24) + "d";
    if (h < 24 * 60) return Math.round(h / 24 / 7) + "w";
    return Math.round(h / 24 / 30) + "mo";
  }

  /* ---------------- "For You" adaptive feed ----------------
     One endless, self-adjusting feed. Each card is chosen by STUDY.ADAPT,
     graded by correctness + speed (+ optional "guess"), and the engine
     re-plans after every answer. Milestones + fatigue checks keep it human. */
  QUIZ.runFeed = function (mount, opts) {
    opts = opts || {};
    const ADAPT = STUDY.ADAPT;
    const ctx = { recent: [], lastTopic: null, lastSubject: null, only: opts.subjectId || null };
    const subjName = opts.subjectId ? ((STUDY.byId[opts.subjectId] || {}).name || "") : "";
    const ready = function () { return opts.subjectId ? ADAPT.readiness(opts.subjectId) : ADAPT.overallReadiness(); };
    const startReady = ready();
    let answered = 0, correct = 0, sinceMilestone = 0;
    const windowOk = [];   // rolling accuracy for fatigue

    function statusBar() {
      const bar = el("div", "feed-status");
      bar.innerHTML = "<span>🎯 <b>" + ready() + "%</b> " + (subjName ? esc(subjName) + " ready" : "ready") + "</span><span>🔥 " + STUDY.store().streak.count + "</span><span>" + answered + " done</span>";
      return bar;
    }

    function render() {
      const q = ADAPT.next(ctx);
      if (!q) { mount.innerHTML = '<div class="empty">No questions available.</div>'; return; }
      mount.innerHTML = "";
      mount.appendChild(statusBar());
      const subj = STUDY.byId[q.subjectId], topic = STUDY.topicIndex[q.topicId] ? STUDY.topicIndex[q.topicId].topic : null;
      if (subj) mount.appendChild(el("div", "q-kicker", esc(subj.name) + (topic ? " · " + esc(topic.title) : "")));
      const t0 = Date.now();
      renderItem(q, t0);
    }

    function proceed(q, ok, rt, guessed, chosen) {
      ADAPT.update(q, ok, rt, guessed, opts.subjectId ? "feed_subj" : "feed", chosen);
      answered++; sinceMilestone++; if (ok) correct++;
      windowOk.push(ok ? 1 : 0); if (windowOk.length > 8) windowOk.shift();
      ctx.recent.push(q.id); if (ctx.recent.length > 8) ctx.recent.shift();
      ctx.lastTopic = q.topicId; ctx.lastSubject = q.subjectId;
      const tired = windowOk.length >= 6 && (windowOk.reduce((a, b) => a + b, 0) / windowOk.length) < 0.4;
      if (sinceMilestone >= 12 || tired) milestone(tired);
      else { render(); window.scrollTo(0, 0); }
    }

    function milestone(tired) {
      sinceMilestone = 0;
      mount.innerHTML = "";
      const r = ready(), delta = r - startReady;
      const big = el("div", "result-big");
      big.appendChild(el("div", "score", r + "%"));
      big.appendChild(el("div", "lbl", (subjName ? esc(subjName) + " ready" : "finals ready") + (delta > 0 ? "  ▲ +" + delta : "") + " · " + correct + "/" + answered + " this set"));
      mount.appendChild(big);
      if (tired) mount.appendChild(el("div", "panel center", "😮‍💨 Your accuracy dipped, a 2-minute breather actually helps memory stick. Keep going, or pick it up later?"));
      else mount.appendChild(el("div", "panel center", "Nice momentum. The feed keeps adapting to exactly what you need next."));
      const bar = el("div", "qbar");
      const go = el("button", "btn primary", tired ? "Push on" : "Keep going");
      go.onclick = function () { render(); window.scrollTo(0, 0); };
      const done = el("button", "btn", "Done for now");
      done.onclick = function () { if (opts.onDone) opts.onDone(); };
      bar.appendChild(go); bar.appendChild(done); mount.appendChild(bar);
    }

    function actionsRow(q, ok, rtState) {
      const row = el("div", "row"); row.style.marginTop = "8px";
      if (ok) {
        const g = el("button", "btn sm ghost", "🤔 I guessed");
        g.onclick = function () { rtState.guessed = !rtState.guessed; g.classList.toggle("on", rtState.guessed); g.textContent = rtState.guessed ? "✓ counted as a guess" : "🤔 I guessed"; };
        row.appendChild(g);
      }
      return row;
    }
    function nextRow(q, ok, rt, rtState, chosen) {
      const bar = el("div", "qbar");
      const b = el("button", "btn primary", "Next →");
      b.onclick = function () { document.onkeydown = null; proceed(q, ok, rt, rtState.guessed, chosen); };
      bar.appendChild(b); mount.appendChild(bar); b.focus();
    }

    function renderItem(q, t0) {
      const rtState = { guessed: false };
      if (q.type === "listen") {
        const ab = el("div", "row"); ab.style.cssText = "margin-bottom:13px;align-items:center;gap:11px";
        ab.appendChild(QUIZ.speakerBtn(q.say, "fr-FR", "big"));
        ab.appendChild(el("div", "muted", "🎧 Listen, then answer."));
        mount.appendChild(ab);
        if (QUIZ.canSpeak) setTimeout(function () { QUIZ.speak(q.say, "fr-FR"); }, 260);
      }
      mount.appendChild(el("h2", "q-stem", esc(q.q || "What did you hear?")));

      if (q.type === "fill") {
        const rowi = el("div", "fill-in"); const inp = el("input"); inp.type = "text"; inp.autocomplete = "off"; inp.spellcheck = false; inp.placeholder = "Type your answer…";
        const go = el("button", "btn primary", "Check"); rowi.appendChild(inp); rowi.appendChild(go); mount.appendChild(rowi); inp.focus();
        let done = false;
        function check() { if (done || !norm(inp.value)) return inp.focus && inp.focus(); const ok = fuzzyMatch(inp.value, q.answers); const rt = Date.now() - t0; done = true; inp.disabled = true; go.disabled = true; inp.classList.add(ok ? "correct" : "wrong"); mount.appendChild(buildFeedback(ok, (q.answers || [])[0], q)); const a = actionsRow(q, ok, rtState); if (!ok) { const m = el("button", "btn sm good", "I was right →"); m.onclick = function () { m.remove(); proceed(q, true, rt, false); }; a.appendChild(m); } if (a.children.length) mount.appendChild(a); nextRow(q, ok, rt, rtState); }
        go.onclick = check; inp.onkeydown = function (e) { if (e.key === "Enter") { e.preventDefault(); if (!done) check(); } };
        return;
      }
      // mc / tf / listen → buttons
      let opts2, ansIdx;
      if (q.type === "tf") { opts2 = [["True", true], ["False", false]]; }
      else { const order = SRS.shuffle(q.choices.map((_, i) => i)); opts2 = order.map(i => [q.choices[i], i]); ansIdx = q.answer; }
      const wrap = el("div", "choices"); const btns = [];
      opts2.forEach(function (pair, n) {
        const c = el("button", "choice");
        c.appendChild(el("span", "key", String.fromCharCode(65 + n)));
        c.appendChild(el("span", "ct", esc(pair[0])));
        c.onclick = function () {
          const ok = q.type === "tf" ? (pair[1] === q.answer) : (pair[1] === ansIdx);
          const rt = Date.now() - t0;
          btns.forEach(function (b, k) { b.disabled = true; const ok2 = q.type === "tf" ? (opts2[k][1] === q.answer) : (opts2[k][1] === ansIdx); if (ok2) b.classList.add("correct"); else if (b === c) b.classList.add("wrong"); else b.classList.add("dim"); });
          const correctText = q.type === "tf" ? (q.answer ? "True" : "False") : q.choices[q.answer];
          mount.appendChild(buildFeedback(ok, correctText, q));
          const a = actionsRow(q, ok, rtState); if (a.children.length) mount.appendChild(a);
          nextRow(q, ok, rt, rtState, q.type === "tf" ? undefined : pair[1]); document.onkeydown = null;
        };
        wrap.appendChild(c); btns.push(c);
      });
      mount.appendChild(wrap);
      document.onkeydown = function (e) { const k = e.key.toLowerCase(); let idx = -1; if (k >= "1" && k <= "9") idx = +k - 1; else if (k >= "a" && k <= "z") idx = k.charCodeAt(0) - 97; if (idx >= 0 && idx < btns.length && !btns[idx].disabled) { e.preventDefault(); btns[idx].click(); } };
    }

    render();
  };

  /* ---------------- image-occlusion diagram runner ----------------
     Shows a diagram with every label hidden; you recall each part
     (typed, lenient) one at a time. */
  QUIZ.runDiagram = function (mount, diagram, opts) {
    opts = opts || {};
    const order = SRS.shuffle(diagram.parts.map((_, i) => i));
    const answered = {};
    let pos = 0, correct = 0;

    function markers(box, activeIdx) {
      diagram.parts.forEach(function (p, idx) {
        const m = el("div", "dmark");
        m.style.left = p.x + "%"; m.style.top = p.y + "%";
        if (answered[idx]) { m.classList.add("done", "lbl"); m.textContent = p.label; }
        else if (idx === activeIdx) { m.classList.add("active"); m.textContent = "?"; }
        else m.textContent = "•";
        box.appendChild(m);
      });
    }
    function render() {
      if (pos >= order.length) return finish();
      const idx = order[pos], part = diagram.parts[idx];
      mount.innerHTML = "";
      const top = el("div", "q-top"); const pr = el("div", "q-progress"); pr.appendChild(el("i")).style.width = (pos / order.length * 100) + "%";
      top.appendChild(pr); top.appendChild(el("div", "q-count", (pos + 1) + " / " + order.length)); mount.appendChild(top);
      mount.appendChild(el("div", "q-kicker", "🗺️ " + esc(diagram.title)));
      const box = el("div", "diagram-box"); box.innerHTML = diagram.svg; markers(box, idx); mount.appendChild(box);
      mount.appendChild(el("h2", "q-stem", "What is the highlighted (?) part?"));
      const row = el("div", "fill-in"); const inp = el("input"); inp.type = "text"; inp.autocomplete = "off"; inp.spellcheck = false; inp.placeholder = "Type the part name…";
      const go = el("button", "btn primary", "Check"); row.appendChild(inp); row.appendChild(go); mount.appendChild(row);
      const rev = el("button", "btn sm ghost", "Reveal answer"); rev.style.marginTop = "8px"; mount.appendChild(rev);
      inp.focus();
      let done = false;
      function settle(ok) {
        if (done) return; done = true; inp.disabled = true; go.disabled = true; rev.disabled = true;
        answered[idx] = part.label; if (ok) correct++;
        STUDY.recordItem("diagram:" + diagram.id + "#" + idx, ok ? 2 : 0, diagram.topicId, { mode: "diagram" });
        inp.classList.add(ok ? "correct" : "wrong");
        const fb = el("div", "explain " + (ok ? "ok" : "no"));
        fb.appendChild(el("span", "v", ok ? "✓ Correct" : "✗ It's the " + part.label));
        if (part.note) fb.insertAdjacentHTML("beforeend", esc(part.note));
        mount.appendChild(fb);
        const bar = el("div", "qbar"); const nb = el("button", "btn primary", pos + 1 < order.length ? "Next part →" : "See results");
        nb.onclick = function () { pos++; render(); window.scrollTo(0, 0); }; bar.appendChild(nb); mount.appendChild(bar); nb.focus();
      }
      go.onclick = function () { if (!norm(inp.value)) return inp.focus(); settle(QUIZ.fuzzyMatch(inp.value, [part.label].concat(part.aliases || []))); };
      rev.onclick = function () { settle(false); };
      inp.onkeydown = function (e) { if (e.key === "Enter") { e.preventDefault(); if (!done) go.onclick(); } };
    }
    function finish() {
      mount.innerHTML = "";
      const pct = Math.round(correct / order.length * 100);
      mount.appendChild(el("div", "result-big", "<div class='score'>" + pct + "%</div><div class='lbl'>" + correct + " of " + order.length + " labels recalled</div>"));
      const box = el("div", "diagram-box"); box.innerHTML = diagram.svg;
      diagram.parts.forEach(function (p) { const m = el("div", "dmark done lbl"); m.style.left = p.x + "%"; m.style.top = p.y + "%"; m.textContent = p.label; box.appendChild(m); });
      mount.appendChild(box);
      const bar = el("div", "qbar");
      const again = el("button", "btn", "Label again"); again.onclick = function () { QUIZ.runDiagram(mount, diagram, opts); };
      const done = el("button", "btn primary", opts.doneLabel || "Done"); done.onclick = function () { if (opts.onDone) opts.onDone(); };
      bar.appendChild(again); bar.appendChild(done); mount.appendChild(bar);
    }
    render();
  };

  /* ---------------- CRAM mode ----------------
     Research-backed last-minute drilling: massed RETRIEVAL practice with
     immediate feedback, items interleaved, missed items requeued to come
     back SOON, and each item "locked in" only after 2 correct in a row
     (a criterion / Leitner-drop). You keep cycling until everything is
     locked, so weak items get the most reps. */
  QUIZ.runCram = function (mount, items, opts) {
    opts = opts || {};
    const pool = (items || []).filter(q => q.type === "mc" || q.type === "fill" || q.type === "tf");
    if (!pool.length) { mount.innerHTML = '<div class="empty">Nothing to cram here yet.</div>'; return; }
    const DROP = opts.dropAfter || 2;
    const total = pool.length;
    const cc = {}, locked = {};
    let queue = SRS.interleave(pool.slice());
    let lockedCount = 0, answered = 0, correct = 0;

    function nextItem() { while (queue.length && locked[queue[0].id]) queue.shift(); return queue[0] || null; }
    function requeue(q, dist) { queue.shift(); queue.splice(Math.min(queue.length, dist), 0, q); }

    function after(q, ok) {
      answered++; if (ok) correct++;
      STUDY.recordItem(q.id, ok ? 2 : 0, q.topicId, { mode: "cram" });
      if (ok) {
        cc[q.id] = (cc[q.id] || 0) + 1;
        if (cc[q.id] >= DROP) { locked[q.id] = true; lockedCount++; queue.shift(); toast("🔒 Locked in"); }
        else requeue(q, 5 + Math.floor(Math.random() * 3));
      } else { cc[q.id] = 0; requeue(q, 2 + Math.floor(Math.random() * 2)); }
      if (lockedCount >= total) finish(); else { render(); window.scrollTo(0, 0); }
    }

    function render() {
      const q = nextItem();
      if (!q) return finish();
      mount.innerHTML = "";
      const stat = el("div", "cram-stat");
      const bar = el("div", "cram-locks"); bar.appendChild(el("i")).style.width = (lockedCount / total * 100) + "%";
      stat.appendChild(bar);
      stat.appendChild(el("div", "cram-num", "🔒 " + lockedCount + " / " + total));
      mount.appendChild(stat);
      const subj = STUDY.byId[q.subjectId], topic = STUDY.topicIndex[q.topicId] ? STUDY.topicIndex[q.topicId].topic : null;
      if (subj) mount.appendChild(el("div", "q-kicker", esc(subj.name) + (topic ? " · " + esc(topic.title) : "")));
      const cn = (cc[q.id] || 0);
      if (cn > 0) mount.appendChild(el("div", "cram-badge", "✓ once, get it again to lock it"));
      renderItem(q);
    }

    const feedback = function (ok, correctText, q, extra) { return buildFeedback(ok, correctText, q, extra); };
    function nextBtn(q, ok) {
      const bar = el("div", "qbar");
      const b = el("button", "btn primary", "Next →");
      b.onclick = function () { document.onkeydown = null; after(q, ok); };
      bar.appendChild(b); mount.appendChild(bar); b.focus();
    }

    function renderItem(q) {
      mount.appendChild(el("h2", "q-stem", esc(q.q)));
      if (q.type === "mc") {
        const order = SRS.shuffle(q.choices.map((_, i) => i));
        const wrap = el("div", "choices"); const btns = [];
        order.forEach(function (oi, n) {
          const c = el("button", "choice");
          c.appendChild(el("span", "key", String.fromCharCode(65 + n)));
          c.appendChild(el("span", "ct", esc(q.choices[oi])));
          c.onclick = function () {
            const ok = oi === q.answer;
            btns.forEach(function (b, k) { b.disabled = true; if (order[k] === q.answer) b.classList.add("correct"); else if (b === c) b.classList.add("wrong"); else b.classList.add("dim"); });
            mount.appendChild(feedback(ok, q.choices[q.answer], q));
            nextBtn(q, ok); document.onkeydown = null;
          };
          wrap.appendChild(c); btns.push(c);
        });
        mount.appendChild(wrap);
        document.onkeydown = function (e) { const k = e.key.toLowerCase(); let idx = -1; if (k >= "1" && k <= "9") idx = +k - 1; else if (k >= "a" && k <= "z") idx = k.charCodeAt(0) - 97; if (idx >= 0 && idx < btns.length && !btns[idx].disabled) { e.preventDefault(); btns[idx].click(); } };
      } else if (q.type === "tf") {
        const wrap = el("div", "choices");
        [["True", true], ["False", false]].forEach(function (pair) {
          const c = el("button", "choice"); c.appendChild(el("span", "ct", pair[0]));
          c.onclick = function () { const ok = pair[1] === q.answer; Array.from(wrap.children).forEach(b => b.disabled = true); c.classList.add(ok ? "correct" : "wrong"); mount.appendChild(feedback(ok, q.answer ? "True" : "False", q)); nextBtn(q, ok); };
          wrap.appendChild(c);
        });
        mount.appendChild(wrap);
      } else { // fill
        const row = el("div", "fill-in"); const inp = el("input"); inp.type = "text"; inp.autocomplete = "off"; inp.spellcheck = false; inp.placeholder = "Type your answer…";
        const go = el("button", "btn primary", "Check"); row.appendChild(inp); row.appendChild(go); mount.appendChild(row); inp.focus();
        let done = false;
        function check() {
          if (done) return; if (!norm(inp.value)) return inp.focus();
          const ok = fuzzyMatch(inp.value, q.answers);
          done = true; inp.disabled = true; go.disabled = true; inp.classList.add(ok ? "correct" : "wrong");
          mount.appendChild(feedback(ok, (q.answers || [])[0], q));
          const extra = el("div", "row");
          if (!ok) { const m = el("button", "btn sm good", "I was right →"); m.onclick = function () { m.remove(); after(q, true); }; extra.appendChild(m); }
          const bar = el("div", "qbar"); if (extra.children.length) bar.appendChild(extra);
          const b = el("button", "btn primary", "Next →"); b.onclick = function () { after(q, ok); }; bar.appendChild(b); mount.appendChild(bar); b.focus();
        }
        go.onclick = check; inp.onkeydown = function (e) { if (e.key === "Enter") { e.preventDefault(); if (!done) check(); } };
      }
    }

    function finish() {
      document.onkeydown = null;
      mount.innerHTML = "";
      mount.appendChild(el("div", "result-big", "<div class='score'>🔒</div><div class='lbl'>All " + total + " items locked in!</div>"));
      mount.appendChild(el("div", "panel center", "You answered " + answered + " times to lock " + total + " items (" + Math.round(correct / Math.max(1, answered) * 100) + "% first-try accuracy). That's the cram working: the ones you missed got the most reps."));
      const bar = el("div", "qbar");
      const again = el("button", "btn", "Cram again");
      again.onclick = function () { QUIZ.runCram(mount, items, opts); };
      const done = el("button", "btn primary", opts.doneLabel || "Done");
      done.onclick = function () { if (opts.onDone) opts.onDone(); };
      bar.appendChild(again); bar.appendChild(done); mount.appendChild(bar);
    }

    render();
  };

  QUIZ.norm = norm;
  STUDY.QUIZ = QUIZ;
})(window.STUDY);
