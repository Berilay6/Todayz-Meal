// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBR1QfW32x9_SA96Q7If28fber4N3XI_3w",
  authDomain: "todayz-meal.firebaseapp.com",
  projectId: "todayz-meal",
  storageBucket: "todayz-meal.firebasestorage.app",
  messagingSenderId: "784164467895",
  appId: "1:784164467895:web:f3f9e4fa7811e93b184932",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

document.getElementById("signUpForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent page reload

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const passwordRep = document.getElementById("passwordRep").value;

  if (password !== passwordRep) {
    alert("Passwords do not match!");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = "login.html"; // Redirect on success
    })
    .catch((error) => {
      alert("Signup failed: " + error.message);
    });
});
