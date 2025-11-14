// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBTop2eSU5Pls3-YFKL1wZMEaDsC4qU2uE",
  authDomain: "mvd-enter-project.firebaseapp.com",
  projectId: "mvd-enter-project",
  storageBucket: "mvd-enter-project.firebasestorage.app",
  messagingSenderId: "130267078266",
  appId: "1:130267078266:web:aa0342098759e2113b65c3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ ИНИЦИАЛИЗИРУЕМ AUTH (этого не было!)
export const auth = getAuth(app);

// ✅ ИНИЦИАЛИЗИРУЕМ FIRESTORE (этого не было!)
export const db = getFirestore(app);

// Экспортируем всё что нужно
export { app };
export default app;