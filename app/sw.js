/* Fixed local assets only. Bump VERSION after changing any app asset. */
const VERSION = "afyanote-v0.5.2";
const CACHE = VERSION + ":" + self.registration.scope;
const FILES = ["./", "index.html", "app.js", "classify.js", "rules.js", "i18n.js", "model.json",
  "facilities.json", "dictionary.json", "vendor/qrcode.js", "build_info.json", "manifest.webmanifest", "icon.svg", "icon-192.png", "icon-512.png"];
const URLS = FILES.map(file => new URL(file, self.registration.scope).href);
self.addEventListener("install", event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(URLS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(key =>
    key.startsWith("afyanote-v") && key.endsWith(":" + self.registration.scope) && key !== CACHE
  ).map(key => caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener("message", event => {
  if (event.data === "CHECK_READY" || event.data === "REPAIR_CACHE") event.waitUntil(caches.open(CACHE).then(async cache => {
    if (event.data === "REPAIR_CACHE") {
      try { await cache.addAll(URLS); } catch { event.ports[0]?.postMessage({ ready: false, version: VERSION }); return; }
    }
    const hits = await Promise.all(URLS.map(url => cache.match(url)));
    event.ports[0]?.postMessage({ ready: hits.every(response => response?.ok), version: VERSION });
  }));
});
self.addEventListener("fetch", event => {
  if (event.request.method !== "GET" || !URLS.includes(event.request.url)) return;
  event.respondWith(caches.open(CACHE).then(async cache => {
    const hit = await cache.match(event.request); if (hit) return hit;
    const response = await fetch(event.request);
    if (response.ok) await cache.put(event.request, response.clone());
    return response;
  }));
});
