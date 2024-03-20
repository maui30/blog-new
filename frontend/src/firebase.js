// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_KEY,
  authDomain: "blog-new-ea633.firebaseapp.com",
  projectId: "blog-new-ea633",
  storageBucket: "blog-new-ea633.appspot.com",
  messagingSenderId: "346984594148",
  appId: "1:346984594148:web:f549612d4f0fd3881dcaf1",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
