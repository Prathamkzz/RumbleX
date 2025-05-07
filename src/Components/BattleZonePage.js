import React, { useEffect, useState } from 'react';
import './BattleZonePage.css';

import battleZoneMatches from './BattleZoneData';
import { toast } from 'react-toastify';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { db } from '../firebaseConfig';
import {
  doc,
  updateDoc,
  getDoc,
  setDoc,
  collection,
  increment,
} from 'firebase/firestore';

const BattlezonePage = () => {
  const [votes, setVotes] = useState({});
  const [votedMatches, setVotedMatches] = useState({});
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setIsUserSignedIn(!!user);

      const savedVotes = JSON.parse(localStorage.getItem('votes_battlezone')) || {};
      const savedVotedMatches = JSON.parse(localStorage.getItem('voted_battlezone')) || {};
      setVotes(savedVotes);
      let updatedVotedMatches = { ...savedVotedMatches };

      if (user) {
        const userId = user.uid;

        // Check Firestore for each match if user has voted
        for (const match of battleZoneMatches) {
          const matchRef = doc(db, 'votes_battlezone_matches', match.id);
          const votedUsersRef = collection(matchRef, 'votedUsers');
          const userVoteDoc = doc(votedUsersRef, userId);
          const snapshot = await getDoc(userVoteDoc);

          if (snapshot.exists()) {
            updatedVotedMatches[match.id] = true;
          }
        }

        setVotedMatches(updatedVotedMatches);
        localStorage.setItem('voted_battlezone', JSON.stringify(updatedVotedMatches));
      }
    });

    return () => unsubscribe();
  }, []);

  const handleVote = async (matchId, option, match) => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      toast.error("⚠️ Please Sign In to Vote!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    const userId = user.uid;
    const matchRef = doc(db, 'votes_battlezone_matches', matchId);
    const votedUsersRef = collection(matchRef, 'votedUsers');
    const userVoteDoc = doc(votedUsersRef, userId);

    const userVoteSnapshot = await getDoc(userVoteDoc);
    if (userVoteSnapshot.exists()) {
      toast.error("⚠️ You have already voted!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    // Ensure the match document exists first
    await setDoc(
      matchRef,
      {
        optionA: match.optionA,
        optionB: match.optionB,
        A: 0,
        B: 0,
        title: match.title,
        timestamp: new Date(),
      },
      { merge: true }
    );

    // Increment the selected vote
    await updateDoc(matchRef, {
      [option]: increment(1),
    });

    // Mark user as voted
    await setDoc(userVoteDoc, { voted: true });

    // Update UI and localStorage
    setVotes((prevVotes) => {
      const updatedVotes = { ...prevVotes };
      if (!updatedVotes[matchId]) {
        updatedVotes[matchId] = { A: 0, B: 0 };
      }
      updatedVotes[matchId][option]++;
      localStorage.setItem('votes_battlezone', JSON.stringify(updatedVotes));
      return updatedVotes;
    });

    setVotedMatches((prevVotedMatches) => {
      const updatedVotedMatches = { ...prevVotedMatches, [matchId]: true };
      localStorage.setItem('voted_battlezone', JSON.stringify(updatedVotedMatches));
      return updatedVotedMatches;
    });

    const votedOption = option === 'A' ? match.optionA : match.optionB;
    toast.success(`🎉 You voted for ${votedOption}!`, {
      position: "top-center",
      autoClose: 2500,
      theme: "colored",
    });
  };

  return (
    <div className="battlezone">
      <h2>WWE FAN BATTLEZONE</h2>
      <p>Vote for your favorites!</p>

      {battleZoneMatches.map((match) => (
        <div key={match.id} className="match-card">
          <h3>{match.title}</h3>
          <div className="options">
            <div
              className={`option ${votedMatches[match.id] ? 'voted' : ''}`}
              onClick={() => handleVote(match.id, 'A', match)}
            >
              <img src={match.imgA} alt={match.optionA} />
              <p>{match.optionA}</p>
            </div>
            <div
              className={`option ${votedMatches[match.id] ? 'voted' : ''}`}
              onClick={() => handleVote(match.id, 'B', match)}
            >
              <img src={match.imgB} alt={match.optionB} />
              <p>{match.optionB}</p>
            </div>
          </div>
          {votedMatches[match.id] && (
            <div className="vote-results">
              <p>✅ You have already voted!</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default BattlezonePage;
