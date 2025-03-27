/*  
  Firebase yapılandırma bilgilerinin saklandığı ve dışa aktarıldığı dosyadır.
  
  - `export` anahtar kelimesi sayesinde, tanımlanan özellikler diğer dosyalardan erişilebilir hale getirilir.
  - Bu sayede, her dosyada aynı yapılandırmayı tekrar tanımlamak yerine, tek bir merkezi dosyadan erişim sağlanır.
  - Kodun daha okunaklı ve yönetilebilir olmasına katkı sağlar.
*/

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.4.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-auth.js";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/11.4.0/firebase-firestore.js";

/*  
  Firebase projesinin yapılandırma ayarları  
  - Buradaki bilgiler, Firebase projesine bağlanmak için gereklidir.
  - Firebase Konsolu'ndan alınan API anahtarı ve diğer bilgiler buraya eklenmiştir.
*/
const firebaseConfig = {
  apiKey: "AIzaSyBR1QfW32x9_SA96Q7If28fber4N3XI_3w",
  authDomain: "todayz-meal.firebaseapp.com",
  projectId: "todayz-meal",
  storageBucket: "todayz-meal.firebasestorage.app",
  messagingSenderId: "784164467895",
  appId: "1:784164467895:web:f3f9e4fa7811e93b184932",
};

const app = initializeApp(firebaseConfig); //Firebase uygulamasını başlatır
const auth = getAuth(app); //Firebase Authentication servisini başlatır
const db = getFirestore(app); //Firestore veritabanını başlatır

//export sayesinde içerideki özelliklere diğer dosyalardan erişilebilir
export {
  auth, // Kimlik doğrulama nesnesi
  db, // Firestore veritabanı nesnesi
  signInWithEmailAndPassword, // Kullanıcı girişini gerçekleştiren fonksiyon
  onAuthStateChanged, // Kullanıcının oturum durumunu takip eden fonksiyon
  signOut, // Kullanıcının oturumunu kapatan fonksiyon
  doc, // Firestore'da belge referansı oluşturan fonksiyon
  setDoc, // Firestore'da belge oluşturan/güncelleyen fonksiyon
  collection, // Firestore koleksiyon referansı oluşturan fonksiyon
  getDocs, // Firestore koleksiyonundaki belgeleri getiren fonksiyon
  deleteDoc, // Firestore'dan belgeyi silen fonksiyon
};
