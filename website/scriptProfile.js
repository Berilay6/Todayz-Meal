document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("favoriteList");
  const emailDisplay = document.getElementById("userEmail");
  const { auth, onAuthStateChanged, getDocs, collection, db, doc, deleteDoc } =
    await import("./firebase.js");

  window.auth = auth;
  window.db = db;
  window.doc = doc;
  window.deleteDoc = deleteDoc;

  onAuthStateChanged(auth, async (user) => {
    if (!user) return (window.location.href = "login.html");

    if (user) {
      emailDisplay.textContent = user.email;
    }

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
        <button onclick="fetchRecipeDetails(${recipe.id})">Details</button>
      `;
      list.appendChild(li);
    });
  });
});

window.fetchRecipeDetails = async function (id) {
  const apiKey = "f09e49ff927e44759109dea49b7e76e0";
  const res = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
  );
  const recipe = await res.json();

  document.getElementById("modalBody").innerHTML = `
    <h2>${recipe.title}</h2>
    <img src="${recipe.image}" width="200"><br>
    <ul>${recipe.extendedIngredients
      .map((i) => `<li>${i.original}</li>`)
      .join("")}</ul>
    <p>${recipe.instructions || "No instructions available."}</p>
    <button onclick="removeFromFavorites(${
      recipe.id
    })">❌ Remove from Favorites</button>

  `;
  document.getElementById("modal").style.display = "block";
};

window.removeFromFavorites = async function (recipeId) {
  const user = auth.currentUser;
  if (!user) return alert("You must be logged in.");

  try {
    await deleteDoc(
      doc(db, "favorites", user.uid, "items", recipeId.toString())
    );
    alert("Removed from favorites.");
    document.getElementById("modal").style.display = "none";
    location.reload();
  } catch (err) {
    console.error("Error removing from favorites:", err);
    alert("Failed to remove from favorites.");
  }
};

window.closeModal = () => {
  document.getElementById("modal").style.display = "none";
};

function goBack() {
  window.location.href = "index.html";
}
