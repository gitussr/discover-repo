// Minimal app-shell service worker. Deliberately small — this is a
// client-only SPA (see src/lib/spa-router.tsx) with no server to lean on,
// so the only job here is: (1) let the app be installed, and (2) make
// previously-visited pages available offline. It never touches
// cross-origin requests (GitHub's API), so it can't go stale in a way that
// serves outdated repository data.
const CACHE_NAME = "gitussr-shell-v1";

self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isBuildAsset = url.pathname.includes("/_next/static/");
  const isNavigation = request.mode === "navigate";
  if (!isBuildAsset && !isNavigation) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      if (isBuildAsset) {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
      }

      // Navigation: network-first so visitors always get fresh HTML/JS when
      // online, falling back to whatever was last cached for this URL.
      try {
        const response = await fetch(request);
        cache.put(request, response.clone());
        return response;
      } catch {
        const cached = await cache.match(request);
        return cached || Response.error();
      }
    })
  );
});
