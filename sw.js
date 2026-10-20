// Enhanced Service Worker for PWA Features
const CACHE_NAME = 'koperasi-bo-v1.0.0';
const STATIC_CACHE = 'static-bo-v1.0.0';
const DYNAMIC_CACHE = 'dynamic-bo-v1.0.0';

const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/assets/icons/PUSlogo.png',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Skip non-GET requests and non-http/https schemes (e.g. chrome-extension://, data:)
  if (request.method !== 'GET' || !url.protocol.startsWith('http')) {
    return;
  }

  // Bypass cache completely in development to prevent stale Vite dev server assets
  const isDevelopment = self.location.hostname === 'localhost' || 
                        self.location.hostname === '127.0.0.1' || 
                        self.location.port !== '';
  if (isDevelopment) {
    return;
  }
  
  // Handle different request types
  if (url.origin === self.location.origin) {
    if (STATIC_ASSETS.includes(url.pathname)) {
      // Static assets - Cache First
      event.respondWith(cacheFirst(request));
    } else if (url.pathname.startsWith('/api/')) {
      // API requests - Network First with fallback
      event.respondWith(networkFirst(request));
    } else {
      // Other same-origin requests - Stale While Revalidate
      event.respondWith(staleWhileRevalidate(request));
    }
  } else {
    // Cross-origin requests - Network First
    event.respondWith(networkFirst(request));
  }
});

// Cache First Strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.error('Cache First failed:', error);
    return new Response('Offline', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Network First Strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.warn('Network First failed (falling back to cache):', error);
    
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response('Offline', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  }
}

// Stale While Revalidate Strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const fetchPromise = fetch(request).then(async (networkResponse) => {
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch((error) => {
    console.warn('Fetch failed in staleWhileRevalidate:', error);
    return new Response('Offline', { 
      status: 503, 
      statusText: 'Service Unavailable' 
    });
  });
  
  return cachedResponse || fetchPromise;
}

// Background Sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

async function doBackgroundSync() {
  console.log('Service Worker: Background sync triggered');
}

// Enhanced Push Notifications
self.addEventListener("push", function (event) {
  if (!event.data) {
    return;
  }

  const rawText = event.data.text();

  let title = "Koperasi Backoffice";
  let options = {
    icon: "/assets/icons/PUSlogo.png",
    badge: "/assets/icons/PUSlogo.png",
    vibrate: [100, 50, 100],
    data: { url: "/" },
    actions: [
      {
        action: 'explore',
        title: 'Buka',
        icon: '/assets/icons/PUSlogo.png'
      },
      {
        action: 'close',
        title: 'Tutup',
        icon: '/assets/icons/PUSlogo.png'
      }
    ]
  };

  try {
    const data = JSON.parse(rawText);
    title = data.title || title;
    options.body = data.body || options.body;
    options.data = data.url ? { url: data.url } : options.data;
  } catch (error) {
    options.body = rawText;
  }

  event.waitUntil(
    self.registration.showNotification(title, options)
  );
});

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetUrl = event.notification.data?.url || '/';

  if (event.action === 'close') {
    return;
  }

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});

// Message handling for communication with main app
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
