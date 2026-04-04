import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBwfIyc0U9bM89TKeofpJiGabBlZ3_FprQ",
  authDomain: "jeet1010.firebaseapp.com",
  projectId: "jeet1010",
  storageBucket: "jeet1010.firebasestorage.app",
  messagingSenderId: "1094830131816",
  appId: "1:1094830131816:web:879185bd77ddd6834049dd",
  measurementId: "G-PEH26NN1EL"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);