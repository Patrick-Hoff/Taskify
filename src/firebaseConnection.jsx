import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { getAuth } from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyAqDOF-EXkbzPMhAhEHAN6bFX8Acqxmnis",
    authDomain: "project-udemy-a4f53.firebaseapp.com",
    projectId: "project-udemy-a4f53",
    storageBucket: "project-udemy-a4f53.firebasestorage.app",
    messagingSenderId: "55587215061",
    appId: "1:55587215061:web:aec003d3bca38c2d7f345c",
    measurementId: "G-NS2YTHRKHD"
  };

  const firebaseApp = initializeApp(firebaseConfig)

  const db = getFirestore(firebaseApp)
  const auth = getAuth(firebaseApp)

  export { db, auth };