// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from 'firebase/firestore'
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCge8DWDWKcedgbQxFjEr14oS4aSFrGwsM",
  authDomain: "flashcards-11f51.firebaseapp.com",
  projectId: "flashcards-11f51",
  storageBucket: "flashcards-11f51.appspot.com",
  messagingSenderId: "3515917359",
  appId: "1:3515917359:web:473822bb2759b5916352da",
  measurementId: "G-SJM0XT4LQH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)

export {db}