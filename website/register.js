// register.js (son hali)

// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Firebase projenin gerçek ve doğru bilgileri
const firebaseConfig = {
  apiKey: "AIzaSyAOuriGi3FYCzhM0tstQQoT4SBU84hIPrM",
  authDomain: "todayz-meal-3f537.firebaseapp.com",
  projectId: "todayz-meal-3f537",
  storageBucket: "todayz-meal-3f537.firebasestorage.app",
  messagingSenderId: "31772265109",
  appId: "1:31772265109:web:c63d7d9702d43ff140699c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("signUpForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordRep = document.getElementById("passwordRep").value;

  if (password !== passwordRep) {
    alert("Passwords do not match!");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Successfully registered!");
      window.location.href = "login.html";
    })
    .catch((error) => {
      alert("Signup failed: " + error.message);
    });
});
