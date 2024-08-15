// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCrVxmRVkF4m-P0y3zON266gdSBR23QNUU",
  authDomain: "inventory-managements-735ec.firebaseapp.com",
  projectId: "inventory-managements-735ec",
  storageBucket: "inventory-managements-735ec.appspot.com",
  messagingSenderId: "450810370130",
  appId: "1:450810370130:web:b009635ec8e2a68e4e278b",
  measurementId: "G-XKKYXSD138"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
export {firestore}