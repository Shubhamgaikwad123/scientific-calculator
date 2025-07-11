self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('calc-v1').then(cache => {
      return cache.addAll([
        '/HTML/Clculater/index.html',
        '/HTML/Clculater/style.css',
        '/HTML/Clculater/script.js',
        '/HTML/Clculater/manifest.json',
        '/HTML/Clculater/icon-192.png',
        '/HTML/Clculater/icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
