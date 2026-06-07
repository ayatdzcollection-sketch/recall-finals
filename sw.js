/* Recall service worker — makes the hosted site work fully offline after the
   first visit. Cache-first for app assets; network falls back to cache. Bump
   CACHE on each deploy to push updates. */
const CACHE = "recall-v3";
const ASSETS = [
  "./", "index.html", "css/styles.css",
  "js/storage.js", "js/srs.js",
  "data/ela-pool.js", "data/ela.js", "data/biology.js", "data/french.js",
  "data/geometry.js", "data/history.js", "data/extra.js",
  "js/quizgen.js", "js/quiz.js", "js/test.js", "js/app.js",
  "manifest.webmanifest",
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS).catch(() => {})));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  e.respondWith(
    caches.match(req).then((hit) => {
      if (hit) return hit;
      return fetch(req).then((res) => {
        // cache successful same-origin GETs for next time
        if (res && res.ok && req.url.startsWith(self.location.origin)) {
          const copy = res.clone();
          caches.open(CACHE).then((c) => c.put(req, copy));
        }
        return res;
      }).catch(() => {
        // offline navigation → serve the app shell
        if (req.mode === "navigate") return caches.match("index.html");
      });
    })
  );
});
