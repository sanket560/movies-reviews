import { initializeApp } from "firebase/app";
import { getFirestore , collection } from "firebase/firestore";
const firebaseConfig = {
  apiKey:import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "movie-review-6e0eb.firebaseapp.com",
  projectId: "movie-review-6e0eb",
  storageBucket: "movie-review-6e0eb.appspot.com",
  messagingSenderId: "900361536613",
  appId: "1:900361536613:web:a77ce3b9a3011f9b3ff28c",
  measurementId: "G-4RGM81G23Q"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app)
export const moviesRef = collection(db,"movies")
export const reviewsRef = collection(db,"reviews")
export const usersRef = collection(db,"users")


export default app