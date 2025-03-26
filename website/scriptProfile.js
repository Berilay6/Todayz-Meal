document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("favoriteList");

  const { auth, onAuthStateChanged, getDocs, collection, db } = await import(
    "./firebase.js"
  );

  onAuthStateChanged(auth, async (user) => {
    if (!user) return (window.location.href = "login.html");

    const snapshot = await getDocs(
      collection(db, "favorites", user.uid, "items")
    );
    if (snapshot.empty) {
      list.innerHTML = "<li>No favorites yet.</li>";
      return;
    }

    snapshot.forEach((doc) => {
      const recipe = doc.data();
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${recipe.title}</strong><br>
        <img src="${recipe.image}" width="100"><br>
        Vegan: ${recipe.vegan ? "Yes" : "No"}<br>
        Vegetarian: ${recipe.vegetarian ? "Yes" : "No"}<br>
      `;
      list.appendChild(li);
    });
  });
});

function goBack() {
  window.location.href = "index.html";
}
