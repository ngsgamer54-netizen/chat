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

// Background handler
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Background message received ', payload);

    // Agar payload mein notification object nahi hai, toh data se nikalenge
    const notificationTitle = payload.notification ? payload.notification.title : (payload.data ? payload.data.title : "New Message");
    
    const notificationOptions = {
        body: payload.notification ? payload.notification.body : (payload.data ? payload.data.body : "You have a new alert"),
        icon: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg', // Professional Icon
        badge: 'https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg',
        tag: 'whatsapp-nature-notification', // Taki multiple notifications ek hi jagah club ho jayein
        renotify: true,
        data: {
            url: self.location.origin // Notification click karne par site khulegi
        }
    };

    // Vibrate pattern for Call
    if (notificationTitle.toLowerCase().includes('call')) {
        notificationOptions.vibrate = [200, 100, 200, 100, 200, 100, 400];
    }

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click karne par website kholne ke liye
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
            if (clientList.length > 0) {
                return clientList[0].focus();
            }
            return clients.openWindow('/');
        })
    );
});
