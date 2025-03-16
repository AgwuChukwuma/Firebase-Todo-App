// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6dQBD3XS5shzL8tI2I6xpa-w0TEyH_t4",
  authDomain: "todo-app-cfbf2.firebaseapp.com",
  projectId: "todo-app-cfbf2",
  storageBucket: "todo-app-cfbf2.firebasestorage.app",
  messagingSenderId: "662668069744",
  appId: "1:662668069744:web:b8f6b230d2c8550ca95db5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)