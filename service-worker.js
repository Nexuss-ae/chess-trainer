const CACHE_NAME = "chess-trainer-5.9.0-theory-visual";
const APP_ROOT = self.registration.scope;
self.addEventListener("install", event => event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll([APP_ROOT])).then(() => self.skipWaiting())));
self.addEventListener("activate", event => event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith("chess-trainer-") && key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())));
self.addEventListener("fetch", event => {
 const request=event.request;if(request.method!=="GET"||new URL(request.url).origin!==self.location.origin)return;
 if(request.mode==="navigate")event.respondWith(fetch(request).then(response=>{if(!response.ok)return response;const copy=response.clone();caches.open(CACHE_NAME).then(cache=>cache.put(request,copy));return response}).catch(async()=>{const cached=await caches.match(request);return cached||caches.match(APP_ROOT)||Response.error()}));
});
