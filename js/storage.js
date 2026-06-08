/* ============================================================
   storage.js, global namespace, content registry, persistence
   ============================================================ */
(function (global) {
  "use strict";

  const KEY = "recall.finals.v1";
  const DAY = 86400000;

  const STUDY = {
    subjects: [],          // registered subjects, in display order
    byId: {},              // subjectId -> subject
    topicIndex: {},        // topicId -> {subject, topic}
    itemIndex: {},         // itemId -> {type, subject, topic, ref}
    EXAM_DATES: {},        // optional per-subject exam date (yyyy-mm-dd)
  };

  /* ---------- content registration ---------- */
  STUDY.register = function (subject) {
    STUDY.subjects.push(subject);
    STUDY.byId[subject.id] = subject;
    (subject.topics || []).forEach(function (topic, ti) {
      topic.subjectId = subject.id;
      if (!topic.id) topic.id = subject.id + "-t" + ti;
      STUDY.topicIndex[topic.id] = { subject: subject, topic: topic };
      // assign stable ids to questions and cards
      (topic.questions || []).forEach(function (q, qi) {
        q.id = topic.id + "#q" + qi;
        q.topicId = topic.id;
        q.subjectId = subject.id;
        STUDY.itemIndex[q.id] = { type: "q", subject: subject, topic: topic, ref: q };
      });
      (topic.cards || []).forEach(function (c, ci) {
        c.id = topic.id + "#c" + ci;
        c.topicId = topic.id;
        c.subjectId = subject.id;
        STUDY.itemIndex[c.id] = { type: "c", subject: subject, topic: topic, ref: c };
      });
    });
  };

  // append questions to a topic at runtime (after registration).
  // isGen=true  -> auto-generated (card→MC, parametric)
  // isGen=false -> authored "extra" variety questions
  STUDY.addQuestions = function (topic, qs, isGen) {
    const start = topic.questions.length;
    qs.forEach(function (q, k) {
      const qi = start + k;
      q.id = topic.id + "#q" + qi;
      q.topicId = topic.id;
      q.subjectId = topic.subjectId;
      q.gen = (isGen !== false);
      topic.questions.push(q);
      STUDY.itemIndex[q.id] = { type: "q", subject: STUDY.byId[topic.subjectId], topic: topic, ref: q };
    });
  };

  // add authored variety questions onto an existing topic by id (used by data/extra.js)
  STUDY.addAuthored = function (topicId, qs) {
    const entry = STUDY.topicIndex[topicId];
    if (entry) STUDY.addQuestions(entry.topic, qs, false);
  };

  STUDY.allQuestions = function (filterFn) {
    const out = [];
    STUDY.subjects.forEach(function (s) {
      s.topics.forEach(function (t) {
        (t.questions || []).forEach(function (q) {
          if (!filterFn || filterFn(q, t, s)) out.push(q);
        });
      });
    });
    return out;
  };

  /* ---------- persistence ---------- */
  const DEFAULT = function () {
    return {
      v: 1,
      srs: {},        // itemId -> {box, due, last, reps, lapses}
      stats: {},      // topicId -> {attempts, correct, seen, cards}
      wrong: {},      // itemId -> true (needs review)
      seen: {},       // topicId -> last visited ts
      done: {},       // topicId -> {learn, cards, practice, practiceBest}
      starred: {},    // itemId -> ts (bookmarks)
      streak: { count: 0, last: 0, best: 0 },
      activity: {},   // 'yyyy-mm-dd' -> count
      masteryHist: {},// 'yyyy-mm-dd' -> overall mastery % (snapshot)
      subjectSkill: {},// subjectId -> ability rating mirror (adaptive engine)
      glicko: {},     // subjectId -> {r, rd, t} Glicko-style ability + uncertainty
      examDates: {},  // subjectId -> 'yyyy-mm-dd'
      log: [],        // study-data event log (local, for your own export)
      tele: {},       // anonymous telemetry state (anon id, last ping day)
      teleQueue: [],  // outbound anonymous events awaiting upload
      miss: {},       // subjectId -> [{it, c:chosenText, a:answerText, cc:concept, t}] (misconception radar)
      flagged: {},    // itemId -> {t, reason} reported-as-broken questions (suppressed)
      rtBase: {},     // questionType -> rolling baseline response time (self-calibrated fluency)
      lastTest: null, // last generated test manifest (for entering results later)
      settings: { theme: "dark" },
    };
  };

  let store = DEFAULT();

  STUDY.load = function () {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        store = Object.assign(DEFAULT(), parsed);
        // ensure nested objects exist
        ["srs", "stats", "wrong", "seen", "done", "starred", "activity", "masteryHist", "subjectSkill", "examDates", "miss", "flagged", "glicko"].forEach(function (k) {
          if (!store[k]) store[k] = {};
        });
        if (!store.streak) store.streak = { count: 0, last: 0, best: 0 };
        if (!Array.isArray(store.log)) store.log = [];
        if (!store.tele) store.tele = {};
        if (!Array.isArray(store.teleQueue)) store.teleQueue = [];
        if (!store.settings) store.settings = { theme: "dark" };
      }
    } catch (e) { store = DEFAULT(); }
    return store;
  };

  // Write synchronously on every change so progress survives an immediate
  // tab close / refresh. localStorage is fast and the payload is tiny.
  STUDY.save = function () {
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
  };
  STUDY.flush = STUDY.save;

  STUDY.store = function () { return store; };

  STUDY.reset = function () {
    store = DEFAULT();
    try { localStorage.removeItem(KEY); } catch (e) {}
    STUDY.save();
  };

  STUDY.exportData = function () { return JSON.stringify(store); };
  // compact copy-paste export: everything needed to RESTORE progress, minus the
  // behavioral log + outbound queue (which are big and not needed to restore).
  STUDY.exportProgress = function () {
    const copy = {}; Object.keys(store).forEach(function (k) { if (k !== "log" && k !== "teleQueue") copy[k] = store[k]; });
    return JSON.stringify(copy);
  };

  /* ---- LZ string compression (pieroxy lz-string, base64 variant; public domain) ----
     Lets a copy-paste code carry the ENTIRE store (log included) at ~1/5 the size,
     synchronously (no async clipboard quirks) and fully offline. */
  const LZ = (function () {
    const keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    const rev = {}; for (let z = 0; z < keyStr.length; z++) rev[keyStr.charAt(z)] = z;
    const f = String.fromCharCode;
    function _compress(uncompressed, bitsPerChar, getCharFromInt) {
      if (uncompressed == null) return "";
      let i, value, dict = {}, toCreate = {}, c = "", wc = "", w = "", enlargeIn = 2,
        dictSize = 3, numBits = 2, data = [], dataVal = 0, dataPos = 0;
      function push(v) { dataVal = (dataVal << 1) | v; if (dataPos == bitsPerChar - 1) { dataPos = 0; data.push(getCharFromInt(dataVal)); dataVal = 0; } else dataPos++; }
      function emit(w) {
        if (Object.prototype.hasOwnProperty.call(toCreate, w)) {
          if (w.charCodeAt(0) < 256) { for (i = 0; i < numBits; i++) push(0); value = w.charCodeAt(0); for (i = 0; i < 8; i++) { push(value & 1); value >>= 1; } }
          else { value = 1; for (i = 0; i < numBits; i++) { push(value); value = 0; } value = w.charCodeAt(0); for (i = 0; i < 16; i++) { push(value & 1); value >>= 1; } }
          enlargeIn--; if (enlargeIn == 0) { enlargeIn = Math.pow(2, numBits); numBits++; } delete toCreate[w];
        } else { value = dict[w]; for (i = 0; i < numBits; i++) { push(value & 1); value >>= 1; } }
        enlargeIn--; if (enlargeIn == 0) { enlargeIn = Math.pow(2, numBits); numBits++; }
      }
      for (let ii = 0; ii < uncompressed.length; ii++) {
        c = uncompressed.charAt(ii);
        if (!Object.prototype.hasOwnProperty.call(dict, c)) { dict[c] = dictSize++; toCreate[c] = true; }
        wc = w + c;
        if (Object.prototype.hasOwnProperty.call(dict, wc)) { w = wc; }
        else { emit(w); dict[wc] = dictSize++; w = String(c); }
      }
      if (w !== "") emit(w);
      value = 2; for (i = 0; i < numBits; i++) { push(value & 1); value >>= 1; }
      while (true) { dataVal = (dataVal << 1); if (dataPos == bitsPerChar - 1) { data.push(getCharFromInt(dataVal)); break; } else dataPos++; }
      return data.join("");
    }
    function _decompress(length, resetValue, getNextValue) {
      let dictionary = [], enlargeIn = 4, dictSize = 4, numBits = 3, entry = "", result = [],
        i, w, bits, resb, maxpower, power, c, data = { val: getNextValue(0), position: resetValue, index: 1 };
      for (i = 0; i < 3; i++) dictionary[i] = i;
      function readBits(n) { let b = 0, mp = Math.pow(2, n), p = 1; while (p != mp) { resb = data.val & data.position; data.position >>= 1; if (data.position == 0) { data.position = resetValue; data.val = getNextValue(data.index++); } b |= (resb > 0 ? 1 : 0) * p; p <<= 1; } return b; }
      let next = readBits(2);
      switch (next) { case 0: c = f(readBits(8)); break; case 1: c = f(readBits(16)); break; case 2: return ""; }
      dictionary[3] = c; w = c; result.push(c);
      while (true) {
        if (data.index > length) return "";
        c = readBits(numBits);
        switch (c) {
          case 0: dictionary[dictSize++] = f(readBits(8)); c = dictSize - 1; enlargeIn--; break;
          case 1: dictionary[dictSize++] = f(readBits(16)); c = dictSize - 1; enlargeIn--; break;
          case 2: return result.join("");
        }
        if (enlargeIn == 0) { enlargeIn = Math.pow(2, numBits); numBits++; }
        if (dictionary[c]) entry = dictionary[c]; else { if (c === dictSize) entry = w + w.charAt(0); else return null; }
        result.push(entry); dictionary[dictSize++] = w + entry.charAt(0); enlargeIn--; w = entry;
        if (enlargeIn == 0) { enlargeIn = Math.pow(2, numBits); numBits++; }
      }
    }
    return {
      compressToBase64: function (input) {
        if (input == null) return "";
        const res = _compress(input, 6, function (a) { return keyStr.charAt(a); });
        switch (res.length % 4) { default: case 0: return res; case 1: return res + "==="; case 2: return res + "=="; case 3: return res + "="; }
      },
      decompressFromBase64: function (input) {
        if (input == null) return ""; if (input === "") return null;
        return _decompress(input.length, 32, function (index) { return rev[input.charAt(index)]; });
      },
    };
  })();
  STUDY.LZ = LZ;

  // pack EVERYTHING (full store, log included) into a compact copy-paste code.
  STUDY.packData = function () { return "RZ1:" + LZ.compressToBase64(JSON.stringify(store)); };
  // accept anything: an RZ1 compressed code, a bare compressed blob, or raw JSON.
  STUDY.unpackData = function (str) {
    str = String(str == null ? "" : str).trim();
    if (!str) return null;
    if (str.indexOf("RZ1:") === 0) { try { return JSON.parse(LZ.decompressFromBase64(str.slice(4))); } catch (e) { return null; } }
    if (str.charAt(0) === "{") { try { return JSON.parse(str); } catch (e) { return null; } }
    try { const j = LZ.decompressFromBase64(str); if (j && j.charAt(0) === "{") return JSON.parse(j); } catch (e) { }   // marker stripped by a paste field
    return null;
  };

  // --- study-data export (for your own analysis; local + private) ---
  STUDY.studyData = function () {
    const log = store.log || [];
    const bySubject = {}, byTopic = {}, byMode = {}, byDay = {};
    let totalRt = 0, rtN = 0;
    log.forEach(function (e) {
      const add = (o, k) => { const r = o[k] || (o[k] = { attempts: 0, correct: 0 }); r.attempts++; if (e.ok) r.correct++; };
      if (e.s) add(bySubject, e.s);
      if (e.tp) add(byTopic, e.tp);
      add(byMode, e.m || "other");
      const day = dayKey(e.t); byDay[day] = (byDay[day] || 0) + 1;
      if (e.rt) { totalRt += e.rt; rtN++; }
    });
    const acc = (o) => { Object.keys(o).forEach(k => o[k].accuracy = +(o[k].correct / Math.max(1, o[k].attempts)).toFixed(3)); return o; };
    return {
      generated: new Date().toISOString(),
      note: "Local study-data export from Recall. Behavior events only, no personal information.",
      legend: { t: "timestamp(ms)", it: "itemId", tp: "topicId", s: "subjectId", g: "grade 0=again 1=hard 2=good 3=easy", ok: "correct(1/0)", rt: "responseTime(ms)", m: "mode", lv: "level 1=easy 2=hard", ch: "chosen distractor index (wrong MC picks)" },
      totals: { events: log.length, days: Object.keys(byDay).length, avgResponseMs: rtN ? Math.round(totalRt / rtN) : null, streakBest: store.streak.best || 0 },
      bySubject: acc(bySubject), byTopic: acc(byTopic), byMode: acc(byMode), byDay: byDay,
      events: log,
    };
  };
  STUDY.studyDataCSV = function () {
    const rows = [["iso_time", "epoch_ms", "subject", "topic", "item", "grade", "correct", "response_ms", "mode", "level"]];
    (store.log || []).forEach(function (e) {
      rows.push([new Date(e.t).toISOString(), e.t, e.s, e.tp, e.it, e.g, e.ok, e.rt, e.m, e.lv]);
    });
    return rows.map(r => r.map(c => /[",\n]/.test(String(c)) ? '"' + String(c).replace(/"/g, '""') + '"' : c).join(",")).join("\n");
  };
  /* ---------- enter results from a test (app-generated or external) ---------- */
  // remember a generated test so you can grade it later (after a printed/online sitting)
  STUDY.saveLastTest = function (m) {
    if (!m || !m.sections) return;
    const items = [];
    m.sections.forEach(function (sec) {
      if (sec.kind === "mc" || sec.kind === "free" || sec.kind === "fill") {
        (sec.items || []).forEach(function (it) { if (it.id) items.push({ id: it.id, no: it.no, stem: String(it.stem || "").slice(0, 140) }); });
      }
    });
    if (!items.length) return;
    store.lastTest = { when: Date.now(), title: m.title || "Practice test", subjectId: m.subjectId || "", items: items };
    STUDY.save();
  };
  STUDY.lastTest = function () { return store.lastTest || null; };
  // apply per-question results: [{id, correct}] -> updates mastery exactly like a real session
  STUDY.applyTestResults = function (results) {
    let n = 0;
    (results || []).forEach(function (r) {
      const ix = STUDY.itemIndex[r.id]; if (!ix || ix.type !== "q" || !ix.ref) return;
      STUDY.ADAPT.update(ix.ref, !!r.correct, 2000, false, "test", undefined, 0);   // exam retrieval = solid evidence
      n++;
    });
    return n;
  };
  // generic per-topic logger for ANY test: marks `correct` of `total` items right
  STUDY.applyTopicResult = function (topicId, correct, total) {
    const e = STUDY.topicIndex[topicId]; if (!e) return 0;
    const items = (e.topic.questions || []).filter(q => q.type !== "match");
    if (!items.length) return 0;
    total = Math.max(0, Math.min(total | 0, items.length));
    correct = Math.max(0, Math.min(correct | 0, total));
    const pick = STUDY.SRS.shuffle(items.slice()).slice(0, total);
    pick.forEach(function (q, i) { STUDY.ADAPT.update(q, i < correct, 2000, false, "test", undefined, 0); });
    return total;
  };

  STUDY.importData = function (json) {
    const parsed = STUDY.unpackData(json);   // compressed code, bare blob, or raw JSON
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return false;
    try { store = Object.assign(DEFAULT(), parsed); STUDY.save(); return true; }
    catch (e) { return false; }
  };

  /* ---------- settings ---------- */
  STUDY.setTheme = function (t) {
    store.settings.theme = t;
    document.documentElement.setAttribute("data-theme", t);
    STUDY.save();
  };
  STUDY.theme = function () { return store.settings.theme || "dark"; };

  /* ---------- date helpers ---------- */
  function dayKey(ts) {
    const d = new Date(ts);
    return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
  }
  STUDY.dayKey = dayKey;

  /* ---------- exam dates (for adaptive urgency weighting) ---------- */
  STUDY.FINALS_DEFAULT = "2026-06-09";
  STUDY.setExamDate = function (subjectId, dateStr) {
    if (dateStr) store.examDates[subjectId] = dateStr; else delete store.examDates[subjectId];
    STUDY.save();
  };
  STUDY.examDate = function (subjectId) { return store.examDates[subjectId] || null; };
  STUDY.daysToExam = function (subjectId) {
    const d = store.examDates[subjectId] || STUDY.FINALS_DEFAULT;
    const parts = d.split("-");
    const exam = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    const now = new Date(); now.setHours(0, 0, 0, 0);
    return Math.round((exam - now) / DAY);
  };

  /* ---------- streak ---------- */
  STUDY.touchStreak = function () {
    const now = Date.now();
    const today = dayKey(now);
    store.activity[today] = (store.activity[today] || 0) + 1;
    const last = store.streak.last;
    if (!last) {
      store.streak.count = 1;
    } else {
      const lastDay = dayKey(last);
      if (lastDay !== today) {
        // was it yesterday?
        const y = dayKey(now - DAY);
        store.streak.count = (lastDay === y) ? store.streak.count + 1 : 1;
      }
    }
    store.streak.last = now;
    store.streak.best = Math.max(store.streak.best || 0, store.streak.count);
    // snapshot overall readiness for today (for the progress graph)
    if (STUDY.ADAPT) store.masteryHist[today] = STUDY.ADAPT.overallReadiness();
    STUDY.save();
  };

  /* ---------- SRS state access ---------- */
  STUDY.itemState = function (id) {
    return store.srs[id] || null;
  };

  /* ---------- forgetting model (one scheduler for every mode) ----------
     Each item has a memory "stability" in HOURS. Reviewing grows it; the
     four ratings always give distinct, growing intervals (no 7d plateau).
     Carries over existing Leitner progress by seeding from the old box. */
  const HOUR = 3600000, STAB_CAP = 2160;   // cap ~90 days
  function clampN(v, lo, hi) { return v < lo ? lo : v > hi ? hi : v; }
  function recallNow(st, now) {
    if (!st || !st.last) return 1;
    const S = seedStability(st);
    return Math.pow(2, -((now - st.last) / HOUR) / (S || 1));
  }
  function seedStability(st) {
    if (st && st.stability) return st.stability;
    const box = (st && st.box) || 0;
    if (box > 0) return (STUDY.SRS.BOX_INTERVAL[box] || HOUR) / HOUR;   // carry Leitner progress
    return 4;                                                          // fresh card base (hours)
  }
  // predicted next stability (hours) for a grade, given current seed + recall p
  function gradeStability(seedS, grade, p) {
    if (grade <= 0) return 0.2;                                         // ~12 min
    if (grade === 1) return clampN(seedS * 1.2, 0.3, STAB_CAP);          // Hard
    if (grade === 2) return clampN(seedS * (2.0 + 0.6 * (1 - p)), 0.3, STAB_CAP); // Good
    return clampN(seedS * (3.2 + 0.8 * (1 - p)), 0.3, STAB_CAP);         // Easy
  }
  STUDY.recallNow = recallNow;
  STUDY.predictStabilityHours = function (id, grade) {
    const st = store.srs[id] || null;
    return gradeStability(seedStability(st), grade, recallNow(st, Date.now()));
  };

  /* ---------- honest mastery (passive Bayesian Knowledge Tracing) ----------
     No extra taps: we infer "did you really know it" from the answer + how fast
     you answered + how guessable the item was (a 4-choice MC correct is weak
     evidence; a fast correct on a hard item is strong). st.kn = P(you know it). */
  function guessProb(ref) {
    if (!ref) return 0.12;                                  // flashcard (self-graded) / unknown
    if (ref.type === "mc" && ref.choices) return 1 / ref.choices.length;
    if (ref.type === "tf") return 0.5;
    if (ref.type === "fill") return 0.05;
    return 0.12;
  }
  // Bayesian update of P(known) given one graded attempt. Now weighs HOW you got
  // it right, not just whether: fluency (how confidently/fast, self-calibrated to
  // your own pace upstream) and pexp (how likely you were EXPECTED to get it from
  // Elo skill-vs-difficulty). Beating a hard item fast = strong evidence; acing an
  // easy one slowly = weak. opts: { fluency 0..1, pexp 0..1 }.
  function bktUpdate(prior, grade, g, opts) {
    const o = opts || {};
    const p = (prior == null) ? 0.09 : prior;              // fresh item: mostly unknown (one correct shouldn't "master" it)
    const correct = grade >= 1;                            // 0 = wrong, >=1 = (some) recall
    const weak = grade === 1;                              // Hard / flagged-guess correct
    // fluency: provided by the feed; else inferred from the self-graded card button
    let fl = (typeof o.fluency === "number") ? o.fluency
      : (grade >= 3 ? 0.85 : grade === 2 ? 0.5 : grade === 1 ? 0.2 : 0.3);
    fl = clampN(fl, 0, 1);
    const pexp = clampN((typeof o.pexp === "number") ? o.pexp : 0.5, 0.05, 0.95);
    // effective guess: base chance, modestly LOWER when the item was hard for you
    // (low pexp) and when you answered confidently. Kept gentle so a high global
    // ability can't stall a per-item correct, so repeated wins converge to known.
    let ge = g * (0.65 + 0.35 * pexp) * (1 - 0.3 * fl);
    if (weak) ge = Math.max(ge, 0.6);
    ge = clampN(ge, 0.02, 0.9);
    const slip = clampN(0.16 - 0.11 * fl, 0.03, 0.18);     // confident answers slip less
    let post;
    if (correct) post = (p * (1 - slip)) / (p * (1 - slip) + (1 - p) * ge);
    else post = (p * slip) / (p * slip + (1 - p) * (1 - ge));
    // learning gain: a confident correct on a hard item teaches the most
    const pT = correct ? clampN(0.04 + 0.06 * fl + 0.06 * (1 - pexp), 0.02, 0.18) : 0.03;
    return clampN(post + (1 - post) * pT, 0, 0.999);
  }
  function captureMiss(id, grade, ref, chosen, indexed) {
    if (grade !== 0 || !ref || ref.type !== "mc" || !ref.choices) return;
    if (typeof chosen !== "number" || chosen === ref.answer || chosen < 0 || chosen >= ref.choices.length) return;
    if (!store.miss) store.miss = {};
    const sid = indexed && indexed.subject ? indexed.subject.id : "";
    const arr = store.miss[sid] || (store.miss[sid] = []);
    arr.push({ it: id, c: String(ref.choices[chosen]), a: String(ref.choices[ref.answer]), cc: ref.concept || "", t: Date.now() });
    if (arr.length > 400) arr.splice(0, arr.length - 400);
  }

  // record an attempt on an item (question or card)
  // grade: 0=again/wrong, 1=hard, 2=good/correct, 3=easy
  // meta (optional): { rt, mode, level } for the study-data log
  STUDY.recordItem = function (id, grade, topicId, meta) {
    const now = Date.now();
    let st = store.srs[id];
    if (!st) st = store.srs[id] = { box: 0, due: now, last: 0, reps: 0, lapses: 0 };
    const seedS = seedStability(st), pBefore = recallNow(st, now);
    STUDY.SRS.schedule(st, grade, now);   // box (mastery proxy) + Leitner due
    st.last = now;
    st.reps++;
    // forgetting-based scheduling overrides the Leitner due
    st.stability = gradeStability(seedS, grade, pBefore);
    st.due = now + Math.round(st.stability * HOUR);

    // honest mastery: passively update P(you really know it) + log misconceptions
    const ix0 = STUDY.itemIndex[id], ref0 = ix0 && ix0.ref;
    if (st.diff == null && ref0) st.diff = STUDY.seedDiff(ref0);    // calibrated cold-start difficulty
    st.kn = bktUpdate(st.kn, grade, guessProb(ref0), meta || {});   // fluency + difficulty aware
    if (meta && typeof meta.chosen === "number") captureMiss(id, grade, ref0, meta.chosen, ix0);

    // "work on" list: Again (0) and Hard (1) both flag; Good/Easy clear it
    if (grade <= 1) { store.wrong[id] = true; if (grade === 0) st.lapses++; }
    else { delete store.wrong[id]; }

    // topic stats
    const indexed = STUDY.itemIndex[id];
    const tid = topicId || (indexed && indexed.topic.id);
    if (tid) {
      const s = store.stats[tid] || (store.stats[tid] = { attempts: 0, correct: 0, seen: 0 });
      s.attempts++;
      if (grade >= 2) s.correct++;
      store.seen[tid] = now;
    }
    // study-data log (local, behavior only, no PII)
    logEvent(id, grade, tid, indexed, meta);
    STUDY.touchStreak();
    STUDY.save();
  };

  function logEvent(id, grade, tid, indexed, meta) {
    if (!Array.isArray(store.log)) store.log = [];
    const m = meta || {};
    const ev = {
      t: Date.now(), it: id, tp: tid || "", s: indexed ? indexed.subject.id : "",
      g: grade, ok: grade >= 2 ? 1 : 0, rt: m.rt || 0, m: m.mode || "", lv: m.level || 0,
    };
    if (typeof m.chosen === "number") ev.ch = m.chosen;   // which distractor (misconception radar)
    store.log.push(ev);                                  // local copy (for your own export)
    if (store.log.length > 6000) store.log.splice(0, store.log.length - 6000);
    // queue an anonymous copy for upload (default on; opt-out in Settings)
    if (store.settings.telemetry !== false) {
      if (!Array.isArray(store.teleQueue)) store.teleQueue = [];
      store.teleQueue.push(ev);
      if (store.teleQueue.length > 10000) store.teleQueue.splice(0, store.teleQueue.length - 10000);
    }
  }

  // lightweight non-graded analytics event (e.g. opening a lesson after a miss).
  // Uses the same anonymous schema as graded events (item/topic/subject + mode),
  // so it needs no backend change. Respects the telemetry opt-out.
  STUDY.logUsage = function (kind, meta) {
    const m = meta || {};
    const ix = m.it ? STUDY.itemIndex[m.it] : null;
    const ev = {
      t: Date.now(), it: m.it || "", tp: m.tp || (ix && ix.topic.id) || "",
      s: m.s || (ix && ix.subject ? ix.subject.id : ""), g: null, ok: null, rt: 0, m: kind || "usage", lv: 0,
    };
    if (!Array.isArray(store.log)) store.log = [];
    store.log.push(ev);
    if (store.log.length > 6000) store.log.splice(0, store.log.length - 6000);
    if (store.settings.telemetry !== false) {
      if (!Array.isArray(store.teleQueue)) store.teleQueue = [];
      store.teleQueue.push(ev);
      if (store.teleQueue.length > 10000) store.teleQueue.splice(0, store.teleQueue.length - 10000);
    }
    STUDY.save();
  };

  STUDY.markSeen = function (topicId) {
    store.seen[topicId] = Date.now();
    const d = store.done[topicId] || (store.done[topicId] = {});
    d.learn = true;
    STUDY.save();
  };

  // which: 'learn' | 'cards' | 'practice'; extra optional (e.g. practice score 0..1)
  STUDY.markDone = function (topicId, which, score) {
    const d = store.done[topicId] || (store.done[topicId] = {});
    d[which] = true;
    if (which === "practice" && typeof score === "number") d.practiceBest = Math.max(d.practiceBest || 0, score);
    STUDY.save();
  };
  STUDY.topicDone = function (topicId) { return store.done[topicId] || {}; };

  /* ---------- progress queries ---------- */
  // mastery of an item: P(you really know it) from the honest-mastery model,
  // discounted by current recall so it fades if you haven't seen it in a while.
  // Falls back to the legacy box proxy for items answered before kn existed.
  function itemMastery(id) {
    const st = store.srs[id];
    if (!st) return 0;
    const kn = (typeof st.kn === "number") ? st.kn : Math.min(1, (st.box || 0) / 4);
    const r = recallNow(st, Date.now());                 // 0..1, decays over time
    return clampN(kn * (0.55 + 0.45 * r), 0, 1);          // known, gently tempered by retention
  }
  STUDY.itemMastery = itemMastery;
  STUDY.itemKnown = function (id) { const st = store.srs[id]; return st && typeof st.kn === "number" ? st.kn : (st ? Math.min(1, (st.box || 0) / 4) : 0); };

  // misconception radar: most common wrong picks for a subject (or all)
  STUDY.topMixups = function (subjectId, limit) {
    const lists = [];
    if (subjectId) { if (store.miss[subjectId]) lists.push(store.miss[subjectId]); }
    else Object.keys(store.miss || {}).forEach(function (k) { lists.push(store.miss[k]); });
    const agg = {};
    lists.forEach(function (arr) {
      arr.forEach(function (m) {
        const key = m.c + " → " + m.a;               // chosen → answer
        const e = agg[key] || (agg[key] = { chosen: m.c, answer: m.a, n: 0, last: 0 });
        e.n++; if (m.t > e.last) e.last = m.t;
      });
    });
    return Object.keys(agg).map(function (k) { return agg[k]; })
      .sort(function (a, b) { return b.n - a.n || b.last - a.last; })
      .slice(0, limit || 5);
  };

  STUDY.topicProgress = function (topicId) {
    const entry = STUDY.topicIndex[topicId];
    if (!entry) return { mastery: 0, seen: false, due: 0, total: 0, studied: 0 };
    const items = (entry.topic.questions || []).concat(entry.topic.cards || []);
    const total = items.length;
    let sum = 0, studied = 0, due = 0;
    const now = Date.now();
    items.forEach(function (it) {
      const st = store.srs[it.id];
      if (st) { studied++; sum += itemMastery(it.id); if (st.due <= now && st.box > 0) due++; }
    });
    return {
      total: total,
      studied: studied,
      mastery: total ? sum / total : 0,
      seen: !!store.seen[topicId],
      due: due,
      lastSeen: store.seen[topicId] || 0,
    };
  };

  STUDY.subjectProgress = function (subjectId) {
    const subj = STUDY.byId[subjectId];
    if (!subj) return { mastery: 0, due: 0, topics: 0, topicsSeen: 0 };
    let mSum = 0, due = 0, topicsSeen = 0, items = 0, studied = 0;
    subj.topics.forEach(function (t) {
      const tp = STUDY.topicProgress(t.id);
      mSum += tp.mastery;
      due += tp.due;
      studied += tp.studied;
      items += tp.total;
      if (tp.seen) topicsSeen++;
    });
    return {
      mastery: subj.topics.length ? mSum / subj.topics.length : 0,
      due: due,
      topics: subj.topics.length,
      topicsSeen: topicsSeen,
      items: items,
      studied: studied,
    };
  };

  STUDY.overallDue = function () {
    const now = Date.now();
    let n = 0;
    for (const id in store.srs) {
      const st = store.srs[id];
      if (st.box > 0 && st.due <= now) n++;
    }
    return n;
  };

  // items due for review across everything (optionally filtered to a subject)
  STUDY.dueItems = function (subjectId) {
    const now = Date.now();
    const out = [];
    for (const id in store.srs) {
      const st = store.srs[id];
      if (st.box > 0 && st.due <= now) {
        const meta = STUDY.itemIndex[id];
        if (!meta) continue;
        if (subjectId && meta.subject.id !== subjectId) continue;
        out.push(meta.ref);                        // questions AND flashcards
      }
    }
    // most overdue first
    out.sort(function (a, b) { return (store.srs[a.id].due) - (store.srs[b.id].due); });
    return out;
  };

  STUDY.wrongItems = function (subjectId) {
    const out = [];
    for (const id in store.wrong) {
      const meta = STUDY.itemIndex[id];
      if (!meta) continue;                          // questions AND flashcards
      if (subjectId && meta.subject.id !== subjectId) continue;
      out.push(meta.ref);
    }
    return out;
  };

  STUDY.weakTopics = function (limit) {
    const arr = [];
    Object.keys(STUDY.topicIndex).forEach(function (tid) {
      const s = store.stats[tid];
      if (s && s.attempts >= 2) {
        const acc = s.correct / s.attempts;
        if (acc < 0.7) arr.push({ topicId: tid, acc: acc, entry: STUDY.topicIndex[tid] });
      }
    });
    arr.sort(function (a, b) { return a.acc - b.acc; });
    return limit ? arr.slice(0, limit) : arr;
  };

  /* ---------- bookmarks / stars ---------- */
  STUDY.toggleStar = function (id) {
    if (store.starred[id]) delete store.starred[id]; else store.starred[id] = Date.now();
    STUDY.save();
    return !!store.starred[id];
  };
  STUDY.isStarred = function (id) { return !!store.starred[id]; };
  STUDY.starred = function () {
    const out = { questions: [], cards: [] };
    Object.keys(store.starred).forEach(function (id) {
      const m = STUDY.itemIndex[id]; if (!m) return;
      if (m.type === "q") out.questions.push(m.ref); else out.cards.push(m.ref);
    });
    return out;
  };

  /* ---------- weak-spot import (from a graded test) ---------- */
  // Flag every item in these topics as "needs review" and reset its schedule
  // so Review + Cram surface them immediately.
  STUDY.markTopicsWeak = function (topicIds) {
    const now = Date.now(); let n = 0; const hit = [];
    (topicIds || []).forEach(function (tid) {
      const e = STUDY.topicIndex[tid]; if (!e) return;
      hit.push(tid);
      (e.topic.questions || []).forEach(function (q) {
        store.wrong[q.id] = true;
        const st = store.srs[q.id] || (store.srs[q.id] = { box: 0, due: now, last: 0, reps: 0, lapses: 0 });
        st.box = 1; st.due = now; n++;
      });
      if (!store.seen[tid]) store.seen[tid] = now;
    });
    STUDY.save();
    return { items: n, topics: hit };
  };

  // Build the prompt a student pastes into Claude (with their test PDF/photo)
  STUDY.aiImportPrompt = function () {
    let lines = [];
    lines.push("You are helping a student find their weak spots from a graded exam.");
    lines.push("I will give you my test (questions + my answers, or a marked PDF/photo).");
    lines.push("Figure out which questions I got WRONG, then map each wrong question to the BEST-matching topic ID from the list below.");
    lines.push("");
    lines.push("TOPIC IDS (use these exact ids only):");
    STUDY.subjects.forEach(function (s) {
      lines.push("# " + s.name);
      s.topics.forEach(function (t) { lines.push("  " + t.id + ", " + t.title); });
    });
    lines.push("");
    lines.push("OUTPUT RULES: reply with ONLY a single code block in exactly this format, one topic id per line, listing the topics I was weakest in (repeat an id once per wrong question so heavier misses appear more):");
    lines.push("```");
    lines.push("RECALL-WEAK");
    lines.push("bio-mendel");
    lines.push("ela-figurative");
    lines.push("END");
    lines.push("```");
    lines.push("Use only ids from the list. No other text.");
    return lines.join("\n");
  };

  // Parse the AI's pasted block -> { topics:[id...], counts:{id:n} }
  STUDY.parseWeakImport = function (text) {
    const ids = Object.keys(STUDY.topicIndex);
    const lower = String(text || "").toLowerCase();
    const counts = {}, order = [];
    ids.forEach(function (id) {
      // whole-token match (so his-wwi doesn't match inside his-wwii)
      let n = 0;
      try { const m = lower.match(new RegExp("(?<![a-z0-9-])" + id + "(?![a-z0-9-])", "g")); n = m ? m.length : 0; }
      catch (e) { const m = lower.match(new RegExp("(^|[^a-z0-9-])" + id + "([^a-z0-9-]|$)", "g")); n = m ? m.length : 0; }
      if (n > 0) { counts[id] = n; order.push(id); }
    });
    return { topics: order, counts: counts };
  };

  /* ---------- difficulty + concept (Easy/Hard practice with full lesson coverage) ---------- */
  function correctText(q) {
    if (q.type === "mc" && q.choices) return q.choices[q.answer] || "";
    if (q.type === "fill") return (q.answers || [])[0] || "";
    return "";
  }
  // level 1 = easy (definition recall), 2 = hard (example / discrimination / application)
  STUDY.levelOf = function (q) {
    if (q.lvl) return q.lvl;
    const s = (q.q || "").toLowerCase();
    if (/which (is|of the following is|sentence|line|statement)\b|identify the (device|type)|example of|which is not|conjugate |solve the|find the|what is the (area|volume|circumference|hypotenuse|surface|measure|sum|third|length|value)/.test(s)) return 2;
    return 1;
  };
  // cold-start difficulty: use the difficulty signals already in the bank (authored
  // Easy/Hard level, generated-recall, answer format) so the engine is calibrated
  // from the FIRST answer instead of treating every item as a coin-flip (1500).
  STUDY.seedDiff = function (q) {
    if (!q) return 1450;
    let d = STUDY.levelOf(q) === 2 ? 1650 : (q.gen ? 1320 : 1430);   // hard application vs easy/recall
    if (q.type === "fill") d += 90;        // no multiple-choice safety net
    else if (q.type === "tf") d -= 70;     // 50/50 floor makes them easier
    if (STUDY.CROWD && q.id) d = STUDY.CROWD.shrunkDiff(q.id, d);    // blend crowd difficulty (shrunk by sample size)
    return d;
  };

  // report a broken / confusing question: suppress it and keep it from dragging
  // your numbers. Logged anonymously (ready for crowd review later).
  STUDY.flagItem = function (id, reason) {
    if (!id) return;
    if (!store.flagged) store.flagged = {};
    store.flagged[id] = { t: Date.now(), reason: reason || "" };
    if (STUDY.logUsage) STUDY.logUsage("report", { it: id });
    STUDY.save();
  };
  STUDY.isFlagged = function (id) { return !!(store.flagged && store.flagged[id]); };
  STUDY.unflag = function (id) { if (store.flagged) delete store.flagged[id]; STUDY.save(); };
  STUDY.flaggedList = function () {
    const out = [];
    Object.keys(store.flagged || {}).forEach(function (id) {
      const ix = STUDY.itemIndex[id]; if (!ix || !ix.ref) return;
      out.push({ id: id, q: ix.ref.q || "", subject: ix.subject ? ix.subject.id : "", topic: ix.topic ? ix.topic.id : "", t: store.flagged[id].t });
    });
    return out.sort((a, b) => b.t - a.t);
  };
  function topicConcepts(topic) {
    const cs = [];
    (topic.lesson || []).forEach(function (b) {
      if (b.term) cs.push(b.term);
      if (b.defs) b.defs.forEach(p => cs.push(p[0]));
    });
    return cs;
  }
  // map a question to one concept token (explicit q.concept wins; else longest lesson keyword found)
  STUDY.conceptToken = function (q, concepts) {
    if (q.concept) return q.concept;
    const hay = ((q.q || "") + " " + correctText(q)).toLowerCase();
    let best = "general", bestLen = 3;
    concepts.forEach(function (name) {
      String(name).toLowerCase().split(/[^a-zà-ÿ]+/).forEach(function (kw) {
        if (kw.length > 3 && kw.length > bestLen && hay.indexOf(kw) >= 0) { best = kw; bestLen = kw.length; }
      });
    });
    return best;
  };
  // build a practice set for a topic at a level, balanced so EVERY concept is
  // covered, then capped to maxTotal (~20) so a session never feels bloated.
  // The big banks stay for the For You feed / final quiz, not topic practice.
  STUDY.practiceSet = function (topicId, level, maxTotal) {
    const entry = STUDY.topicIndex[topicId]; if (!entry) return [];
    const topic = entry.topic, sh = STUDY.SRS.shuffle;
    const concepts = topicConcepts(topic);
    const want = level === "easy" ? 1 : level === "hard" ? 2 : 0;
    const qs = (topic.questions || []).filter(q => q.type !== "match");
    const groups = {};
    qs.forEach(function (q) { const c = STUDY.conceptToken(q, concepts); (groups[c] = groups[c] || []).push(q); });
    const CAP = 6, picked = {};
    Object.keys(groups).forEach(function (c) {
      let g = groups[c];
      if (want === 2) {
        // HARD = genuine application/discrimination only; never fall back to the
        // auto-generated recall items, so Hard actually feels hard.
        let pref = g.filter(q => STUDY.levelOf(q) === 2);
        if (!pref.length) pref = g.filter(q => !q.gen && STUDY.levelOf(q) !== 1);
        g = pref;                                   // may be empty → concept skipped
      } else if (want === 1) {
        const pref = g.filter(q => STUDY.levelOf(q) === 1);
        g = pref.length ? pref : g;                 // fallback keeps coverage
      }
      if (g.length) picked[c] = sh(g).slice(0, CAP);
    });
    // round-robin across concepts → balanced + interleaved
    const keys = sh(Object.keys(picked)), ptr = {}; let total = 0;
    keys.forEach(k => { ptr[k] = 0; total += picked[k].length; });
    const out = [];
    while (out.length < total) { let any = false; keys.forEach(function (k) { if (picked[k] && ptr[k] < picked[k].length) { out.push(picked[k][ptr[k]++]); any = true; } }); if (!any) break; }
    return maxTotal ? out.slice(0, maxTotal) : out;
  };

  // ANTI-MEMORISATION: for an auto-generated question that carries a distractor
  // pool, resample its wrong options in place each time it's served, so you can't
  // memorise "the answer is the one about cousins." Mutates the shared item so
  // the misconception radar (which reads the live choices) stays consistent.
  STUDY.varyGenerated = function (q) {
    if (!q || q.gen !== true || q.type !== "mc" || !Array.isArray(q.pool) || q.pool.length < 3) return;
    const ans = q.choices[q.answer]; if (ans == null) return;
    const sh = STUDY.SRS.shuffle;
    const picks = sh(q.pool.filter(b => b !== ans)).slice(0, 3);
    if (picks.length < 3) return;
    const choices = sh([ans].concat(picks));
    const seen = {}; for (let i = 0; i < choices.length; i++) { const k = String(choices[i]).toLowerCase().trim(); if (seen[k]) return; seen[k] = 1; }
    q.choices = choices; q.answer = choices.indexOf(ans);
  };

  global.STUDY = STUDY;
})(window);
