// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDTL7zWYlL3A7YAVCu9EmSbDgRrauxZmwg",
  authDomain: "portzen-94710.firebaseapp.com",
  projectId: "portzen-94710",
  storageBucket: "portzen-94710.firebasestorage.app",
  messagingSenderId: "887656881238",
  appId: "1:887656881238:web:c1b55c598619c836cd6ff7"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Initialize Firebase