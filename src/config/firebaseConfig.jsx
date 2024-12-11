// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAkcyJXD2H9Wsuj9q8vB_Gc2yX7k56tK7c",
  authDomain: "dev-abdulbasit-me.firebaseapp.com",
  projectId: "dev-abdulbasit-me",
  storageBucket: "dev-abdulbasit-me.firebasestorage.app",
  messagingSenderId: "146899556174",
  appId: "1:146899556174:web:46093a40147323494f701f",
  measurementId: "G-59L9149QC2",
  databaseURL: "https://dev-abdulbasit-me-default-rtdb.firebaseio.com",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const database = getDatabase(app);
const analytics = getAnalytics(app);
