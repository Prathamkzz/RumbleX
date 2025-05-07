import { initializeApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  setPersistence,
  browserLocalPersistence
} from "firebase/auth";
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Persistence set to local");
  })
  .catch((error) => {
    console.error("Error setting persistence:", error);
  });

export const signInWithGoogle = async () => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  return result.user;
};

export { auth, db, signInWithPopup, GoogleAuthProvider };
