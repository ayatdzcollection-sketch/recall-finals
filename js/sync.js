/* js/sync.js — opt-in cross-device sync over the existing Supabase project.
   Devices that share a high-entropy CODE read/write one row through SECURITY
   DEFINER functions (sync_get / sync_put / sync_rev), so the anon key can never
   enumerate other rows. Sync is a MERGE (STUDY.mergeInto), so phone + laptop
   progress combines instead of one clobbering the other.

   INSTANT sync: every change pushes within ~0.6s, and the other device is woken
   the moment we push via a Supabase Realtime broadcast (WebSocket). A cheap
   rev-check poll (~2.5s while active) is the always-on fallback if realtime
   can't connect. Inert until the user turns it on in Settings. */
(function (STUDY) {
  "use strict";
  if (!STUDY) return;
  var HOST = "https://gyfqhkhgosjpyvatffbi.supabase.co";
  var RPC = HOST + "/rest/v1/rpc/";
  var KEY = "sb_publishable_q-_2MgYpTJB-OeGGIy8EzA_8mvRB1nb";   // publishable (client-safe)
  var HEADERS = { "Content-Type": "application/json", "apikey": KEY, "Authorization": "Bearer " + KEY, "Accept": "application/json" };
  var PUSH_DEBOUNCE = 600, POLL_FAST = 2500, POLL_IDLE = 15000, ACTIVE_WINDOW = 120000;

  var SYNC = {};
  STUDY.SYNC = SYNC;
  var inSync = false, metaWrite = false, pushTimer = null, pollTimer = null, lastActivity = 0, listeners = [];

  function st() { return STUDY.store(); }
  function online() { return typeof navigator === "undefined" || navigator.onLine !== false; }
  function visible() { return typeof document === "undefined" || document.visibilityState === "visible"; }
  function markActivity() { lastActivity = Date.now(); }
  SYNC.enabled = function () { var s = st().sync; return !!(s && s.code); };
  SYNC.code = function () { var s = st().sync; return (s && s.code) || ""; };
  SYNC.status = function () { var s = st().sync; return (s && s.status) || (SYNC.enabled() ? "idle" : "off"); };
  SYNC.lastSync = function () { var s = st().sync; return (s && s.last) || 0; };

  function writeMeta(patch) {
    var s = st();
    s.sync = Object.assign({ code: "", rev: 0, last: 0, status: "idle" }, s.sync || {}, patch);
    metaWrite = true; STUDY.save(); metaWrite = false;
  }
  function notify() { listeners.forEach(function (fn) { try { fn(SYNC.status()); } catch (e) {} }); }
  SYNC.onChange = function (fn) { if (typeof fn === "function") listeners.push(fn); };

  // ---- code: 16 base32 chars (~80 bits) so it doubles as an unguessable secret
  function genCode() {
    var alpha = "0123456789abcdefghjkmnpqrstvwxyz", out = "", n = 16, buf = null;
    try { buf = new Uint8Array(n); (self.crypto || window.crypto).getRandomValues(buf); } catch (e) { buf = null; }
    for (var i = 0; i < n; i++) { var v = buf ? buf[i] : Math.floor(Math.random() * 256); out += alpha.charAt(v & 31); }
    return out;
  }
  SYNC.formatCode = function (c) { c = (c || "").replace(/[^0-9a-z]/gi, "").toLowerCase(); return c.replace(/(.{4})(?=.)/g, "$1-"); };
  SYNC.cleanCode = function (c) {
    c = String(c || "").trim();
    var m = c.match(/#\/?link\/([0-9a-z]+)/i); if (m) return m[1].toLowerCase();   // accept a pairing link
    return c.replace(/[^0-9a-z]/gi, "").toLowerCase();
  };
  SYNC.linkURL = function () { var c = SYNC.code(); if (!c) return ""; return location.origin + location.pathname + "#/link/" + c; };

  function rpc(fn, body) {
    return fetch(RPC + fn, { method: "POST", headers: HEADERS, body: JSON.stringify(body) })
      .then(function (r) { if (!r.ok) throw new Error("rpc " + fn + " " + r.status); return r.json(); });
  }
  function revOf(rows) { var row = Array.isArray(rows) ? rows[0] : rows; if (row == null) return 0; return +(typeof row === "object" ? (row.rev != null ? row.rev : row.sync_rev) : row) || 0; }

  SYNC.pull = function () {
    var code = SYNC.code(); if (!code) return Promise.resolve(null);
    return rpc("sync_get", { p_code: code }).then(function (rows) {
      var row = Array.isArray(rows) ? rows[0] : rows;
      return row && row.data ? { data: row.data, rev: row.rev || 0 } : null;
    });
  };

  // pull -> MERGE remote into local -> push merged (only if the server doesn't
  // already hold our exact state). rev-guarded with conflict retry.
  function doSync(code, attempt) {
    return SYNC.pull().then(function (remote) {
      var knownRev = 0;
      if (remote && remote.data) { STUDY.applySyncBlob(remote.data); knownRev = remote.rev; }
      var blob = STUDY.syncBlob();
      if (remote && remote.data === blob) { writeMeta({ rev: knownRev, last: Date.now(), status: "ok" }); return true; }
      return rpc("sync_put", { p_code: code, p_data: blob, p_rev: knownRev }).then(function (rows) {
        var row = Array.isArray(rows) ? rows[0] : rows;
        if (row && row.conflict && attempt < 4) return doSync(code, attempt + 1);   // someone pushed; re-merge
        var newRev = (row && row.rev) || (knownRev + 1);
        writeMeta({ rev: newRev, last: Date.now(), status: "ok" });
        rtBroadcast(newRev);                                  // wake the other device instantly
        return true;
      });
    });
  }
  SYNC.syncNow = function (reason) {
    var code = SYNC.code();
    if (!code) return Promise.resolve(false);
    if (!online()) { writeMeta({ status: "offline" }); notify(); return Promise.resolve(false); }
    if (inSync) return Promise.resolve(false);
    inSync = true; writeMeta({ status: "syncing" }); notify();
    return doSync(code, 0).then(function (ok) { inSync = false; notify(); return ok; })
      .catch(function () { inSync = false; writeMeta({ status: "error" }); notify(); return false; });
  };

  // debounced auto-push the instant local data changes
  SYNC.onLocalChange = function () {
    if (!SYNC.enabled() || inSync || metaWrite || !online()) return;
    markActivity();
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { pushTimer = null; SYNC.syncNow("change"); }, PUSH_DEBOUNCE);
    if (!pollTimer) scheduleNextPoll();
  };

  // ---- cheap fallback poll: ask only for the rev; full sync only when it moved
  function pollTick() {
    pollTimer = null;
    if (!SYNC.enabled()) return;
    if (online() && visible()) {
      rpc("sync_rev", { p_code: SYNC.code() }).then(function (rows) {
        var rev = revOf(rows), m = st().sync || {};
        if (rev !== (m.rev || 0)) { markActivity(); SYNC.syncNow("poll"); }
      }).catch(function () {}).then(scheduleNextPoll);
    } else { scheduleNextPoll(); }
  }
  function scheduleNextPoll() {
    if (pollTimer) clearTimeout(pollTimer);
    if (!SYNC.enabled()) return;
    var iv = (Date.now() - lastActivity < ACTIVE_WINDOW) ? POLL_FAST : POLL_IDLE;
    pollTimer = setTimeout(pollTick, iv);
  }

  // ---- best-effort realtime: a tiny Supabase Realtime (Phoenix) broadcast client.
  // Wakes the other device the instant we push; if it can't connect, the poll covers it.
  var ws = null, wsRef = 0, hbTimer = null, reconnectTimer = null, joined = false;
  function wsUrl() { return HOST.replace(/^http/, "ws") + "/realtime/v1/websocket?apikey=" + encodeURIComponent(KEY) + "&vsn=1.0.0"; }
  function chan() { return "realtime:recall-" + SYNC.code(); }
  function wsSend(o) { try { if (ws && ws.readyState === 1) ws.send(JSON.stringify(o)); } catch (e) {} }
  function rtConnect() {
    if (typeof WebSocket === "undefined" || !SYNC.enabled() || !online()) return;
    if (ws && (ws.readyState === 0 || ws.readyState === 1)) return;
    try { ws = new WebSocket(wsUrl()); } catch (e) { ws = null; return; }
    joined = false;
    ws.onopen = function () {
      wsSend({ topic: chan(), event: "phx_join", payload: { config: { broadcast: { self: false, ack: false }, presence: { key: "" } } }, ref: String(++wsRef) });
      if (hbTimer) clearInterval(hbTimer);
      hbTimer = setInterval(function () { wsSend({ topic: "phoenix", event: "heartbeat", payload: {}, ref: String(++wsRef) }); }, 25000);
    };
    ws.onmessage = function (ev) {
      var m; try { m = JSON.parse(ev.data); } catch (e) { return; }
      if (m.event === "phx_reply" && m.payload && m.payload.status === "ok") { joined = true; return; }
      if (m.event === "broadcast" && m.payload && m.payload.event === "sync") { markActivity(); SYNC.syncNow("realtime"); }
    };
    ws.onclose = function () { joined = false; if (hbTimer) { clearInterval(hbTimer); hbTimer = null; } scheduleReconnect(); };
    ws.onerror = function () { try { ws.close(); } catch (e) {} };
  }
  function scheduleReconnect() { if (reconnectTimer) clearTimeout(reconnectTimer); if (!SYNC.enabled()) return; reconnectTimer = setTimeout(rtConnect, 5000); }
  function rtBroadcast(rev) { if (joined) wsSend({ topic: chan(), event: "broadcast", payload: { type: "broadcast", event: "sync", payload: { r: rev } }, ref: String(++wsRef) }); }
  function rtDisconnect() {
    if (hbTimer) { clearInterval(hbTimer); hbTimer = null; }
    if (reconnectTimer) { clearTimeout(reconnectTimer); reconnectTimer = null; }
    try { if (ws) { ws.onclose = null; ws.close(); } } catch (e) {}
    ws = null; joined = false;
  }
  function start() { markActivity(); scheduleNextPoll(); rtConnect(); }

  SYNC.enable = function () {                 // first device: create a sync identity
    if (SYNC.enabled()) return SYNC.code();
    writeMeta({ code: genCode(), rev: 0, status: "idle", enabledAt: Date.now() });
    start(); SYNC.syncNow("enable");
    return SYNC.code();
  };
  SYNC.linkWith = function (input) {          // second device: join an existing identity
    var c = SYNC.cleanCode(input);
    if (!c || c.length < 8) return false;
    rtDisconnect();
    writeMeta({ code: c, rev: 0, status: "idle" });
    start(); SYNC.syncNow("link");
    return true;
  };
  SYNC.unlink = function () { rtDisconnect(); if (pollTimer) { clearTimeout(pollTimer); pollTimer = null; } var s = st(); s.sync = null; metaWrite = true; STUDY.save(); metaWrite = false; notify(); };

  SYNC.init = function () {
    if (typeof window === "undefined") return;
    window.addEventListener("online", function () { rtConnect(); markActivity(); SYNC.syncNow("online"); });
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", function () { if (visible()) { markActivity(); rtConnect(); SYNC.syncNow("visible"); } });
    if (SYNC.enabled()) start();
    if (SYNC.enabled()) SYNC.syncNow("boot");
  };
})(window.STUDY);
