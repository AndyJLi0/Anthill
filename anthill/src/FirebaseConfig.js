// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { auth, getAuth } from "firebase/auth";
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDmxHi0ePlXnK-R9mshM_f6f6uL_9ZB0Lw",
  authDomain: "anthill-976f5.firebaseapp.com",
  projectId: "anthill-976f5",
  storageBucket: "anthill-976f5.appspot.com",
  messagingSenderId: "404854557178",
  appId: "1:404854557178:web:ba19d53bbac68de0773c43",
  measurementId: "G-HX6JM48RCP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firebaseAuth = getAuth(app);

export { firebaseAuth as auth };