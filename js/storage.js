/* ============================================================
   storage.js — global namespace, content registry, persistence
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

  // append generated questions to a topic at runtime (after registration)
  STUDY.addQuestions = function (topic, qs) {
    const start = topic.questions.length;
    qs.forEach(function (q, k) {
      const qi = start + k;
      q.id = topic.id + "#q" + qi;
      q.topicId = topic.id;
      q.subjectId = topic.subjectId;
      q.gen = true;
      topic.questions.push(q);
      STUDY.itemIndex[q.id] = { type: "q", subject: STUDY.byId[topic.subjectId], topic: topic, ref: q };
    });
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
      streak: { count: 0, last: 0, best: 0 },
      activity: {},   // 'yyyy-mm-dd' -> count
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
        ["srs", "stats", "wrong", "seen", "activity"].forEach(function (k) {
          if (!store[k]) store[k] = {};
        });
        if (!store.streak) store.streak = { count: 0, last: 0, best: 0 };
        if (!store.settings) store.settings = { theme: "dark" };
      }
    } catch (e) { store = DEFAULT(); }
    return store;
  };

  let saveTimer = null;
  STUDY.save = function () {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
    }, 120);
  };

  // immediate write (called when the tab is hidden/closed, esp. on mobile)
  STUDY.flush = function () {
    clearTimeout(saveTimer);
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
  };

  STUDY.store = function () { return store; };

  STUDY.reset = function () {
    store = DEFAULT();
    try { localStorage.removeItem(KEY); } catch (e) {}
    STUDY.save();
  };

  STUDY.exportData = function () { return JSON.stringify(store); };
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
    STUDY.save();
  };

  /* ---------- SRS state access ---------- */
  STUDY.itemState = function (id) {
    return store.srs[id] || null;
  };

  // record an attempt on an item (question or card)
  // grade: 0=again/wrong, 1=hard, 2=good/correct, 3=easy
  STUDY.recordItem = function (id, grade, topicId) {
    const now = Date.now();
    let st = store.srs[id];
    if (!st) st = store.srs[id] = { box: 0, due: now, last: 0, reps: 0, lapses: 0 };
    STUDY.SRS.schedule(st, grade, now);   // mutates st (box, due)
    st.last = now;
    st.reps++;

    // wrong list
    if (grade === 0) { store.wrong[id] = true; st.lapses++; }
    else if (grade >= 2) { delete store.wrong[id]; }

    // topic stats
    const meta = STUDY.itemIndex[id];
    const tid = topicId || (meta && meta.topic.id);
    if (tid) {
      const s = store.stats[tid] || (store.stats[tid] = { attempts: 0, correct: 0, seen: 0 });
      s.attempts++;
      if (grade >= 2) s.correct++;
      store.seen[tid] = now;
    }
    STUDY.touchStreak();
    STUDY.save();
  };

  STUDY.markSeen = function (topicId) {
    store.seen[topicId] = Date.now();
    STUDY.save();
  };

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
        if (meta.type === "q") out.push(meta.ref);
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
      if (!meta || meta.type !== "q") continue;
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

  global.STUDY = STUDY;
})(window);
