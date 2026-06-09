/* js/sync.js — opt-in cross-device sync over the existing Supabase project.
   Devices that share a high-entropy CODE read/write one row through two
   SECURITY DEFINER functions (sync_get / sync_put), so the anon key can never
   enumerate other rows. Sync is a MERGE (see STUDY.mergeInto), so phone + laptop
   progress combines instead of one clobbering the other. Auto-runs on connect
   (online), tab focus, boot, a light poll, and a debounce after each change.
   Fully optional: inert until the user turns it on in Settings. */
(function (STUDY) {
  "use strict";
  if (!STUDY) return;
  var RPC = "https://gyfqhkhgosjpyvatffbi.supabase.co/rest/v1/rpc/";
  var KEY = "sb_publishable_q-_2MgYpTJB-OeGGIy8EzA_8mvRB1nb";   // publishable (client-safe)
  var HEADERS = { "Content-Type": "application/json", "apikey": KEY, "Authorization": "Bearer " + KEY, "Accept": "application/json" };

  var SYNC = {};
  STUDY.SYNC = SYNC;
  var inSync = false, metaWrite = false, pushTimer = null, pollTimer = null, listeners = [];

  function st() { return STUDY.store(); }
  function online() { return typeof navigator === "undefined" || navigator.onLine !== false; }
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
  SYNC.pull = function () {
    var code = SYNC.code(); if (!code) return Promise.resolve(null);
    return rpc("sync_get", { p_code: code }).then(function (rows) {
      var row = Array.isArray(rows) ? rows[0] : rows;
      return row && row.data ? { data: row.data, rev: row.rev || 0 } : null;
    });
  };

  function hashStr(s) { var h = 5381; for (var i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0; return h; }

  // pull -> MERGE remote into local -> push merged (rev-guarded, retries on conflict).
  // If nothing changed locally and the server is at the rev we already hold, it's
  // a pull-only (no upload) so a 45s poll doesn't re-send the whole blob.
  function doSync(code, attempt) {
    return SYNC.pull().then(function (remote) {
      var knownRev = 0;
      if (remote && remote.data) { STUDY.applySyncBlob(remote.data); knownRev = remote.rev; }
      var blob = STUDY.syncBlob();
      var h = hashStr(blob);
      var m = st().sync || {};
      if (remote && knownRev === m.rev && h === m.hash) { writeMeta({ last: Date.now(), status: "ok" }); return true; }
      return rpc("sync_put", { p_code: code, p_data: blob, p_rev: knownRev }).then(function (rows) {
        var row = Array.isArray(rows) ? rows[0] : rows;
        if (row && row.conflict && attempt < 3) return doSync(code, attempt + 1);   // someone pushed; re-merge
        writeMeta({ rev: (row && row.rev) || (knownRev + 1), last: Date.now(), status: "ok", hash: h });
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

  // debounced auto-push after any local change (skips meta-only writes & offline)
  SYNC.onLocalChange = function () {
    if (!SYNC.enabled() || inSync || metaWrite || !online()) return;
    if (pushTimer) clearTimeout(pushTimer);
    pushTimer = setTimeout(function () { pushTimer = null; SYNC.syncNow("change"); }, 4000);
  };

  SYNC.enable = function () {                 // first device: create a sync identity
    if (SYNC.enabled()) return SYNC.code();
    writeMeta({ code: genCode(), rev: 0, status: "idle", enabledAt: Date.now() });
    startPoll(); SYNC.syncNow("enable");
    return SYNC.code();
  };
  SYNC.linkWith = function (input) {          // second device: join an existing identity
    var c = SYNC.cleanCode(input);
    if (!c || c.length < 8) return false;
    writeMeta({ code: c, rev: 0, status: "idle" });
    startPoll(); SYNC.syncNow("link");
    return true;
  };
  SYNC.unlink = function () { var s = st(); s.sync = null; metaWrite = true; STUDY.save(); metaWrite = false; stopPoll(); notify(); };

  function startPoll() {
    stopPoll();
    pollTimer = setInterval(function () {
      if (SYNC.enabled() && online() && (typeof document === "undefined" || document.visibilityState === "visible")) SYNC.syncNow("poll");
    }, 45000);
  }
  function stopPoll() { if (pollTimer) clearInterval(pollTimer); pollTimer = null; }

  SYNC.init = function () {
    if (typeof window === "undefined") return;
    window.addEventListener("online", function () { SYNC.syncNow("online"); });
    if (typeof document !== "undefined") document.addEventListener("visibilitychange", function () { if (document.visibilityState === "visible") SYNC.syncNow("visible"); });
    if (SYNC.enabled()) { startPoll(); SYNC.syncNow("boot"); }
  };
})(window.STUDY);
