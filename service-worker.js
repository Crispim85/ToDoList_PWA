const CACHE_NAME = 'app-cache-v2';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/script.js',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
];

// Instala e armazena os arquivos estáticos
self.addEventListener('install', event => {
  console.log('[ServiceWorker] Instalando...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[ServiceWorker] Cacheando arquivos');
        return cache.addAll(FILES_TO_CACHE);
      })
  );
  self.skipWaiting(); // força ativação imediata
});

// Ativa e limpa caches antigos
self.addEventListener('activate', event => {
  console.log('[ServiceWorker] Ativando...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.filter(name => name !== CACHE_NAME)
          .map(name => caches.delete(name))
      );
    })
  );
  self.clients.claim(); // toma controle das abas abertas
});

// Intercepta requisições e serve do cache se possível
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});