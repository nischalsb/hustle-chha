// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getFunctions } from "firebase/functions";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBCVyfPDnzx4azcL1X4VgUcMVSqkzMW5oo",
  authDomain: "productivity-app-f7da1.firebaseapp.com",
  projectId: "productivity-app-f7da1",
  storageBucket: "productivity-app-f7da1.firebasestorage.app",
  messagingSenderId: "52994585788",
  appId: "1:52994585788:web:3f369e7c60388669a28cb9",
  measurementId: "G-E3GWT9KTEL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);

export default app;