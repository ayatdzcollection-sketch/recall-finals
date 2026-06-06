/* ============================================================
   srs.js — spaced repetition + interleaving
   Leitner-style boxes, tuned for a multi-day final-exam window.
   Grades: 0 = Again/wrong, 1 = Hard, 2 = Good/correct, 3 = Easy
   ============================================================ */
(function (STUDY) {
  "use strict";
  const MIN = 60000, HOUR = 3600000, DAY = 86400000;

  // interval per box (resurfaces material across study sessions within the cram window)
  const BOX_INTERVAL = [10 * MIN, 4 * HOUR, 9 * HOUR, 1 * DAY, 3 * DAY, 7 * DAY];

  const SRS = {
    // mutate state {box,due} given a grade
    schedule: function (st, grade, now) {
      now = now || Date.now();
      if (grade <= 0) {
        st.box = 1;                 // back to start (but learned, so box 1 not 0)
        st.due = now + 10 * MIN;    // re-surface very soon
      } else if (grade === 1) {
        st.box = Math.max(1, st.box);           // hard: hold position
        st.due = now + BOX_INTERVAL[st.box];
      } else if (grade === 2) {
        st.box = Math.min(5, (st.box || 0) + 1); // good: advance one box
        st.due = now + jitter(BOX_INTERVAL[st.box]);
      } else {
        st.box = Math.min(5, (st.box || 0) + 2); // easy: jump ahead
        st.due = now + jitter(BOX_INTERVAL[st.box]);
      }
      return st;
    },
    BOX_INTERVAL: BOX_INTERVAL,
  };

  function jitter(ms) { return Math.round(ms * (0.9 + Math.random() * 0.2)); }

  /* ---------- queue builders ---------- */

  // Fisher-Yates
  function shuffle(a) {
    a = a.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  SRS.shuffle = shuffle;

  // Interleave items so consecutive items avoid the same topic when possible.
  // Items must have .topicId
  SRS.interleave = function (items) {
    const buckets = {};
    items.forEach(function (it) {
      (buckets[it.topicId] = buckets[it.topicId] || []).push(it);
    });
    Object.keys(buckets).forEach(function (k) { buckets[k] = shuffle(buckets[k]); });
    const keys = Object.keys(buckets);
    const out = [];
    let lastTopic = null, guard = items.length * 4;
    while (out.length < items.length && guard-- > 0) {
      // choose the non-empty bucket with the most remaining, not equal to lastTopic
      let best = null;
      keys.forEach(function (k) {
        if (!buckets[k].length) return;
        if (k === lastTopic && nonEmptyCount(buckets, keys) > 1) return;
        if (!best || buckets[k].length > buckets[best].length) best = k;
      });
      if (best == null) { // only lastTopic remains
        best = keys.find(function (k) { return buckets[k].length; });
      }
      out.push(buckets[best].shift());
      lastTopic = best;
    }
    return out;
  };
  function nonEmptyCount(b, keys) { let n = 0; keys.forEach(function (k) { if (b[k].length) n++; }); return n; }

  // Build a "smart" interleaved study session:
  //  - prioritise due review items + wrong items, then fill with fresh/least-seen.
  SRS.buildSession = function (opts) {
    opts = opts || {};
    const size = opts.size || 15;
    const subjectId = opts.subjectId || null;
    const now = Date.now();

    const pool = STUDY.allQuestions(function (q, t, s) {
      return subjectId ? s.id === subjectId : true;
    });

    const due = [], wrong = [], fresh = [], rest = [];
    pool.forEach(function (q) {
      const st = STUDY.itemState(q.id);
      if (STUDY.store().wrong[q.id]) wrong.push(q);
      else if (st && st.box > 0 && st.due <= now) due.push(q);
      else if (!st) fresh.push(q);
      else rest.push(q);
    });

    // order: most-overdue review, then wrong, then fresh, then everything else
    due.sort(function (a, b) { return STUDY.itemState(a.id).due - STUDY.itemState(b.id).due; });
    const ordered = []
      .concat(due)
      .concat(shuffle(wrong))
      .concat(shuffle(fresh))
      .concat(shuffle(rest));

    // de-dupe while keeping order, cap to size
    const seen = {}, picked = [];
    for (let i = 0; i < ordered.length && picked.length < size; i++) {
      if (!seen[ordered[i].id]) { seen[ordered[i].id] = 1; picked.push(ordered[i]); }
    }
    return SRS.interleave(picked);
  };

  STUDY.SRS = SRS;
})(window.STUDY);
