// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAL513etDNYNQLTQqQu898-3YZA2ik_iyo",
  authDomain: "inventory-app-85f33.firebaseapp.com",
  projectId: "inventory-app-85f33",
  storageBucket: "inventory-app-85f33.appspot.com",
  messagingSenderId: "127399986840",
  appId: "1:127399986840:web:149e9779b70ed00b99b2ed",
  measurementId: "G-XM721KTTSN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app)

export {firestore}