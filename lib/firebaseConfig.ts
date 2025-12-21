// lib/firebaseConfig.ts
import { getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your EXACT Firebase Console config — DO NOT CHANGE ANYTHING
const firebaseConfig = {
  apiKey: "AIzaSyCwS3sxh8gX6SQiLfZz1ehidXbDgCQB3Tc",
  authDomain: "medibridge-bd590.firebaseapp.com",
  projectId: "medibridge-bd590",
  storageBucket: "medibridge-bd590.firebasestorage.app",
  messagingSenderId: "475957265235",
  appId: "1:475957265235:web:3fa1d63b83df72df4157a6",
  measurementId: "G-TSRHCE1NQ5",
};

// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

// Export ready-to-use instances
export const auth = getAuth(app);
export const db = getFirestore(app);
