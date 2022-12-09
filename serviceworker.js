const cacheName = "fr29";

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open(cacheName).then((cache) => cache.addAll(imageURLs)),
    );
});

self.addEventListener("fetch", event => {
    event.respondWith((async () => {
        try {
            const res = await fetch(event.request);
            (await caches.open(cacheName)).put(event.request, res.clone());
            return res;
        }
        catch (err) {
            return await caches.match(event.request);
        }
    })());
});