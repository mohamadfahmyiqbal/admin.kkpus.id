// Web Push Notifications & Notification Click Handler
// Imported into Workbox Service Worker via importScripts('/push-sw.js')

self.addEventListener("push", function (event) {
  if (!event.data) {
    return;
  }

  const rawText = event.data.text();
  let title = "Koperasi Backoffice";
  let options = {
    icon: "/assets/icons/pwa-192x192.png",
    badge: "/assets/icons/pwa-192x192.png",
    vibrate: [100, 50, 100],
    data: { url: "/" },
    actions: [
      {
        action: "explore",
        title: "Buka",
        icon: "/assets/icons/pwa-192x192.png",
      },
      {
        action: "close",
        title: "Tutup",
        icon: "/assets/icons/pwa-192x192.png",
      },
    ],
  };

  try {
    const data = JSON.parse(rawText);
    title = data.title || title;
    options.body = data.body || options.body;
    options.data = data.url ? { url: data.url } : options.data;
  } catch (error) {
    options.body = rawText;
  }

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const targetUrl = event.notification.data?.url || "/";

  if (event.action === "close") {
    return;
  }

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
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
