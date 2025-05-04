import React, { useState } from 'react';
import { signInWithGoogle } from '../firebaseConfig';
import './CSS/SignInModal.css';

function SignInModal({ setUser, onClose }) {
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleSignIn = async () => {
    try {
      setIsSigningIn(true);  // Start the sign-in process

      const user = await signInWithGoogle();
      setUser(user);
      onClose();
    } catch (error) {
      console.error("Error signing in:", error);
    } finally {
      setIsSigningIn(false);  // Reset the state once the sign-in is complete
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Welcome to RumbleX!</h2>
        <p>Sign in to join the action!</p>

        {/* Disable button while signing in */}
        <button 
          className="google-btn" 
          onClick={handleSignIn} 
          disabled={isSigningIn}
        >
          {isSigningIn ? 'Signing In...' : 'Sign In with Google'}
        </button>

        <button className="close-btn" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
}

export default SignInModal;
