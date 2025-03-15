const searchBox = document.querySelector(".search input");
 const searchBtn = document.querySelector(".search button");
 const recipesDiv = document.querySelector(".recipes");
 const modal = document.querySelector(".modal");
 const modalContent = document.querySelector(".modal-content");
 const closeModal = document.querySelector(".close-modal");
 
 async function fetchRecipes(ingredients) {
   const response = await fetch(apiUrl + ingredients + `&apiKey=${apiKey}`);
 @@ -21,14 +24,51 @@ async function fetchRecipes(ingredients) {
             <div class="recipe">
               <img src="${recipe.image}" alt="${recipe.title}" />
               <h3>${recipe.title}</h3>
               <p>Missing ingredients: ${recipe.missedIngredientCount}</p>
               <p>Missing Ingredients: ${recipe.missedIngredientCount}</p>
               <button onclick="fetchRecipeDetails(${recipe.id})">View Details</button>
             </div>
           `
       )
       .join("");
   }
 }
 
 async function fetchRecipeDetails(recipeId) {
   const response = await fetch(
     `https://api.spoonacular.com/recipes/${recipeId}/information?apiKey=${apiKey}`
   );
   const recipe = await response.json();
 
   modalContent.innerHTML = `
     <h2>${recipe.title}</h2>
     <img src="${recipe.image}" alt="${recipe.title}" width="200"/>
     <p><strong>Preparation Time:</strong> ${recipe.readyInMinutes} minutes</p>
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
 
   modal.style.display = "block";
 }
 
 // Close modal
 closeModal.addEventListener("click", () => {
   modal.style.display = "none";
 });
 
 // Close modal when clicking outside
 window.addEventListener("click", (event) => {
   if (event.target === modal) {
     modal.style.display = "none";
   }
 });
 
 searchBtn.addEventListener("click", () => {
   fetchRecipes(searchBox.value);
 });