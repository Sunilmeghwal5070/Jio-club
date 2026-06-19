import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyC7X5aC4sd83toM0vcFJS8t0JsPOZtTHzU",
  authDomain: "win-44.firebaseapp.com",
  databaseURL: "https://win-44-default-rtdb.firebaseio.com",
  projectId: "win-44",
  storageBucket: "win-44.firebasestorage.app",
  messagingSenderId: "884205162789",
  appId: "1:884205162789:web:883b818bf9759e9c744acc",
  measurementId: "G-78C860K49E"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);

// Initialize Analytics safely
export const analytics = typeof window !== 'undefined' 
  ? isSupported().then(yes => yes ? getAnalytics(app) : null)
  : null;

export default app;
