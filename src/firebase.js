// src/firebase.js
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Corrected path

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    return user;
  } catch (error) {
    console.error("Error signing in:", error.message);
    throw error;
  }
};
