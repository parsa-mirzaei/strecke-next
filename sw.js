// Generated at build time. Precache the app shell; serve it cache-first; works offline.
const CACHE = 'strecke-next-a2baab5828';
const PRECACHE = ["./","index.html","manifest.webmanifest","icon-192.png","icon-512.png","icon-512-maskable.png","./assets/index-BZ4GFboI.js","./assets/barlow-latin-400-normal-qiz4-Cze.woff2","./assets/barlow-latin-500-normal-BPAOfeC8.woff2","./assets/barlow-latin-600-normal-DILqtrty.woff2","./assets/barlow-semi-condensed-latin-500-normal-G0uxJNrM.woff2","./assets/barlow-semi-condensed-latin-600-normal-BkLiAYu4.woff2","./assets/barlow-semi-condensed-latin-700-normal-BpqDG8I9.woff2","./assets/index-Df1kjO5z.css"];

self.addEventListener('install', (e) => {
  // No skipWaiting here: an update waits until the page asks (a tap, or app start), never mid-run.
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(PRECACHE)));
});

self.addEventListener('message', (e) => {
  if (e.data === 'skipWaiting') self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  // Removes this build's older shell caches only: never the audio cache, never another build's caches on the same origin.
  const OLD = /^strecke-next-[0-9a-f]{10}$/;
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && OLD.test(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  if (req.mode === 'navigate') {
    e.respondWith(caches.match('index.html').then((hit) => hit || fetch(req)));
    return;
  }
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req)));
});

// Self-heal: another app's older service worker on this origin may delete this cache. The page asks
// after every start; a missing or incomplete shell is fetched again while online.
self.addEventListener('message', (e) => {
  if (e.data !== 'heal') return;
  e.waitUntil(caches.open(CACHE).then(async (c) => {
    const have = new Set((await c.keys()).map((r) => new URL(r.url).pathname));
    const missing = PRECACHE.filter((p) => !have.has(new URL(p, self.registration.scope).pathname));
    if (missing.length) await c.addAll(missing);
  }).catch(() => {}));
});
