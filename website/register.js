import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

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
