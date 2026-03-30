import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "script-smith.firebaseapp.com",
  projectId: "script-smith",
  storageBucket: "script-smith.firebasestorage.com", 
  messagingSenderId: "554555519517",
  appId: "1:554555519517:web:8b6682db0e211ca28a0cf4",
  measurementId: "G-8T56YWXHFX",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
const auth = getAuth(app);

// Google Provider
const provider = new GoogleAuthProvider();


export { auth, provider };