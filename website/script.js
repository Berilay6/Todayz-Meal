import { auth, db } from "./firebase.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  doc,
  setDoc,
  getDoc,
  updateDoc,
  arrayUnion,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

const apiKey = "f53ccab5d21f4b47a7ae3f83f4d89296";
const apiUrl =
  "https://api.spoonacular.com/recipes/findByIngredients?number=5&ranking=1&ingredients=";

document.getElementById("searchButton").addEventListener("click", fetchRecipes);
document.getElementById("profileButton").addEventListener("click", function () {
  window.location.href = "profile.html";
});

async function fetchRecipes() {
  const ingredient = document.getElementById("ingredientInput").value.trim();
  const veganFilter = document.getElementById("veganFilter").checked;
  const vegetarianFilter = document.getElementById("vegetarianFilter").checked;

  if (!ingredient) {
    alert("Please enter an ingredient!");
    return;
  }

  try {
    const response = await fetch(apiUrl + ingredient + `&apiKey=${apiKey}`);
    let recipes = await response.json();

    const recipeList = document.getElementById("recipeList");
    recipeList.innerHTML = "";

    if (recipes.length === 0) {
      recipeList.innerHTML = "<li>No recipes found!</li>";
      return;
    }

    for (const recipe of recipes) {
      const detailsResponse = await fetch(
        `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`
      );
      const recipeDetails = await detailsResponse.json();

      if (
        (veganFilter && !recipeDetails.vegan) ||
        (vegetarianFilter && !recipeDetails.vegetarian)
      ) {
        continue;
      }

      const li = document.createElement("li");
      li.innerHTML = `
                <strong>${recipe.title}</strong><br>
                <img src="${recipe.image}" width="100"><br>
                <p>Vegan: ${recipeDetails.vegan ? "Yes" : "No"}</p>
                <p>Vegetarian: ${recipeDetails.vegetarian ? "Yes" : "No"}</p>
                <button onclick="fetchRecipeDetails(${
                  recipe.id
                })">View Details</button>
            `;
      recipeList.appendChild(li);
    }
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
}

async function fetchRecipeDetails(recipeId) {
  try {
    const response = await fetch(
      `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`
    );
    const recipe = await response.json();

    const modalBody = document.getElementById("modalBody");
    modalBody.innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}" width="200"><br>
            <p><strong>Preparation Time:</strong> ${
              recipe.readyInMinutes
            } minutes</p>
            <p><strong>Servings:</strong> ${recipe.servings}</p>
            <h3>Ingredients:</h3>
            <ul>
                ${recipe.extendedIngredients
                  .map((ing) => `<li>${ing.original}</li>`)
                  .join("")}
            </ul>
            <h3>Instructions:</h3>
            <p>${recipe.instructions || "No recipe instructions available."}</p>
        `;

    document.getElementById("modal").style.display = "block";
  } catch (error) {
    console.error("Error fetching recipe details:", error);
  }
}

function closeModal() {
  document.getElementById("modal").style.display = "none";
}
