import {
  auth,
  db,
  onAuthStateChanged,
  doc,
  setDoc,
  signOut,
  collection,
  getDocs,
} from "./firebase.js";

const apiKey = "f09e49ff927e44759109dea49b7e76e0";
const apiUrl =
  "https://api.spoonacular.com/recipes/findByIngredients?number=5&ranking=1&ingredients=";

document.getElementById("logoutBtn").onclick = () => {
  signOut(auth).then(() => (location.href = "login.html"));
};

document.getElementById("profileButton").onclick = () => {
  location.href = "profile.html";
};

document.getElementById("searchButton").onclick = fetchRecipes;

onAuthStateChanged(auth, (user) => {
  if (!user) location.href = "login.html";
});

async function fetchRecipes() {
  const ingredient = document.getElementById("ingredientInput").value;
  const vegan = document.getElementById("veganFilter").checked;
  const vegetarian = document.getElementById("vegetarianFilter").checked;

  const res = await fetch(`${apiUrl}${ingredient}&apiKey=${apiKey}`);
  const recipes = await res.json();
  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = "";

  recipes.forEach(async (recipe) => {
    const details = await fetch(
      `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`
    ).then((r) => r.json());

    if ((vegan && !details.vegan) || (vegetarian && !details.vegetarian))
      return;

    const li = document.createElement("li");
    li.innerHTML = `
      <strong>${recipe.title}</strong><br>
      <img src="${recipe.image}" width="100"><br>
      Vegan: ${details.vegan ? "Yes" : "No"}<br>
      Vegetarian: ${details.vegetarian ? "Yes" : "No"}<br>
      <button onclick="fetchRecipeDetails(${recipe.id})">Details</button>
    `;
    recipeList.appendChild(li);
  });
}

window.fetchRecipeDetails = async (id) => {
  const recipe = await fetch(
    `https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`
  ).then((r) => r.json());

  document.getElementById("modalBody").innerHTML = `
    <h2>${recipe.title}</h2>
    <img src="${recipe.image}" width="200"><br>
    <ul>${recipe.extendedIngredients
      .map((i) => `<li>${i.original}</li>`)
      .join("")}</ul>
    <p>${recipe.instructions || "No instructions"}</p>
    <button id="addFavorite">❤️ Favorite</button>
  `;

  document.getElementById("modal").style.display = "block";
  document.getElementById("addFavorite").onclick = () => addToFavorites(recipe);
};

window.closeModal = () => {
  document.getElementById("modal").style.display = "none";
};

async function addToFavorites(recipe) {
  const user = auth.currentUser;
  if (!user) return alert("You must be logged in to favorite.");

  try {
    // Kullanıcının email'ini ana belgeye ekle
    await setDoc(
      doc(db, "favorites", user.uid),
      {
        email: user.email,
      },
      { merge: true }
    );

    // Favori tarifi ekle
    await setDoc(
      doc(db, "favorites", user.uid, "items", recipe.id.toString()),
      {
        id: recipe.id,
        title: recipe.title,
        image: recipe.image,
        vegan: recipe.vegan,
        vegetarian: recipe.vegetarian,
        email: user.email,
        addedAt: new Date(),
      }
    );

    alert("Added to favorites!");
  } catch (err) {
    console.error("Error adding to favorites:", err);
    alert("Failed to add to favorites.");
  }
}
