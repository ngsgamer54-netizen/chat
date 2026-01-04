// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// Firebase Configuration
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

// Background handler: Jab app band ho tab notification dikhane ke liye
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background message received ', payload);

    // Title aur Body extract karna (payload.notification ya payload.data dono ko handle karta hai)
    const notificationTitle = payload.notification?.title || payload.data?.title || "New Message";
    const notificationBody = payload.notification?.body || payload.data?.body || "Aapko ek naya message mila hai.";
    
    const notificationOptions = {
        body: notificationBody,
        icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
        badge: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
        tag: 'chat-notification', // Same tag hone se purane notifications group ho jayenge
        renotify: true,
        vibrate: [200, 100, 200], // Mobile par vibration ke liye
        requireInteraction: true, // Jab tak user click na kare, notification dikhta rahega
        data: {
            // Click karne par GitHub Pages ke /chat/ folder par le jayega
            url: self.location.origin + '/chat/' 
        }
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click logic
self.addEventListener('notificationclick', (event) => {
    const targetUrl = event.notification.data.url;
    event.notification.close(); // Notification ko band karo click ke baad

    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            // Check karein ki kya chat wala tab pehle se khula hai
            for (const client of clientList) {
                if (client.url.includes(targetUrl) && 'focus' in client) {
                    return client.focus();
                }
            }
            // Agar nahi khula, toh naya tab open karo
            if (clients.openWindow) {
                return clients.openWindow(targetUrl);
            }
        })
    );
});
