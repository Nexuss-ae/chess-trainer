const CACHE_NAME = "chess-trainer-6.9.5-offline-fast-load";
const APP_ROOT = self.registration.scope;
const APP_INDEX = new URL("index.html", APP_ROOT).href;
const CORE = [
  APP_ROOT,
  APP_INDEX,
  new URL("favicon.svg?v=6.9.5", APP_ROOT).href,
  new URL("favicon.png?v=6.9.5", APP_ROOT).href,
  new URL("favicon.ico", APP_ROOT).href,
  new URL("vendor/qrcode.min.js", APP_ROOT).href,
  new URL("vendor/jsQR.js", APP_ROOT).href
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CORE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys
        .filter(key => key.startsWith("chess-trainer-") && key !== CACHE_NAME)
        .map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(request) || await cache.match(APP_ROOT) || await cache.match(APP_INDEX);
      const refresh = fetch(request).then(async response => {
        if (response.ok) {
          await Promise.all([
            cache.put(APP_ROOT, response.clone()),
            cache.put(APP_INDEX, response.clone())
          ]);
        }
        return response;
      });

      // Show the saved app immediately; update it in the background when online.
      if (cached) {
        event.waitUntil(refresh.then(() => undefined).catch(() => undefined));
        return cached;
      }

      // On the first visit there may be no saved copy yet. Avoid a long offline wait.
      let timeout;
      try {
        return await Promise.race([
          refresh,
          new Promise((_, reject) => { timeout = setTimeout(() => reject(new Error("network timeout")), 4500); })
        ]);
      } catch {
        return await cache.match(APP_ROOT) || await cache.match(APP_INDEX) || Response.error();
      } finally {
        clearTimeout(timeout);
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const response = await fetch(request);
      if (response.ok) await cache.put(request, response.clone());
      return response;
    } catch {
      return Response.error();
    }
  })());
});
