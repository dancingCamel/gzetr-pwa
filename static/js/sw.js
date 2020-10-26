var cacheName = "gzetr-pwa";
var filesToCache = [
  "/gzetr-pwa/",
  "/gzetr-pwa/index.html",
  "/gzetr-pwa/static/css/style.css",
  "/gzetr-pwa/static/css/bootstrap-grid.css",
  "/gzetr-pwa/static/css/bootstrap-grid.css.map",
  "/gzetr-pwa/static/css/bootstrap.css.map",
  "/gzetr-pwa/static/css/bootstrap.css",
  "/gzetr-pwa/static/js/bootstrap.js",
  "/gzetr-pwa/static/js/bootstrap.js.map",
  "/gzetr-pwa/static/js/country.js",
  "/gzetr-pwa/static/js/jquery-3.5.1.js",
  "/gzetr-pwa/static/js/keys.js",
  "/gzetr-pwa/static/js/map.js",
  "/gzetr-pwa/static/js/script.js",
  "/gzetr-pwa/static/js/utils.js",
];
self.addEventListener("install", function (e) {
  console.log("[ServiceWorker] Install");
  e.waitUntil(
    caches.open(cacheName).then(function (cache) {
      console.log("[ServiceWorker] Caching app shell");
      return cache.addAll(filesToCache);
    })
  );
});
self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request, { ignoreSearch: true }).then((response) => {
      return response || fetch(event.request);
    })
  );
});
