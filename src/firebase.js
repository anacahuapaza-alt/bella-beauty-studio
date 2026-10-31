import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Configuración de la aplicación web Bella Beauty Studio.
const firebaseConfig = {
  apiKey: "AIzaSyC84GLazl2--QE1zU1Kcw13SqQvX-jWuiA",
  authDomain: "proyecto-38b69.firebaseapp.com",
  projectId: "proyecto-38b69",
  storageBucket: "proyecto-38b69.firebasestorage.app",
  messagingSenderId: "378855420841",
  appId: "1:378855420841:web:f6873158849423617a4ab8",
  measurementId: "G-X5J3K9HMD7"
};

const app = initializeApp(firebaseConfig);
export const firebaseReady = true;
export const db = getFirestore(app);
