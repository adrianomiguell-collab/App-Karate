const CACHE_NAME = "atarashii-app-v3";
const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./gamification.js",
  "./manifest.json",
  "../data/content-items.json",
  "../data/techniques.json",
  "../data/stances.json",
  "../data/katas-shotokan-complete.json",
  "../data/glossary.json",
  "../data/rules.json",
  "../data/quiz.json",
  "../data/quiz-kata-iniciante.json",
  "../data/quiz-kata-intermediario.json",
  "../data/quiz-kata-avancado.json",
  "../assets/brand/atarashii-logo.png",
  "../assets/faixas/branca.gif",
  "../assets/faixas/amarela.gif",
  "../assets/faixas/vermelha.gif",
  "../assets/faixas/laranja.gif",
  "../assets/faixas/roxa.gif",
  "../assets/faixas/marrom.gif",
  "../assets/faixas/preta.gif",
  "../assets/bases/bases-01.png",
  "../assets/bases/bases-02.png",
  "../assets/bases/bases-03.png",
  "../assets/katas/heian-sandan-yondan-godan-bassai-dai.png",
  "../assets/katas/heian-shodan-nidan.png",
  "../assets/katas/tekki-shodan-nidan-sandan.png"
];

// Instala o Service Worker e adiciona os recursos ao cache
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[Service Worker] Caching app shell and data content");
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// Ativa o Service Worker e remove caches antigos, se houver
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log("[Service Worker] Removing old cache", key);
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Intercepta requisições de rede
self.addEventListener("fetch", (event) => {
  // Ignora requisições que não sejam do tipo GET ou para destinos externos (ex: embeds do YouTube)
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request).then((response) => {
        // Opcional: Adiciona novas requisições dinâmicas ao cache
        if (response && response.status === 200) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      }).catch(() => {
        // Fallback caso a rede falhe e o recurso não esteja no cache
        console.log("[Service Worker] Resource not found in cache and network failed");
      });
    })
  );
});
