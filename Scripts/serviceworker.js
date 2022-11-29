alert("Hey...");

self.addEventListener('install', (e) => {
    e.waitUntil(
        caches.open('fr29').then((cache) => alert(cache)),
        caches.open('fr29').then((cache) => cache.addAll([Object.keys(images)
        ])),
    );
});

self.addEventListener('fetch', (e) => {
    console.log(e.request.url);
    e.respondWith(
        caches.match(e.request).then((response) => response || fetch(e.request)),
    );
});