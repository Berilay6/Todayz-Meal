import { auth, signInWithEmailAndPassword } from "./firebase.js";

document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Prevent page reload

  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      window.location.href = "index.html"; // Redirect on success
    })
    .catch((error) => {
      alert("Login failed: " + error.message);
    });
});
