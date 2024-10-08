import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, addDoc, collection } from "firebase/firestore";
// import admin from 'firebase-admin';
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

export const auth = getAuth(app);

console.log("before db init");
// Initialize Firestore
export const db = getFirestore(app);
