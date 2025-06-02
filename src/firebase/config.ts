import  { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyATDtQSSWOYmjJXupW0YBu08tMroSl5eQc",
  authDomain: "e-code-generator.firebaseapp.com",
  projectId: "e-code-generator",
  storageBucket: "e-code-generator.firebasestorage.app",
  messagingSenderId: "1057401665024",
  appId: "1:1057401665024:web:1d485a17135874af7b4ae5",
  measurementId: "G-JX4XZNKW00"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const analytics = getAnalytics(app);

export default app;
 