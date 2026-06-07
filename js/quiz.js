/* ============================================================
   quiz.js — interactive question + flashcard runner
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
      if (q.type === "fill") return renderFill(q);
      if (q.type === "tf") return renderTF(q);
      return renderMC(q);
    }

    function feedbackBlock(ok, correctText, explain, q) {
      const fb = el("div", "explain " + (ok ? "ok" : "no"));
      fb.appendChild(el("span", "v", ok ? "✓ Correct" : "✗ Not quite"));
      let body = "";
      if (!ok && correctText) body += "<b>Answer:</b> " + esc(correctText) + "<br>";
      if (explain) body += esc(explain);
      if (body) fb.insertAdjacentHTML("beforeend", body);
      if (q && q.subjectId === "french" && correctText && QUIZ.canSpeak) {
        const sp = QUIZ.speakerBtn(correctText, "fr-FR"); sp.style.marginTop = "8px";
        fb.appendChild(document.createElement("br")); fb.appendChild(sp);
      }
      return fb;
    }

    function advanceBar() {
      // grow the top progress bar after answering
      const bar = mount.querySelector(".q-progress > i");
      if (bar) bar.style.width = ((state.i + 1) / state.list.length * 100) + "%";
    }

    function commit(q, grade, ok) {
      STUDY.recordItem(q.id, grade, q.topicId);
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
          commit(q, ok ? 2 : 0, ok);
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
        mount.appendChild(feedbackBlock(ok, q.choices[q.answer], q.explain, q));
        commit(q, ok ? 2 : 0, ok);
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
          mount.appendChild(feedbackBlock(ok, q.answer ? "True" : "False", q.explain, q));
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
        const accepted = (q.answers || []).map(norm);
        const ok = accepted.some(function (a) { return a === val || (a.length > 4 && (val.includes(a) || a.includes(val))); });
        done = true; inp.disabled = true; go.disabled = true;
        if (!instant) {
          inp.classList.add("selected"); commit(q, ok ? 2 : 0, ok);
          if (state.i + 1 < state.list.length) setTimeout(function () { state.i++; render(); window.scrollTo(0, 0); }, 160); else nextBar();
          return;
        }
        inp.classList.add(ok ? "correct" : "wrong");
        mount.appendChild(feedbackBlock(ok, (q.answers || [])[0], q.explain, q));
        commit(q, ok ? 2 : 0, ok);
        // let the user override self-grade (lenient subject matter)
        const extra = el("div", "row");
        if (!ok) {
          const mark = el("button", "btn sm good", "I was right →");
          mark.onclick = function () { STUDY.recordItem(q.id, 2, q.topicId); state.correct++; state.results[state.results.length - 1].ok = true; mark.remove(); toast("Counted as correct"); };
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
        mount.appendChild(feedbackBlock(allOk, "", detail || q.explain));
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
          line.innerHTML = "<b>" + esc(r.q.q) + "</b><br><span class='muted'>" + esc(ans || "") + "</span>";
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
      if (subj) mount.appendChild(el("div", "q-kicker", esc(subj.name) + (topic ? " · " + esc(topic.title) : "")));

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
        const intervalTxt = humanInterval(STUDY.SRS.BOX_INTERVAL[Math.min(5, (STUDY.itemState(c.id) ? STUDY.itemState(c.id).box : 0) + (r[2] >= 2 ? r[2] - 1 : 0))] || 0);
        const b = el("button", r[1], r[0] + "<small>" + (r[2] === 0 ? "soon" : intervalTxt) + "</small>");
        b.onclick = function (e) { e.stopPropagation(); STUDY.recordItem(c.id, r[2], c.topicId); next(); };
        rate.appendChild(b);
      });
      mount.appendChild(rate);

      document.onkeydown = function (e) {
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
      STUDY.recordItem(q.id, ok ? 2 : 0, q.topicId);
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
      if (cn > 0) mount.appendChild(el("div", "cram-badge", "✓ once — get it again to lock it"));
      renderItem(q);
    }

    function feedback(ok, correctText, explain, q) {
      const fb = el("div", "explain " + (ok ? "ok" : "no"));
      fb.appendChild(el("span", "v", ok ? "✓ Correct" : "✗ Not quite"));
      let body = "";
      if (!ok && correctText) body += "<b>Answer:</b> " + esc(correctText) + "<br>";
      if (explain) body += esc(explain);
      if (body) fb.insertAdjacentHTML("beforeend", body);
      if (q && q.subjectId === "french" && correctText && QUIZ.canSpeak) { fb.appendChild(document.createElement("br")); fb.appendChild(QUIZ.speakerBtn(correctText, "fr-FR")); }
      return fb;
    }
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
            mount.appendChild(feedback(ok, q.choices[q.answer], q.explain, q));
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
          c.onclick = function () { const ok = pair[1] === q.answer; Array.from(wrap.children).forEach(b => b.disabled = true); c.classList.add(ok ? "correct" : "wrong"); mount.appendChild(feedback(ok, q.answer ? "True" : "False", q.explain, q)); nextBtn(q, ok); };
          wrap.appendChild(c);
        });
        mount.appendChild(wrap);
      } else { // fill
        const row = el("div", "fill-in"); const inp = el("input"); inp.type = "text"; inp.autocomplete = "off"; inp.spellcheck = false; inp.placeholder = "Type your answer…";
        const go = el("button", "btn primary", "Check"); row.appendChild(inp); row.appendChild(go); mount.appendChild(row); inp.focus();
        let done = false;
        function check() {
          if (done) return; const val = norm(inp.value); if (!val) return inp.focus();
          const ok = (q.answers || []).map(norm).some(a => a === val || (a.length > 4 && (val.includes(a) || a.includes(val))));
          done = true; inp.disabled = true; go.disabled = true; inp.classList.add(ok ? "correct" : "wrong");
          mount.appendChild(feedback(ok, (q.answers || [])[0], q.explain, q));
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
