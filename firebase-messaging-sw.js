// firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.1/firebase-messaging-compat.js');

// Aapka Firebase Config
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

// Background notification handler
messaging.onBackgroundMessage((payload) => {
  const notificationTitle = payload.notification.title || "New Alert";
  const notificationOptions = {
    body: payload.notification.body,
    icon: 'bg.jpg' // Aapka logo ya background image
  };
  self.registration.showNotification(notificationTitle, notificationOptions);
});
