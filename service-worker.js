const CACHE_NAME = "robotics-cache-v1";
const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./assets/robot1.jpg",
  "./assets/robot2.jpg",
  "./assets/robot3.jpg",
  "./assets/robot4.jpg"
];

self.addEventListener("install", (event) => {
  console.log("SW install");
  event.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(urlsToCache)));
});

self.addEventListener("activate", (event) => {
  console.log("SW activate");
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  event.respondWith(
    caches.match(request).then((cached) => {
      const fetchPromise = fetch(request)
        .then((network) => {
          if (request.method === "GET" && network && network.status === 200) {
            const copy = network.clone();
            caches.open(CACHE_NAME).then((c) => c.put(request, copy));
          }
          return network;
        })
        .catch(() => cached || caches.match("./index.html"));
      return cached || fetchPromise;
    })
  );
});
