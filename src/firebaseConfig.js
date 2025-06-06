import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getStorage } from "firebase/storage";

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
export const storage = getStorage(app);

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

// Call this function when you want to update XP
export async function updateUserXP(userId, newXP) {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, { xp: newXP }, { merge: true });
}

// Call this function when you want to retrieve XP
export async function getUserXP(userId) {
  const userRef = doc(db, 'users', userId);
  const docSnap = await getDoc(userRef);
  if (docSnap.exists()) {
    return docSnap.data().xp || 0;
  }
  return 0;
}

export { auth, db, signInWithPopup, GoogleAuthProvider };
