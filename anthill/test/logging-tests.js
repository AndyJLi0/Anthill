import { initializeApp } from 'firebase/app';
import { doc, collection, getFirestore, addDoc, getDoc, updateDoc, arrayUnion, setDoc } from 'firebase/firestore';

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
const app_firebase = initializeApp(firebaseConfig);

// const auth = getAuth(app_firebase)

console.log("before db init");
// Initialize Firestore
export const db = getFirestore(app_firebase);
