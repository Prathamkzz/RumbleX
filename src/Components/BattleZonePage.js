import React, { useEffect, useState } from 'react';
import './BattleZonePage.css';
import battleZoneMatches from './BattleZoneData';
import { toast } from 'react-toastify';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, getDoc, updateDoc, collection, getDocs } from 'firebase/firestore';

const BattlezonePage = () => {
  const [votes, setVotes] = useState({});
  const [votedMatches, setVotedMatches] = useState({});
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);
  const db = getFirestore();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserSignedIn(!!user);
    });

    const fetchVotes = async () => {
      const matchVotesSnapshot = await getDocs(collection(db, 'votes', 'battlezone', 'matches'));
      const newVotes = {};
      matchVotesSnapshot.forEach((docSnap) => {
        newVotes[docSnap.id] = docSnap.data();
      });
      setVotes(newVotes);
    };

    fetchVotes();

    const savedVotedMatches = JSON.parse(localStorage.getItem('voted_battlezone')) || {};
    setVotedMatches(savedVotedMatches);

    return () => unsubscribe();
  }, [db]);

  const handleVote = async (matchId, option, wrestler) => {
    if (!isUserSignedIn) {
      toast.error("⚠️ Please Sign In to Vote!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    if (votedMatches[matchId]) {
      return;
    }

    try {
      const matchRef = doc(db, 'votes', 'battlezone', 'matches', matchId);
      const matchSnap = await getDoc(matchRef);

      if (!matchSnap.exists()) {
        toast.error("Match data not found!");
        return;
      }

      const matchData = matchSnap.data();
      matchData[option] = (matchData[option] || 0) + 1;

      await updateDoc(matchRef, matchData);

      const updatedVotes = { ...votes, [matchId]: matchData };
      const updatedVotedMatches = { ...votedMatches, [matchId]: true };

      setVotes(updatedVotes);
      setVotedMatches(updatedVotedMatches);
      localStorage.setItem('voted_battlezone', JSON.stringify(updatedVotedMatches));

      toast.success(`🎉 You voted for ${wrestler}!`, {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
    } catch (error) {
      console.error("Error voting:", error);
      toast.error("Something went wrong!");
    }
  };

  const getLeaderboard = () => {
    const wrestlerVotes = {};

    Object.entries(votes).forEach(([matchId, matchVotes]) => {
      const match = battleZoneMatches.find(m => m.id === matchId);
      if (!match) return;

      if (matchVotes.A) {
        wrestlerVotes[match.optionA] = (wrestlerVotes[match.optionA] || 0) + matchVotes.A;
      }
      if (matchVotes.B) {
        wrestlerVotes[match.optionB] = (wrestlerVotes[match.optionB] || 0) + matchVotes.B;
      }
    });

    return Object.entries(wrestlerVotes)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  };

  const top3 = getLeaderboard();

  return (
    <div className="battlezone-container">
      <h2>WWE FAN BATTLEZONE</h2>
      <p>Vote for your favorites!</p>

      {battleZoneMatches.map((match) => (
        <div key={match.id} className="match-card">
          <h3>{match.title}</h3>
          {!votedMatches[match.id] ? (
            <div className="vote-row">
              <div>
                <img src={match.imgA} alt={match.optionA} />
                <button onClick={() => handleVote(match.id, 'A', match.optionA)}>Vote {match.optionA}</button>
              </div>
              <div>
                <img src={match.imgB} alt={match.optionB} />
                <button onClick={() => handleVote(match.id, 'B', match.optionB)}>Vote {match.optionB}</button>
              </div>
            </div>
          ) : (
            <div className="vote-results">
              <p>✅ You voted in this match</p>
            </div>
          )}
        </div>
      ))}

      <div className="leaderboard">
        <h3>🏆 LEADERBOARD</h3>
        <ol>
          {top3.map(([name, votes], index) => (
            <li key={index}>{name} — {votes} votes</li>
          ))}
        </ol>
      </div>
    </div>
  );
};

export default BattlezonePage;
