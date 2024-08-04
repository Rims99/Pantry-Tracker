// lib/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA9CY_nTcLSScTcS2yq15kekK5vVkAJpxM",
  authDomain: "pantry-app-74e9a.firebaseapp.com",
  projectId: "pantry-app-74e9a",
  storageBucket: "pantry-app-74e9a.appspot.com",
  messagingSenderId: "619972598241",
  appId: "1:619972598241:web:03183505aa5d870508daa0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
