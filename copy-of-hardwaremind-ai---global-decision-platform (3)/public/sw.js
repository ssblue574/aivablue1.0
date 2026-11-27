// Service Worker for PWA support
const CACHE_NAME = 'hardwaremind-v3';
const RUNTIME_CACHE = 'hardwaremind-runtime-v3';

// Assets to cache on install
const PRECACHE_ASSETS = [
  '/',
  '/products',
  '/compare',
  '/manifest.json',
];

const shouldBypassCache = (url) => {
  // Never cache Vite/dev module graph or source modules, otherwise UI stays stale.
  return (
    url.includes('/@') ||
    url.includes('/node_modules/') ||
    url.endsWith('/editorial-runtime.json') ||
    url.includes('.tsx') ||
    url.includes('.ts') ||
    url.includes('.jsx') ||
    url.includes('.css') ||
    url.includes('vite') ||
    url.includes('hot-update')
  );
};

// Install event - cache assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS).catch((err) => {
        console.warn('Failed to cache some assets:', err);
      });
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => {
            return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
          })
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  if (shouldBypassCache(event.request.url)) {
    event.respondWith(fetch(event.request));
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Prefer network for navigation so HTML shell stays fresh.
      if (event.request.mode === 'navigate') {
        return fetch(event.request)
          .then((response) => {
            if (response && response.status === 200) {
              const responseToCache = response.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(event.request, responseToCache);
              });
            }
            return response;
          })
          .catch(() => cachedResponse || caches.match('/'));
      }

      // Return cached version if available
      if (cachedResponse) {
        return cachedResponse;
      }

      // Fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Clone the response
          const responseToCache = response.clone();

          // Cache the response
          caches.open(RUNTIME_CACHE).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(() => {
          // Return offline fallback for navigation requests
          if (event.request.mode === 'navigate') {
            return caches.match('/');
          }
        });
    })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-favorites') {
    event.waitUntil(syncFavorites());
  }
  if (event.tag === 'sync-posts') {
    event.waitUntil(syncPosts());
  }
});

// Push notifications (if needed in future)
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'HardwareMind';
  const options = {
    body: data.body || 'You have a new notification',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
  };

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.openWindow(event.notification.data?.url || '/')
  );
});

// Helper functions
async function syncFavorites() {
  // Sync favorites when online
  try {
    const favorites = await getStoredFavorites();
    // Sync to server
    // await syncToServer(favorites);
  } catch (error) {
    console.error('Failed to sync favorites:', error);
  }
}

async function syncPosts() {
  // Sync community posts when online
  try {
    const posts = await getStoredPosts();
    // Sync to server
    // await syncToServer(posts);
  } catch (error) {
    console.error('Failed to sync posts:', error);
  }
}

async function getStoredFavorites() {
  // Get favorites from IndexedDB or localStorage
  return JSON.parse(localStorage.getItem('favorites') || '[]');
}

async function getStoredPosts() {
  // Get posts from IndexedDB or localStorage
  return JSON.parse(localStorage.getItem('communityPosts') || '[]');
}
