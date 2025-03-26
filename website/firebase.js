// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyAOuriGi3FYCzhM0tstQQoT4SBU84hIPrM",
  authDomain: "todayz-meal-3f537.firebaseapp.com",
  projectId: "todayz-meal-3f537",
  storageBucket: "todayz-meal-3f537.firebasestorage.app",
  messagingSenderId: "31772265109",
  appId: "1:31772265109:web:c63d7d9702d43ff140699c"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db, signInWithEmailAndPassword, onAuthStateChanged, signOut, doc, setDoc, collection, getDocs };
