const CACHE_NAME = "84rv-departures-v1";
const ESSENTIAL_PATHS = [
  "./",
  "index.html",
  "styles/base.css",
  "styles/board.css",
  "styles/responsive.css",
  "scripts/app.js",
  "scripts/board-renderer.js",
  "scripts/clock.js",
  "scripts/pagination.js",
  "scripts/data-source.js",
  "data/departures.json",
  "assets/logo-placeholder.svg",
  "assets/icons/app-icon.svg",
  "assets/icons/app-icon-maskable.svg",
  "manifest.json",
];

function scopedUrl(path) {
  return new URL(path, self.registration.scope).href;
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(ESSENTIAL_PATHS.map(scopedUrl)))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  const requestUrl = new URL(event.request.url);
  const scopeUrl = new URL(self.registration.scope);
  if (requestUrl.origin !== scopeUrl.origin || !requestUrl.href.startsWith(scopeUrl.href)) return;

  if (event.request.mode === "navigate") {
    event.respondWith(
      fetch(event.request).catch(async () => {
        return (await caches.match(scopedUrl("index.html"))) || Response.error();
      }),
    );
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cachedResponse = await cache.match(event.request);
      const networkResponse = fetch(event.request)
        .then((response) => {
          if (response.ok) cache.put(event.request, response.clone());
          return response;
        })
        .catch(() => null);

      if (cachedResponse) {
        event.waitUntil(networkResponse);
        return cachedResponse;
      }

      return (await networkResponse) || Response.error();
    }),
  );
});
