import {
  auth,                 //kimlik doğrulama için
  db,                   // veritabanına ulaşmak için
  onAuthStateChanged,   //kullanıcı giriş yaptı mı
  doc,                  //veritabanında bir belgeyi temsil eder
  setDoc,               //veritabanına belge eklemek ya da güncellemek için
  signOut,              //oturumu sonlandırmak için
  collection,           //veritabanındaki collectionlara erişmek için
  getDocs,              //koleksiyon içindeki tüm belgeler (favorilerin gelmesi için)
} from "./firebase.js";

const apiKey = "f09e49ff927e44759109dea49b7e76e0";                  //Spponacular API
const apiUrl =
  "https://api.spoonacular.com/recipes/findByIngredients?number=5&ranking=1&ingredients=";

document.getElementById("logoutBtn").onclick = () => {              //kullanıcı logout butonuna tıklayınca oturum kapatılır ve giriş sayfasına yönlendirilir.
  signOut(auth).then(() => (location.href = "login.html"));
};

document.getElementById("profileButton").onclick = () => {          //profil butonuna tıklayınca profile.html sayfasına yönlendirilir.
  location.href = "profile.html";
};

document.getElementById("searchButton").onclick = fetchRecipes;     //kullanıcı search butonuna tıklayınca fetchRecipes fonksiyonu çalıştırılır.

onAuthStateChanged(auth, (user) => {
  if (!user) location.href = "login.html";                           //kullanıcı giriş yapmış mı kontrol edilir giriş yapılmışsa login.html sayfasına yönlendirilir.
});

async function fetchRecipes() {
  const ingredient = document.getElementById("ingredientInput").value;                   //girilen malzeme
  const vegan = document.getElementById("veganFilter").checked;                          //vegan seçeneği 
  const vegetarian = document.getElementById("vegetarianFilter").checked;                //vejetaryen seçeneği

  const res = await fetch(`${apiUrl}${ingredient}&apiKey=${apiKey}`);                    //urlye girilen malzemeyi içeren http isteği gönderilir böylece filtreleme işlemi yapılır.
  const recipes = await res.json();                                                      //yanıtı json formatına çevirip recipes olarak kaydilir.
  const recipeList = document.getElementById("recipeList");
  recipeList.innerHTML = "";                                                             //geçmiş aramalardan kalan tarifler silinir.

  recipes.forEach(async (recipe) => {                                        
    const details = await fetch(
      `https://api.spoonacular.com/recipes/${recipe.id}/information?apiKey=${apiKey}`    //tarifin detayları için ikini API isteği gönderilir.
    ).then((r) => r.json());

    if ((vegan && !details.vegan) || (vegetarian && !details.vegetarian))                //vegan-vejetaryen seçilmişse vegan-vejetaryen olmayan tarifler gösterilmez.
      return;

    const li = document.createElement("li");                                             //tarifleri htmlye eklemek için <li> oluşturuldu.
    li.innerHTML = `
      <strong>${recipe.title}</strong><br>
      <img src="${recipe.image}" width="100"><br>
      Vegan: ${details.vegan ? "Yes" : "No"}<br>
      Vegetarian: ${details.vegetarian ? "Yes" : "No"}<br>
      <button onclick="fetchRecipeDetails(${recipe.id})">Details</button>
    `;
    recipeList.appendChild(li);                                                          //oluşturulan <li> ögelerini listeye ekler.
  });
}

window.fetchRecipeDetails = async (id) => {           //tarifin idsini alıyor
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
//modalBody'e tarifin detayları eklendi.
  document.getElementById("modal").style.display = "block";                      //tarif detayları görünür hale getirildi.
  document.getElementById("addFavorite").onclick = () => addToFavorites(recipe); //addFavorite tıklandığında fonksiyon çağırıldı.
};

window.closeModal = () => {                                                      //tarif detayları kapatılır.
  document.getElementById("modal").style.display = "none";    
};

async function addToFavorites(recipe) {          
  const user = auth.currentUser;                                                 //giriş yapan kullanıcı değişken olarak atandı.
  if (!user) return alert("You must be logged in to favorite.");                 //giriş yapılmamışsa hata mesajı yayınlandı.

  try {
    // Kullanıcının email'ini ana belgeye eklemek için
    await setDoc(
      doc(db, "favorites", user.uid),  //favorites içinde bir belge oluşturuldu.
      {
        email: user.email,            //e-mail bilgisi kaydedildi.
      },
      { merge: true }                 //daha önce yapılan favorilere eklenir.
    );

    // Favori tarifi eklemek için
    await setDoc(     
      doc(db, "favorites", user.uid, "items", recipe.id.toString()), //favorites koleksiyonuna tarifler ekleniyor. 
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

    alert("Added to favorites!");  //ekleme başarılıysa 
  } catch (err) {
    console.error("Error adding to favorites:", err); //ekleme hatalıysa
    alert("Failed to add to favorites.");
  }
}
