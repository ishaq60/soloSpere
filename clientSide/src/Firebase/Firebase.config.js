// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC2-ZVgC_JJRY0FXbVBztBKad99xwAjme4",
  authDomain: "solosphere-1cbed.firebaseapp.com",
  projectId: "solosphere-1cbed",
  storageBucket: "solosphere-1cbed.firebasestorage.app",
  messagingSenderId: "356821209133",
  appId: "1:356821209133:web:775aeef6b9aca8dd4ce8a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export default app