/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// This a service worker file for receiving push notifitications.
// See `Access registration token section` @ https://firebase.google.com/docs/cloud-messaging/js/client#retrieve-the-current-registration-token

// Scripts for firebase and firebase messaging
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js");

const firebaseConfig = {
  apiKey: "AIzaSyAV3BYPU2xncEElk74aKVJtSRTf4oPY7eE",
  authDomain: "gshop-2c9dc.firebaseapp.com",
  projectId: "gshop-2c9dc",
  storageBucket: "gshop-2c9dc.appspot.com",
  messagingSenderId: "622325190921",
  appId: "1:622325190921:web:c7c95ee54a10f36bfa43d8",
  measurementId: "G-1SBLKYBFBY",
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
