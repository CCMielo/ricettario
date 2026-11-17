// Service worker del Ricettario.
// Tutti i file sono nostri (nessun servizio esterno): prima la rete, così ogni apertura con internet
// mostra l'ultima versione di pagina e stili insieme; senza rete usa la copia salvata.

const CACHE = 'ricettario-v3';
const PRECACHE = [
  './',
  'tailwind.css',
  'manifest.json',
  'icons/icon.svg',
  'icons/icon-192.png',
  'icons/icon-512.png',
  'vendor/fonts/fonts.css',
  'vendor/fonts/inter-latin-wght-normal.woff2',
  'vendor/fonts/playfair-display-latin-wght-normal.woff2',
  'vendor/fonts/playfair-display-latin-wght-italic.woff2',
  'vendor/fontawesome/css/fontawesome.min.css',
  'vendor/fontawesome/css/solid.min.css',
  'vendor/fontawesome/webfonts/fa-solid-900.woff2',
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
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;

  // La pagina è salvata sempre con la chiave './' (anche se aperta con parametri nell'indirizzo).
  const key = req.mode === 'navigate' ? './' : req.url;
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
});
