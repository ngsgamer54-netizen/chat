// firebase-messaging-sw.js
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

// Background handler - Jab app band ho tab notification dikhane ke liye
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background message received ', payload);

    // Data payload se title aur body nikalna (safety ke liye)
    const notificationTitle = payload.notification?.title || payload.data?.title || "New Message";
    const notificationBody = payload.notification?.body || payload.data?.body || "Aapko ek naya message aaya hai";
    
    const notificationOptions = {
        body: notificationBody,
        icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
        badge: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
        tag: 'whatsapp-nature-notification', 
        renotify: true,
        requireInteraction: true, // Notification tab tak nahi jayega jab tak user click na kare
        data: {
            // Click karne par sahi folder khule iske liye path fix
            url: self.location.origin + (self.location.pathname.includes('/chat/') ? '/chat/' : '/')
        }
    };

    // Call ke liye vibration pattern
    if (notificationTitle.toLowerCase().includes('call')) {
        notificationOptions.vibrate = [200, 100, 200, 100, 200, 100, 400];
    }

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click karne par website kholne ke liye
self.addEventListener('notificationclick', (event) => {
    const targetUrl = event.notification.data.url;
    event.notification.close();

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Agar pehle se tab khula hai toh uspar focus karo
            for (const client of clientList) {
                if (client.url.includes(targetUrl) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Agar nahi khula toh naya tab kholo
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
