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
  increment,
} from 'firebase/firestore';

const BattlezonePage = () => {
  const [votedMatches, setVotedMatches] = useState({});
  const [currentUser, setCurrentUser] = useState(null);
  

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      const savedVotedMatches = JSON.parse(localStorage.getItem('voted_battlezone')) || {};
      let updatedVotedMatches = { ...savedVotedMatches };

      if (user) {
        const userId = user.uid;

        for (const match of battleZoneMatches) {
          const userVoteDoc = doc(db, `votes_battlezone_matches/${match.id}/votedUsers`, userId);
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
    const userVoteDoc = doc(matchRef, 'votedUsers', userId);
    const userVoteSnapshot = await getDoc(userVoteDoc);
  
    if (userVoteSnapshot.exists()) {
      toast.error("⚠️ You have already voted!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }
  
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
  
    await updateDoc(matchRef, {
      [option]: increment(1),
    });
  
    await setDoc(userVoteDoc, { voted: true });
  
    // --- Award 5 pops for this unique vote ---
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    let pops = userSnap.exists() && userSnap.data().pops ? userSnap.data().pops : 0;
    let votedBattlezonePolls = userSnap.exists() && userSnap.data().votedBattlezonePolls ? userSnap.data().votedBattlezonePolls : [];
    if (!votedBattlezonePolls.includes(matchId)) {
      votedBattlezonePolls.push(matchId);
      pops += 5;
      await setDoc(userRef, {
        pops,
        votedBattlezonePolls
      }, { merge: true });
      toast.info("Wow, you've earned 5 pop(s)!", {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
    }
    // --- End pops awarding ---
  
    setVotedMatches((prev) => {
      const updated = { ...prev, [matchId]: true };
      localStorage.setItem('voted_battlezone', JSON.stringify(updated));
      return updated;
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

      {!currentUser && <div>Please sign in to vote!</div>}

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

          {/* Removed the vote display for admin */}
        </div>
      ))}
    </div>
  );
};

export default BattlezonePage;
