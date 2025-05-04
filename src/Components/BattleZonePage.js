import React, { useEffect, useState } from 'react';
import './BattleZonePage.css';
import battleZoneMatches from './BattleZoneData';
import { toast } from 'react-toastify';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const BattlezonePage = () => {
  const [votes, setVotes] = useState({});
  const [votedMatches, setVotedMatches] = useState({});
  const [isUserSignedIn, setIsUserSignedIn] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsUserSignedIn(!!user); // true if user exists
    });

    const savedVotes = JSON.parse(localStorage.getItem('votes_battlezone')) || {};
    const savedVotedMatches = JSON.parse(localStorage.getItem('voted_battlezone')) || {};
    setVotes(savedVotes);
    setVotedMatches(savedVotedMatches);

    return () => unsubscribe(); // clean up
  }, []);

  const handleVote = (matchId, option, wrestler) => {
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

    const updatedVotes = { ...votes };
    const updatedVotedMatches = { ...votedMatches };

    if (!updatedVotes[matchId]) {
      updatedVotes[matchId] = { A: 0, B: 0 };
    }

    updatedVotes[matchId][option]++;
    updatedVotedMatches[matchId] = true;

    setVotes(updatedVotes);
    setVotedMatches(updatedVotedMatches);

    localStorage.setItem('votes_battlezone', JSON.stringify(updatedVotes));
    localStorage.setItem('voted_battlezone', JSON.stringify(updatedVotedMatches));

    toast.success(`🎉 You voted for ${wrestler}!`, {
      position: "top-center",
      autoClose: 2500,
      theme: "colored",
    });
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
              <p>{match.optionA}: Voted</p>
              <p>{match.optionB}: Voted</p>
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
