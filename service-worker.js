const CACHE_NAME = "chess-trainer-6.7.5-favicon-docker-fix";
const APP_ROOT = self.registration.scope;
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll([APP_ROOT,new URL("favicon.svg?v=6.7.5",APP_ROOT).href,new URL("favicon.png?v=6.7.5",APP_ROOT).href,new URL("favicon.ico?v=6.7.5",APP_ROOT).href,new URL("vendor/qrcode.min.js",APP_ROOT).href,new URL("vendor/jsQR.js",APP_ROOT).href])).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("chess-trainer-") && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
 const request=event.request;if(request.method!=="GET"||new URL(request.url).origin!==self.location.origin)return;
 event.respondWith(fetch(request).then(response=>{if(response.ok){const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy))}return response}).catch(async()=>{const cached=await caches.match(request);if(cached)return cached;if(request.mode==="navigate")return caches.match(APP_ROOT);return Response.error()}));
});
