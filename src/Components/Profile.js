// filepath: d:\vortexo\src\Components\Profile.js
import React, { useState, useEffect } from 'react';
import { signOut, updatePassword } from 'firebase/auth';
import { auth } from '../firebaseConfig';
import { doc, getDoc, setDoc, query, where, collection, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Make sure you export db from your firebase config
import { storage } from '../firebaseConfig';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import './Profile.css'; // Import your CSS file for styling

function Profile() {
  const user = auth.currentUser;
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [passwordMsg, setPasswordMsg] = useState('');

  // Social links state
  const [socialLinks, setSocialLinks] = useState({
    twitter: '',
    discord: '',
    instagram: ''
  });
  const [editingSocial, setEditingSocial] = useState(false);
  const [socialMsg, setSocialMsg] = useState('');

  // Username state
  const [username, setUsername] = useState('');
  const [editingUsername, setEditingUsername] = useState(false);
  const [usernameMsg, setUsernameMsg] = useState('');

  const [uploading, setUploading] = useState(false);

  const [photoURL, setPhotoURL] = useState(user?.photoURL || "/images/default-avatar.png");

  // Load social links from Firestore
  useEffect(() => {
    if (user) {
      const fetchSocialLinks = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSocialLinks({
            twitter: data.twitter || '',
            discord: data.discord || '',
            instagram: data.instagram || ''
          });
        }
      };
      fetchSocialLinks();
    }
  }, [user]);

  // Load username from Firestore
  useEffect(() => {
    if (user) {
      const fetchUsername = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username || '');
        }
      };
      fetchUsername();
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      const fetchPhotoURL = async () => {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setPhotoURL(data.photoURL || user.photoURL || "/images/default-avatar.png");
        } else {
          setPhotoURL(user.photoURL || "/images/default-avatar.png");
        }
      };
      fetchPhotoURL();
    }
  }, [user]);

  // Save social links to Firestore
  const handleSaveSocial = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, {
        twitter: socialLinks.twitter,
        discord: socialLinks.discord,
        instagram: socialLinks.instagram
      }, { merge: true });
      setEditingSocial(false);
      setSocialMsg('Social links updated!');
      setTimeout(() => setSocialMsg(''), 2000);
    } catch (error) {
      setSocialMsg('Error saving links.');
    }
  };

  // Save username to Firestore with uniqueness check
  const handleSaveUsername = async (e) => {
    e.preventDefault();
    if (!user) return;
    const desiredUsername = username.trim().toLowerCase();
    if (!desiredUsername.match(/^[a-z0-9_.]{3,20}$/)) {
      setUsernameMsg('Username must be 3-20 chars, a-z, 0-9, _ or .');
      return;
    }
    try {
      // Check if username is already taken by another user
      const q = query(
        collection(db, 'users'),
        where('username', '==', desiredUsername)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        // If the username exists and it's not the current user
        const taken = querySnapshot.docs.some(docu => docu.id !== user.uid);
        if (taken) {
          setUsernameMsg('Username is already taken.');
          return;
        }
      }
      // Save username to Firestore
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { username: desiredUsername }, { merge: true });
      setEditingUsername(false);
      setUsernameMsg('Username updated!');
      setTimeout(() => setUsernameMsg(''), 2000);
    } catch (error) {
      setUsernameMsg('Error saving username.');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      alert('You have been signed out.');
      window.location.href = '/';
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMsg('');
    if (!newPassword || newPassword.length < 6) {
      setPasswordMsg('Password must be at least 6 characters.');
      return;
    }
    try {
      await updatePassword(user, newPassword);
      setPasswordMsg('Password updated successfully!');
      setShowChangePassword(false);
      setNewPassword('');
    } catch (error) {
      setPasswordMsg(error.message);
    }
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setUploading(true);
    try {
      const storageRef = ref(storage, `avatars/${user.uid}`);
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);
      // Save photoURL to Firestore and update auth profile
      const docRef = doc(db, 'users', user.uid);
      await setDoc(docRef, { photoURL: url }, { merge: true });
      await user.updateProfile({ photoURL: url });
      window.location.reload(); // Refresh to show new avatar
    } catch (err) {
      alert("Failed to upload avatar.");
    }
    setUploading(false);
  };

  return (
    <div className="profile-card">
      {/* 1. User Info */}
      <div style={{ textAlign: 'center', position: 'relative' }}>
        <img
          className="profile-avatar"
          src={photoURL}
          alt="Avatar"
        />
        <label htmlFor="avatar-upload" style={{
          display: 'inline-block',
          marginTop: 8,
          cursor: 'pointer',
          color: '#ffd700',
          fontWeight: 500,
          fontSize: '0.95rem'
        }}>
          {uploading ? "Uploading..." : "Change Photo"}
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleAvatarChange}
            disabled={uploading}
          />
        </label>
      </div>
      <h2 className="profile-name">{user?.displayName || "Fan"}</h2>
      <div style={{
        color: "#ffd700",
        fontWeight: "bold",
        fontSize: "1.15rem",
        marginBottom: 4,
        letterSpacing: "0.5px"
      }}>
        {username
          ? `@${username}`
          : user?.email
            ? user.email.split('@')[0]
            : ""}
      </div>
      <p className="profile-email">{user?.email}</p>
      <hr className="profile-divider" />

      {/* Username Section */}
      <div style={{ textAlign: 'center', marginBottom: 16 }}>
        <h3 style={{ marginBottom: 8 }}>Username</h3>
        {(!username && editingUsername) ? (
          <form onSubmit={handleSaveUsername} style={{ marginBottom: 8 }}>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
              placeholder="Choose a unique username"
              style={{
                padding: '8px',
                borderRadius: 5,
                border: '1px solid #ffd700',
                marginRight: 8
              }}
              maxLength={20}
              minLength={3}
              required
            />
            <button type="submit" className="profile-btn">Save</button>
            <button type="button" className="profile-btn-secondary" onClick={() => setEditingUsername(false)}>Cancel</button>
            <div className="profile-password-msg">{usernameMsg}</div>
          </form>
        ) : (
          <>
            <span style={{ color: '#ffd700', fontWeight: 'bold', fontSize: '1.2rem' }}>
              {username ? `@${username}` : <span style={{ color: '#bbb' }}>No username set</span>}
            </span>
            {!username && (
              <button
                className="profile-btn-secondary"
                style={{ marginLeft: 12 }}
                onClick={() => setEditingUsername(true)}
              >
                Add Username
              </button>
            )}
            <div className="profile-password-msg">{usernameMsg}</div>
          </>
        )}
      </div>
      <hr className="profile-divider" />

      {/* 2. Account Actions */}
      <div style={{ textAlign: 'center', marginBottom: 24 }}>
        <button
          className="profile-btn"
          onClick={handleSignOut}
        >
          Sign Out
        </button>
        <button
          className="profile-btn-secondary"
          onClick={() => setShowChangePassword(!showChangePassword)}
        >
          Change Password
        </button>
      </div>
      {showChangePassword && (
        <form onSubmit={handleChangePassword} style={{ textAlign: 'center', marginBottom: 16 }}>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            style={{
              padding: '8px',
              borderRadius: 5,
              border: '1px solid #333',
              marginRight: 8
            }}
          />
          <button
            type="submit"
            className="profile-btn"
          >
            Update
          </button>
          <button
            type="button"
            className="profile-btn-secondary"
            onClick={() => { setShowChangePassword(false); setNewPassword(''); setPasswordMsg(''); }}
          >
            Cancel
          </button>
          <div className="profile-password-msg">{passwordMsg}</div>
        </form>
      )}
      <hr className="profile-divider" />

      {/* 6. Social */}
      <div>
        <h3>Social</h3>
        {editingSocial ? (
          <form onSubmit={handleSaveSocial} className="profile-social-form" style={{ marginBottom: 12 }}>
            <input
              type="url"
              placeholder="Twitter URL"
              value={socialLinks.twitter}
              onChange={e => setSocialLinks({ ...socialLinks, twitter: e.target.value })}
            />
            <input
              type="url"
              placeholder="Discord URL"
              value={socialLinks.discord}
              onChange={e => setSocialLinks({ ...socialLinks, discord: e.target.value })}
            />
            <input
              type="url"
              placeholder="Instagram URL"
              value={socialLinks.instagram}
              onChange={e => setSocialLinks({ ...socialLinks, instagram: e.target.value })}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditingSocial(false)}>Cancel</button>
            <div className="profile-password-msg">{socialMsg}</div>
          </form>
        ) : (
          <>
            <p className="profile-social-links">
              {socialLinks.twitter && (
                <a href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                  Twitter
                </a>
              )}
              {socialLinks.discord && (
                <a href={socialLinks.discord} target="_blank" rel="noopener noreferrer">
                  Discord
                </a>
              )}
              {socialLinks.instagram && (
                <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer">
                  Instagram
                </a>
              )}
            </p>
            <button className="profile-btn-secondary" onClick={() => setEditingSocial(true)}>Edit Social Links</button>
            <div className="profile-password-msg">{socialMsg}</div>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;