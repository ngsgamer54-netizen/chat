importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

const firebaseConfig = {
    apiKey: "AIzaSyCRB3ghMxx-nq1tLIXVGPj53ZdlN_W1zbI",
    authDomain: "mywhatsappclone-12e96.firebaseapp.com",
    projectId: "mywhatsappclone-12e96",
    storageBucket: "mywhatsappclone-12e96.firebasestorage.app",
    messagingSenderId: "131666791116",
    appId: "1:131666791116:web:fe41ca039c1bd9a774d069"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
    console.log('Background Payload:', payload);

    let title = payload.data?.title || payload.notification?.title || "New Notification";
    let body = payload.data?.body || payload.notification?.body || "Aapko ek naya update mila hai.";
    
    // Agar payload mein 'call' word hai toh Calling wala behavior dikhao
    const isCall = body.toLowerCase().includes("calling") || title.toLowerCase().includes("call");

    const notificationOptions = {
        body: body,
        icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
        badge: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
        tag: isCall ? 'incoming-call' : 'new-msg',
        renotify: true,
        vibrate: isCall ? [500, 200, 500, 200, 500] : [200, 100, 200],
        requireInteraction: isCall ? true : false,
        data: { url: self.location.origin + '/chat/' }
    };

    return self.registration.showNotification(title, notificationOptions);
});

self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            for (const client of clientList) {
                if (client.url.includes('/chat/') && 'focus' in client) return client.focus();
            }
            if (clients.openWindow) return clients.openWindow(event.notification.data.url);
        })
    );
});
