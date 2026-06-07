/* ============================================================
   telemetry.js, anonymous, opt-out usage & learning data.
   • No name/email/account, no third-party trackers, no fingerprinting.
   • Sends only the same study events you can export yourself, plus a daily
     heartbeat and a session-open ping (for active-user counts).
   • Fully offline-safe: events queue locally and upload when online.
   • INERT until ENDPOINT + KEY are set below (a Supabase REST URL + anon key).
     Until then nothing leaves the device; events just buffer.
   Opt out anytime in Settings → Privacy & data.
   ============================================================ */
(function (STUDY) {
  "use strict";
  // ---- backend config (Supabase REST, insert-only) ----
  const ENDPOINT = "https://gyfqhkhgosjpyvatffbi.supabase.co/rest/v1/events";
  const KEY = "sb_publishable_q-_2MgYpTJB-OeGGIy8EzA_8mvRB1nb";   // publishable (client-safe) key
  const APP_VERSION = "1.0";
  const BATCH = 200;

  function uid() {
    return (Date.now().toString(36) + Math.random().toString(36).slice(2, 10) + Math.random().toString(36).slice(2, 6));
  }
  function enabled() { return STUDY.store().settings.telemetry !== false; }
  function configured() { return !!(ENDPOINT && KEY); }

  let SESSION = null, started = false;

  function queueUsage(kind) {
    if (!enabled()) return;
    const st = STUDY.store();
    if (!Array.isArray(st.teleQueue)) st.teleQueue = [];
    st.teleQueue.push({ t: Date.now(), it: "", tp: "", s: "", g: null, ok: null, rt: 0, m: kind, lv: 0 });
  }

  let flushing = false;
  function flush(final) {
    if (!enabled() || !configured()) return;
    const st = STUDY.store();
    const q = st.teleQueue || [];
    if (!q.length || (flushing && !final)) return;
    flushing = true;
    const slice = q.slice(0, BATCH);
    const rows = slice.map(e => ({
      anon: st.tele.anonId, sess: SESSION, app: "recall", v: APP_VERSION,
      t: e.t, item: e.it || null, topic: e.tp || null, subject: e.s || null,
      grade: e.g, correct: e.ok, rt: e.rt || null, mode: e.m || null, level: e.lv || null,
      chosen: (typeof e.ch === "number" ? e.ch : null),   // which distractor was picked (wrong MC)
    }));
    const body = JSON.stringify(rows);
    const headers = { "Content-Type": "application/json", "apikey": KEY, "Authorization": "Bearer " + KEY, "Prefer": "return=minimal" };
    fetch(ENDPOINT, { method: "POST", headers: headers, body: body, keepalive: !!final })
      .then(function (r) { if (r && r.ok) { st.teleQueue = q.slice(slice.length); STUDY.save(); } })
      .catch(function () {})
      .finally(function () { flushing = false; });
  }

  // called by app.js boot() AFTER STUDY.load()
  function start() {
    if (started) return; started = true;
    const st = STUDY.store();
    if (!st.tele) st.tele = {};
    if (!st.tele.anonId) { st.tele.anonId = uid(); st.tele.firstSeen = Date.now(); STUDY.save(); }
    SESSION = uid();
    // daily heartbeat (one per local day) for active-user counts
    const day = STUDY.dayKey(Date.now());
    if (st.tele.lastPing !== day) { st.tele.lastPing = day; queueUsage("heartbeat"); STUDY.save(); }
    queueUsage("open");
    flush(false);
    setInterval(function () { flush(false); }, 45000);
    window.addEventListener("online", function () { flush(false); });
    window.addEventListener("pagehide", function () { flush(true); });
    document.addEventListener("visibilitychange", function () { if (document.visibilityState === "hidden") flush(true); });
  }

  STUDY.TELE = {
    start: start, flush: flush, enabled: enabled, configured: configured,
    pending: function () { return (STUDY.store().teleQueue || []).length; },
    anonId: function () { return (STUDY.store().tele || {}).anonId || ""; },
    setEnabled: function (on) { STUDY.store().settings.telemetry = !!on; if (!on) STUDY.store().teleQueue = []; STUDY.save(); },
  };

  /* ============================================================
     CROWD CALIBRATION (read-only aggregates).
     Reads a per-item AGGREGATE view (item_stats: attempts, correct, avg_rt,
     learners), never raw rows or anon IDs, so privacy holds. Every use is
     SHRUNK by sample size, so with little data (just you + a little) it changes
     almost nothing, then strengthens automatically as more people play.
     Degrades to a no-op if the view doesn't exist yet (fetch just returns empty).
     ============================================================ */
  const STATS_URL = ENDPOINT.replace(/\/events$/, "/item_stats");
  const CROWD_KEY = "recall_crowd_v1";
  const REF = 1500, K_SHRINK = 18, SUSPECT_N = 8, SUSPECT_RATE = 0.4;
  const cclamp = (v, lo, hi) => v < lo ? lo : v > hi ? hi : v;
  let CROWD = { items: {}, fetched: 0 };

  function loadCrowd() { try { const r = localStorage.getItem(CROWD_KEY); if (r) CROWD = JSON.parse(r) || CROWD; } catch (e) { } }
  function saveCrowd() { try { localStorage.setItem(CROWD_KEY, JSON.stringify(CROWD)); } catch (e) { } }
  function fetchCrowd() {
    if (!configured() || typeof fetch !== "function") return;
    fetch(STATS_URL + "?select=item,attempts,correct,avg_rt,learners", { headers: { apikey: KEY, "Authorization": "Bearer " + KEY } })
      .then(function (r) { return r && r.ok ? r.json() : null; })
      .then(function (rows) {
        if (!Array.isArray(rows)) return;                 // view missing / blocked → stay no-op
        const items = {};
        rows.forEach(function (r) { if (r.item) items[r.item] = { n: r.attempts | 0, c: r.correct | 0, rt: r.avg_rt || 0, u: r.learners | 0 }; });
        CROWD = { items: items, fetched: Date.now() };
        saveCrowd();
      })
      .catch(function () { });
  }

  STUDY.CROWD = {
    start: function () { loadCrowd(); if (!CROWD.fetched || Date.now() - CROWD.fetched > 6 * 3600 * 1000) fetchCrowd(); },
    refresh: fetchCrowd,
    has: function () { return Object.keys(CROWD.items).length > 0; },
    // raw per-item stat (or null). rate = crowd success rate; learners = distinct people
    stat: function (id) { const s = CROWD.items[id]; if (!s || !s.n) return null; return { n: s.n, rate: s.c / s.n, rt: s.rt, learners: s.u }; },
    // crowd difficulty (Elo-ish) from success rate
    diff: function (id) { const s = this.stat(id); if (!s) return null; const r = cclamp(s.rate, 0.03, 0.97); return REF - 400 * Math.log(r / (1 - r)) / Math.LN10; },
    // blend crowd difficulty into a local estimate, weighted by sample size:
    // w = n/(n+18) → ~0 when sparse (safe), → 1 as the crowd grows.
    shrunkDiff: function (id, localDiff) {
      const s = this.stat(id); if (!s) return localDiff;
      const cd = this.diff(id); if (cd == null) return localDiff;
      const w = s.n / (s.n + K_SHRINK);
      return Math.round(w * cd + (1 - w) * localDiff);
    },
    // suspected mis-keyed / ambiguous: enough attempts yet most people miss it
    suspect: function (id) { const s = this.stat(id); return !!(s && s.n >= SUSPECT_N && s.rate < SUSPECT_RATE); },
    suspectList: function () {
      const out = [];
      Object.keys(CROWD.items).forEach(function (id) {
        if (STUDY.CROWD.suspect(id)) { const ix = STUDY.itemIndex[id]; if (ix && ix.ref) out.push({ id: id, q: ix.ref.q || "", rate: CROWD.items[id].c / CROWD.items[id].n, n: CROWD.items[id].n }); }
      });
      return out.sort(function (a, b) { return a.rate - b.rate; });
    },
  };
})(window.STUDY);
