// src/firebase.js
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebaseConfig"; // Corrected path

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    console.log('User signed in:', user); // Log the user object for debugging
    return user;
  } catch (error) {
    console.error("Error signing in:", error.message);

    // Log more details if available
    if (error.code) {
      console.error("Error code:", error.code); // Error code for better identification
    }
    if (error.stack) {
      console.error("Error stack trace:", error.stack); // Stack trace to track where it's failing
    }

    // Show more specific messages based on error code (if applicable)
    if (error.code === 'auth/popup-closed-by-user') {
      console.log('Popup closed by user');
    } else if (error.code === 'auth/network-request-failed') {
      console.log('Network error, please check your internet connection');
    }

    throw error; // Re-throw the error for further handling if necessary
  }
};
