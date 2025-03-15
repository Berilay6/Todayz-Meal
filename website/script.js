// Firebase SDK and Firestore connection
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOuriGi3FYCzhM0tstQQoT4SBU84hIPrM",
  authDomain: "todayz-meal-3f537.firebaseapp.com",
  projectId: "todayz-meal-3f537",
  storageBucket: "todayz-meal-3f537.firebasestorage.app",
  messagingSenderId: "31772265109",
  appId: "1:31772265109:web:c63d7d9702d43ff140699c"
};

// Initializing Firebase
const app = initializeApp(firebaseConfig);

// Firestore connection
const db = getFirestore(app);

// Spoonacular API configuration
const apiKey = "f09e49ff927e44759109dea49b7e76e0";
const apiUrl = "https://api.spoonacular.com/recipes/findByIngredients?number=5&ranking=1&ingredients=";

// Search button event listener
document.getElementById("searchButton").addEventListener("click", fetchRecipes);

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
            const detailsResponse = await fetch(`https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`);
            const recipeDetails = await detailsResponse.json();

            if ((veganFilter && !recipeDetails.vegan) || (vegetarianFilter && !recipeDetails.vegetarian)) {
                continue;
            }

            const li = document.createElement("li");
            li.innerHTML = `
                <strong>${recipe.title}</strong><br>
                <img src="${recipe.image}" width="100"><br>
                <p>Vegan: ${recipeDetails.vegan ? "Yes" : "No"}</p>
                <p>Vegetarian: ${recipeDetails.vegetarian ? "Yes" : "No"}</p>
                <button class="viewDetailsButton" data-recipe-id="${recipe.id}">View Details</button>
            `;
            recipeList.appendChild(li);
        }

    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
}

// Event listener for "View Details" buttons (Event Delegation)
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("viewDetailsButton")) {
        const recipeId = event.target.getAttribute("data-recipe-id");
        fetchRecipeDetails(recipeId);
    }
});

async function fetchRecipeDetails(recipeId) {
    try {
        const response = await fetch(`https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`);
        const recipe = await response.json();

        const modalBody = document.getElementById("modalBody");
        modalBody.innerHTML = `
            <h2>${recipe.title}</h2>
            <img src="${recipe.image}" alt="${recipe.title}" width="200"><br>
            <p><strong>Preparation Time:</strong> ${recipe.readyInMinutes} minutes</p>
            <p><strong>Servings:</strong> ${recipe.servings}</p>
            <h3>Ingredients:</h3>
            <ul>
                ${recipe.extendedIngredients.map(ing => `<li>${ing.original}</li>`).join("")}
            </ul>
            <h3>Recipe:</h3>
            <p>${recipe.instructions || "No recipe instructions available."}</p>
            <button id="favoriteButton">❤️ Add to Favorites</button>
        `;

        document.getElementById("modal").style.display = "block";

        // Add to favorites button function
        document.getElementById("favoriteButton").addEventListener("click", () => addToFavorites(recipe));
    } catch (error) {
        console.error("Error fetching recipe details:", error);
    }
}

async function addToFavorites(recipe) {
    try {
        await setDoc(doc(db, "favorites", recipe.id.toString()), {
            id: recipe.id,
            title: recipe.title,
            image: recipe.image,
            readyInMinutes: recipe.readyInMinutes,
            servings: recipe.servings,
            ingredients: recipe.extendedIngredients.map(ing => ing.original),
            instructions: recipe.instructions || "No recipe instructions available."
        });
        console.log("Recipe successfully added:", recipe);
        alert("Recipe added to favorites! ✅");
    } catch (error) {
        console.error("Error adding to favorites:", error);
    }
}

// Modal close function
window.closeModal = function () {
    document.getElementById("modal").style.display = "none";
};

// Close modal by clicking outside
window.addEventListener("click", (event) => {
    if (event.target === document.getElementById("modal")) {
        closeModal();
    }
});
