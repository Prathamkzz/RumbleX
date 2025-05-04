import React, { useState } from 'react';
import './Memes.css';
import MemesData from '../Components/MemesData'; // Import meme data
import { toast } from 'react-toastify';
import {  doc, setDoc, updateDoc, increment, arrayUnion, getDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig'; // Firebase Firestore instance

// Modal for Sign-In Prompt
const SignInModal = ({ show, onClose }) => {
  if (!show) return null;
  return (
    <div className="sign-in-modal">
      <div className="modal-content">
        <h3>Please Sign In</h3>
        <p>You need to sign in to like, comment, or dislike memes!</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

function MemeCard({ meme, handleLike, handleDislike, handleComment, toggleComments, user }) {
  const [commentInput, setCommentInput] = useState('');

  const submitComment = () => {
    if (!user) {
      toast.error("⚠️ Please Sign In to Like, Dislike or Comment!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return; // Prevent further action if not signed in
    }

    if (commentInput.trim()) {
      handleComment(meme.id, commentInput.trim());
      setCommentInput('');
    }
  };

  return (
    <div className="meme-card">
      <img
        src={meme.image}
        alt={meme.title}
        style={{ width: '100%', borderRadius: '8px' }}
      />
      <h3>{meme.title}</h3>

      <div className="meme-actions">
        <button
          className={`like-button ${meme.liked ? 'liked' : ''}`}
          onClick={() => {
            if (!user) {
              toast.error("⚠️ Please Sign In to Like, Dislike or Comment!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
              });
              return; // Don't allow liking if not signed in
            }
            handleLike(meme.id);
          }}
        >
          ❤️ {meme.likes}
        </button>

        <button
          className={`dislike-button ${meme.disliked ? 'disliked' : ''}`}
          onClick={() => {
            if (!user) {
              toast.error("⚠️ Please Sign In to Like, Dislike or Comment!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: false,
                pauseOnHover: true,
                draggable: true,
                theme: "dark",
              });
              return; // Don't allow disliking if not signed in
            }
            handleDislike(meme.id);
          }}
        >
          💔 {meme.dislikes}
        </button>

        <button onClick={() => toggleComments(meme.id)}>
          💬 {meme.comments.length}
        </button>
      </div>

      {meme.showComments && (
        <div style={{ marginTop: '10px' }}>
          <h5>🗨️ Comments:</h5>
          {meme.comments.length === 0 && <p>No comments yet.</p>}
          <ul>
            {meme.comments.map((comment, index) => (
              <li key={index}>{comment}</li>
            ))}
          </ul>

          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Write a comment..."
          />
          <button onClick={submitComment}>Post</button>
        </div>
      )}
    </div>
  );
}

const Memes = ({ user }) => {
  const [memes, setMemes] = useState(MemesData.map((meme) => ({
    ...meme,
    liked: false,
    disliked: false,
    comments: [],
    showComments: false,
  })));
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState('newest'); // Default sort type
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLike = async (id) => {
    if (!user) {
      toast.error("⚠️ Please Sign In to Like, Dislike or Comment!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }

    const memeRef = doc(db, 'memes', id); // Reference to the meme in Firestore

    try {
      const memeDoc = await getDoc(memeRef);
      if (!memeDoc.exists()) {
        // If document doesn't exist, create it with default values
        await setDoc(memeRef, {
          likes: 1,
          dislikes: 0,
          comments: [],
        });
      } else {
        // If the document exists, just update it
        await updateDoc(memeRef, {
          likes: increment(1), // Increase the likes count
          disliked: false, // Reset dislike state
        });
      }

      setMemes(memes.map(meme =>
        meme.id === id
          ? { ...meme, likes: meme.likes + 1, disliked: false, liked: true }
          : meme
      ));
    } catch (error) {
      console.error("Error updating like:", error);
    }
  };

  const handleDislike = async (id) => {
    if (!user) {
      toast.error("⚠️ Please Sign In to Like, Dislike or Comment!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
      return;
    }

    const memeRef = doc(db, 'memes', id); // Reference to the meme in Firestore

    try {
      const memeDoc = await getDoc(memeRef);
      if (!memeDoc.exists()) {
        // If document doesn't exist, create it with default values
        await setDoc(memeRef, {
          likes: 0,
          dislikes: 1,
          comments: [],
        });
      } else {
        // If the document exists, just update it
        await updateDoc(memeRef, {
          dislikes: increment(1), // Increase the dislikes count
          liked: false, // Reset like state
        });
      }

      setMemes(memes.map(meme =>
        meme.id === id
          ? { ...meme, dislikes: meme.dislikes + 1, liked: false, disliked: true }
          : meme
      ));
    } catch (error) {
      console.error("Error updating dislike:", error);
    }
  };

  const handleComment = async (id, commentText) => {
    const memeRef = doc(db, 'memes', id); // Reference to the meme in Firestore

    try {
      const memeDoc = await getDoc(memeRef);
      if (!memeDoc.exists()) {
        // If document doesn't exist, create it with default values
        await setDoc(memeRef, {
          likes: 0,
          dislikes: 0,
          comments: [commentText],
        });
      } else {
        // If the document exists, just update it
        await updateDoc(memeRef, {
          comments: arrayUnion(commentText), // Add new comment to the array
        });
      }

      setMemes(memes.map(meme =>
        meme.id === id
          ? { ...meme, comments: [...meme.comments, commentText] }
          : meme
      ));
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const toggleComments = (id) => {
    setMemes(memes.map(meme =>
      meme.id === id
        ? { ...meme, showComments: !meme.showComments }
        : meme
    ));
  };

  const filteredMemes = memes.filter(meme =>
    meme.title.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    if (sortType === 'newest') return b.date - a.date;
    if (sortType === 'a-z') return a.title.localeCompare(b.title); // A-Z sorting
    return b.likes - a.likes; // Most Liked sorting
  });

  return (
    <div className="memes-container">
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder="Search memes..."
      />

      {/* Sorting Buttons */}
      <div className="sort-options">
        <button onClick={() => setSortType('a-z')}>A-Z</button>
        <button onClick={() => setSortType('most-liked')}>Most Liked</button>
        <button onClick={() => setSortType('newest')}>Most Recent</button>
      </div>

      <div className="memes-list">
        {filteredMemes.map((meme) => (
          <MemeCard
            key={meme.id}
            meme={meme}
            handleLike={handleLike}
            handleDislike={handleDislike}
            handleComment={handleComment}
            toggleComments={toggleComments}
            user={user}
          />
        ))}
      </div>

      <SignInModal show={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
};

export default Memes;
