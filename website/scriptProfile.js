document.addEventListener("DOMContentLoaded", async () => {
  const list = document.getElementById("favoriteList");
  const emailDisplay = document.getElementById("userEmail");
  const { auth, onAuthStateChanged, getDocs, collection, db } = await import(
    "./firebase.js"
  );

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
  `;
  document.getElementById("modal").style.display = "block";
};

window.closeModal = () => {
  document.getElementById("modal").style.display = "none";
};

function goBack() {
  window.location.href = "index.html";
}
