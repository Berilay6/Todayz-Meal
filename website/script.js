import { auth, db, onAuthStateChanged, doc, setDoc, signOut } from "./firebase.js";

const apiKey = "f53ccab5d21f4b47a7ae3f83f4d89296";
const apiUrl = "https://api.spoonacular.com/recipes/findByIngredients?number=5&ranking=1&ingredients=";

// Logout işlemi
document.getElementById("logoutBtn").onclick = () => {
  signOut(auth).then(() => location.href = "login.html");
};

// Favorites sayfasına git
document.getElementById("favoritesBtn").onclick = () => {
  location.href = "favorites.html";
};

// Profile butonu (aynı favorites sayfasına yönlendirebilir veya profile özel sayfa olabilir)
document.getElementById("profileButton").onclick = () => {
  location.href = "favorites.html";
};

// Kullanıcı giriş kontrolü
onAuthStateChanged(auth, user => {
  if (!user) location.href = "login.html";
});

// Tarifleri getir
document.getElementById("searchButton").onclick = fetchRecipes;

async function fetchRecipes() {
  const ingredient = document.getElementById("ingredientInput").value;
  const vegan = document.getElementById("veganFilter").checked;
  const vegetarian = document.getElementById("vegetarianFilter").checked;

  const res = await fetch(`${apiUrl}${ingredient}&apiKey=${apiKey}`);
  const recipes = await res.json();
  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = "";

  recipes.forEach(async recipe => {
    const details = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`).then(r => r.json());

    if ((vegan && !details.vegan) || (vegetarian && !details.vegetarian)) return;

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
  const recipe = await fetch(`https://api.spoonacular.com/recipes/${id}/information?apiKey=${apiKey}`).then(r => r.json());

  document.getElementById("modalBody").innerHTML = `
    <h2>${recipe.title}</h2>
    <img src="${recipe.image}" width="200"><br>
    <ul>${recipe.extendedIngredients.map(i => `<li>${i.original}</li>`).join("")}</ul>
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
  await setDoc(doc(db, "favorites", user.uid, "items", recipe.id.toString()), {
    id: recipe.id,
    title: recipe.title,
    image: recipe.image,
    vegan: recipe.vegan,
    vegetarian: recipe.vegetarian,
    addedAt: new Date()
  });
  alert("Added to favorites!");
}
