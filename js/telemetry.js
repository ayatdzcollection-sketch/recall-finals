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
})(window.STUDY);
