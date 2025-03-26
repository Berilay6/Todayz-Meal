document.addEventListener("DOMContentLoaded", async () => {   
  const list = document.getElementById("favoriteList");                             //favoriteList öğesi, favori tarifleri listelemek için kullanılır.
  const emailDisplay = document.getElementById("userEmail");                        //userEmail öğesi, giriş yapan kullanıcının e-posta adresini göstermek için kullanılır.
  const { auth,                 //kimlik doğrulamak için
          onAuthStateChanged,   //kullanıcı giriş yapmış mı kontrol etmek için
          getDocs,              // Firestore'dan verileri almak için
          collection,           // Firestore koleksiyonlarını yönetmek için
          db,                   //Firestore veritabanı referansı
          doc,                  // Belirli bir Firestore dokümanına erişmek için.
          deleteDoc } =         //Firestore'dan bir dokümanı silmek için
    await import("./firebase.js");

  window.auth = auth;  //global olarak erişebilmek için
  window.db = db;
  window.doc = doc;
  window.deleteDoc = deleteDoc;

  onAuthStateChanged(auth, async (user) => {                      //kullanıcı giriş yapmış mı kontrol edilir
    if (!user) return (window.location.href = "login.html");      //giriş yapılmamışsa login.html sayfasına yönlendirilir.

    if (user) {
      emailDisplay.textContent = user.email;                       //giriş yapılmışsa email adresi görünür yapılır.
    }

    const snapshot = await getDocs(                                 //veri tabanından favori tarifleri çekiyoruz. 
      collection(db, "favorites", user.uid, "items")
    );
    if (snapshot.empty) {
      list.innerHTML = "<li>No favorites yet.</li>";                 //kullanıcının favorisi yoksa
      return;
    }

    snapshot.forEach((doc) => {                                     //tarifleri tek tek işlemek için
      const recipe = doc.data();                                    //tarif bilgileri alınır.
      const li = document.createElement("li");                      //<li> ögesi oluşturulur.
      li.innerHTML = ` 
        <strong>${recipe.title}</strong><br>
        <img src="${recipe.image}" width="100"><br>
        Vegan: ${recipe.vegan ? "Yes" : "No"}<br>
        Vegetarian: ${recipe.vegetarian ? "Yes" : "No"}<br>
        <button onclick="fetchRecipeDetails(${recipe.id})">Details</button>
      `;
      //tarifin bilgileri eklendi.
      list.appendChild(li);                                         //oluşturulan öge favoriler listesine eklenir.
    });
  });
});

window.fetchRecipeDetails = async function (id) {     //tarifin detaylarını almak için
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
  //tarif detayları modalBodye eklendi.
  document.getElementById("modal").style.display = "block";
};

window.removeFromFavorites = async function (recipeId) {     //favorilerden silmek için
  const user = auth.currentUser;
  if (!user) return alert("You must be logged in.");         //kullanıcı giriş yapmamışsa

  try {
    await deleteDoc(
      doc(db, "favorites", user.uid, "items", recipeId.toString()) //seçili tarif favori koleksiyonundan silinir.
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
  window.location.href = "index.html"; //go back ile index.html sayfasına yönlendirilir 
}

