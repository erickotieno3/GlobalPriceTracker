// Service Worker for Tesco Price Comparison App
const CACHE_NAME = 'tesco-price-comparison-v1';
const OFFLINE_URL = 'offline.html';

// Files to cache initially
const CACHE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/service-worker.js',
  '/offline.html',
  '/assets/icon-192x192.png',
  '/assets/icon-512x512.png',
  '/assets/tesco-logo.png',
  '/assets/carrefour-logo.png',
  '/assets/naivas-logo.png',
  '/assets/walmart-logo.png',
  '/assets/kenya-flag.png',
  '/assets/product-sunlight.png',
  '/assets/product-milk.png'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching files');
        return cache.addAll(CACHE_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache');
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', event => {
  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  
  // Handle API requests differently - network first, then offline response
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Cache the response for API calls that succeed
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // For API failures, check cache or return offline response
          return caches.match(event.request)
            .then(cachedResponse => {
              if (cachedResponse) {
                return cachedResponse;
              }
              // If we don't have a cached API response, return a generic offline response
              return caches.match(OFFLINE_URL);
            });
        })
    );
    return;
  }
  
  // For non-API requests, use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        
        // Not in cache, fetch from network
        return fetch(event.request)
          .then(response => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response
            const responseToCache = response.clone();
            
            // Add to cache
            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // If network request fails and it's a page request, show offline page
            if (event.request.mode === 'navigate') {
              return caches.match(OFFLINE_URL);
            }
          });
      })
  );
});

// Listen for push notifications
self.addEventListener('push', event => {
  const options = {
    body: event.data.text() || 'New price update available!',
    icon: '/assets/icon-192x192.png',
    badge: '/assets/badge-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'view',
        title: 'View Update',
        icon: '/assets/icon-checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/assets/icon-close.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Tesco Price Comparison', options)
  );
});

// Listen for notification click events
self.addEventListener('notificationclick', event => {
  event.notification.close();
  
  if (event.action === 'view') {
    // Open the main app interface with the specific content
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});