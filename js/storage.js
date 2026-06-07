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
      subjectSkill: {},// subjectId -> Elo skill rating (adaptive engine)
      examDates: {},  // subjectId -> 'yyyy-mm-dd'
      log: [],        // study-data event log (local, for your own export)
      tele: {},       // anonymous telemetry state (anon id, last ping day)
      teleQueue: [],  // outbound anonymous events awaiting upload
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
        ["srs", "stats", "wrong", "seen", "done", "starred", "activity", "masteryHist", "subjectSkill", "examDates"].forEach(function (k) {
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
      legend: { t: "timestamp(ms)", it: "itemId", tp: "topicId", s: "subjectId", g: "grade 0=again 1=hard 2=good 3=easy", ok: "correct(1/0)", rt: "responseTime(ms)", m: "mode", lv: "level 1=easy 2=hard" },
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
  STUDY.importData = function (json) {
    try { store = Object.assign(DEFAULT(), JSON.parse(json)); STUDY.save(); return true; }
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
    store.log.push(ev);                                  // local copy (for your own export)
    if (store.log.length > 6000) store.log.splice(0, store.log.length - 6000);
    // queue an anonymous copy for upload (default on; opt-out in Settings)
    if (store.settings.telemetry !== false) {
      if (!Array.isArray(store.teleQueue)) store.teleQueue = [];
      store.teleQueue.push(ev);
      if (store.teleQueue.length > 10000) store.teleQueue.splice(0, store.teleQueue.length - 10000);
    }
  }

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
  // mastery of an item: based on box (0..5). returns 0..1
  function itemMastery(id) {
    const st = store.srs[id];
    if (!st) return 0;
    return Math.min(1, st.box / 4);   // box 4+ = mastered
  }
  STUDY.itemMastery = itemMastery;

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
  // build a practice set for a topic at a level, balanced so EVERY concept is covered
  STUDY.practiceSet = function (topicId, level) {
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
      if (want) { const pref = g.filter(q => STUDY.levelOf(q) === want); g = pref.length ? pref : g; }  // fallback keeps coverage
      picked[c] = sh(g).slice(0, CAP);
    });
    // round-robin across concepts → balanced + interleaved
    const keys = sh(Object.keys(picked)), ptr = {}; let total = 0;
    keys.forEach(k => { ptr[k] = 0; total += picked[k].length; });
    const out = [];
    while (out.length < total) { let any = false; keys.forEach(function (k) { if (ptr[k] < picked[k].length) { out.push(picked[k][ptr[k]++]); any = true; } }); if (!any) break; }
    return out;
  };

  global.STUDY = STUDY;
})(window);
