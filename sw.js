// Service worker del Ricettario.
// - File nostri (pagina, tailwind.css, icone, manifest): prima la rete, così ogni apertura con internet
//   mostra l'ultima versione; senza rete usa la copia salvata.
// - File esterni (Google Fonts, Font Awesome): prima la copia salvata, aggiornata in background.

const CACHE = 'ricettario-v2';
const PRECACHE = [
  './',
  'tailwind.css',
  'manifest.json',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(PRECACHE)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  // File nostri (pagina, tailwind.css, icone, manifest): prima la rete, così pagina e stili
  // arrivano sempre aggiornati insieme. La pagina è salvata sempre con la chiave './'.
  const isPage = req.mode === 'navigate';
  if (isPage || new URL(req.url).origin === self.location.origin) {
    const key = isPage ? './' : req.url;
    // 'no-cache' = chiedi sempre al server se il file è cambiato (evita la cache HTTP di 10 minuti di GitHub Pages).
    event.respondWith(
      fetch(req.url, { cache: 'no-cache' })
        .then((res) => {
          if (res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(key, copy));
          }
          return res;
        })
        .catch(() => caches.match(key))
    );
    return;
  }

  // File esterni (font, Font Awesome): prima la copia salvata, aggiornata in background.

  event.respondWith(
    caches.match(req).then((cached) => {
      const network = fetch(req)
        .then((res) => {
          if (res.ok || res.type === 'opaque') {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(req, copy));
          }
          return res;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
