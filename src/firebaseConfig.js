import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAVYkFFwrPqh5ifHS1mFHOHmqwogyGIP6I",
  authDomain: "vortexo-bb05c.firebaseapp.com",
  projectId: "vortexo-bb05c",
  storageBucket: "vortexo-bb05c.appspot.com",
  messagingSenderId: "541122368406",
  appId: "1:541122368406:web:155fc297e25868f54c43b7",
  measurementId: "G-STRRNKHMSW"
};

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
const auth = getAuth(app);
const db = getFirestore(app);

// Set persistence to local so the user stays signed in after page refresh
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to local");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

// Define the sign-in function
export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user; // Return the signed-in user
};

export { auth, db, signInWithPopup, GoogleAuthProvider };
