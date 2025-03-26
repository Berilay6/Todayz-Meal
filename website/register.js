/* Kullanıcının web sitesine kayıt olduğu sayfanın backend dosyasıdır.
  
  - Kullanıcı kayıt formunu takip ederek, Firebase Authentication ile kullanıcının kaydının oluşmasını sağlar.
  - Başarılı girişte kullanıcıyı giriş yapma sayfasına yönlendirir.
  - Hatalı girişlerde kullanıcıya hata mesajı gösterir.
*/

// firebase.js dosyasında dışa aktardığımız (export) bilgileri bu dosyada kullanabilmek için içe aktarıyoruz (import).
import { auth } from "./firebase.js";
import { createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";

/*"signUpForm" kayıt olma sayfasına signup.html dosyasında verdiğimiz değişken ismi ve bu sayfaya "submit" yani kayıt olma 
formuna gönderme işlemi gerçekleştiğinde çalışacak event listener ekliyoruz.*/
document.getElementById("signUpForm").addEventListener("submit", function (e) {
  e.preventDefault(); //Sayfanın otomatik olarak tekrar yüklenmesini engeller

  // Kullanıcının kayıt olduğu e-posta, şifre ve şifre tekrarını input alanlarından alıyoruz.
  //Bu üç değişken singup.html dosyasında tanımlanmıştır.
  const email = document.getElementById("email").value; 
  const password = document.getElementById("password").value;
  const passwordRep = document.getElementById("passwordRep").value;

  //Şifre ve şifre tekrarını uyuşup uyuşmadığı kontrol edilir.
  if (password !== passwordRep) {
    //Uyuşmazlarsa kullanıcıya hata mesajı gönderiyoruz.
    alert("Passwords do not match!");
    return;
  }

  //Kullanıcının giriş yaptığı bilgileri Firebase Authentication'a kaydediyoruz.
  createUserWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Successfully registered!");
      //Başarılı giriş sonrası giriş yapma sayfasına yönlendiriyoruz.
      window.location.href = "login.html";
    })
    .catch((error) => {
      //Kayıt olma başarısız olursa kullanıcıya hata mesajı gösteriyoruz.
      alert("Signup failed: " + error.message);
    });
});
