import React from 'react';
import { signInWithGoogle } from '../firebaseConfig';
import './CSS/SignInModal.css'; // Add this line

function SignInModal({ setUser, onClose }) {
  const handleSignIn = async () => {
    try {
      const user = await signInWithGoogle();
      setUser(user);
      onClose();
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to RumbleX!</h2>
        <p>Sign in to join the action!</p>
        <button className="google-btn" onClick={handleSignIn}>
          Sign In with Google
        </button>
        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default SignInModal;
