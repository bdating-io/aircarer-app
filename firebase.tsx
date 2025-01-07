import { getAuth } from "firebase/auth";
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC-kDrvLl6rL4jaRMFrRsyssDTvrSPSefA",
  authDomain: "aircarer-c4b51.firebaseapp.com",
  projectId: "aircarer-c4b51",
  storageBucket: "aircarer-c4b51.firebasestorage.app",
  messagingSenderId: "698631564722",
  appId: "1:698631564722:web:eb4b22000aaee25af1c8ab",
  measurementId: "G-KMBD9D31SR",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
