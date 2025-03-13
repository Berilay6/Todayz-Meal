const apiKey = "df9950684f9d4726844ba7ab898f40fb";
const apiUrl =
  "https://api.spoonacular.com/recipes/findByIngredients?number=5&ranking=1&ingredients=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const recipesDiv = document.querySelector(".recipes");

async function fetchRecipes(ingredients) {
  const response = await fetch(apiUrl + ingredients + `&apiKey=${apiKey}`);
  const data = await response.json();

  if (data.length === 0) {
    document.querySelector(".error").style.display = "block";
    recipesDiv.innerHTML = "";
  } else {
    document.querySelector(".error").style.display = "none";
    recipesDiv.innerHTML = data
      .map(
        (recipe) => `
            <div class="recipe">
              <img src="${recipe.image}" alt="${recipe.title}" />
              <h3>${recipe.title}</h3>
              <p>Missing ingredients: ${recipe.missedIngredientCount}</p>
            </div>
          `
      )
      .join("");
  }
}

searchBtn.addEventListener("click", () => {
  fetchRecipes(searchBox.value);
});
