import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBR1QfW32x9_SA96Q7If28fber4N3XI_3w",
  authDomain: "todayz-meal.firebaseapp.com",
  projectId: "todayz-meal",
  storageBucket: "todayz-meal.firebasestorage.app",
  messagingSenderId: "784164467895",
  appId: "1:784164467895:web:f3f9e4fa7811e93b184932",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export {
  auth,
  db,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  doc,
  setDoc,
  collection,
  getDocs,
};
