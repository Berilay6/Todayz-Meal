/* Kullanıcının web sitesine giriş yaptığı sayfanın backend dosyasıdır.
  
  - Kullanıcı giriş formunu takip ederek, Firebase Authentication ile giriş yapmasını sağlar.
  - Başarılı girişte kullanıcıyı ana sayfaya yönlendirir.
  - Hatalı girişlerde kullanıcıya hata mesajı gösterir.
*/

// firebase.js dosyasında dışa aktardığımız (export) bilgileri bu dosyada kullanabilmek için içe aktarıyoruz (import).
import { auth, signInWithEmailAndPassword } from "./firebase.js";


/*"loginForm" giriş sayfasına login.html dosyasında verdiğimiz değişken ismi ve bu sayfaya "submit" yani giriş 
formuna gönderme işlemi gerçekleştiğinde çalışacak event listener ekliyoruz.*/
document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault(); // Sayfanın otomatik olarak tekrar yüklenmesini engeller

  // Kullanıcının giriş yaptığı e-posta ve şifreyi input alanlarından alıyoruz.
  const email = document.getElementById("email").value;  //email ve password yine login.html dosyasında tanımlanmış değişkenlerdir.
  const password = document.getElementById("password").value;

  // Firebase Authentication ile giriş yapma işlemini başlatıyoruz.
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      // Kullanıcı başarıyla giriş yaptığında, kullanıcı bilgilerini alıyoruz.
      const user = userCredential.user;
      // Başarılı giriş sonrası kullanıcıyı ana sayfaya yönlendiriyoruz.
      window.location.href = "index.html"; 
    })
    .catch((error) => {
      // Giriş başarısız olursa kullanıcıya hata mesajı gösteriyoruz.
      alert("Login failed: " + error.message);
    });
});
