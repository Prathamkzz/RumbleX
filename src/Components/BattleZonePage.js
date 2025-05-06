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
      setIsUserSignedIn(!!user);
    });

    const savedVotes = JSON.parse(localStorage.getItem('votes_battlezone')) || {};
    const savedVotedMatches = JSON.parse(localStorage.getItem('voted_battlezone')) || {};
    setVotes(savedVotes);
    setVotedMatches(savedVotedMatches);

    return () => unsubscribe();
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

    if (votedMatches[matchId]) return;

    const updatedVotes = { ...votes };
    const updatedVotedMatches = { ...votedMatches };

    if (!updatedVotes[matchId]) {
      updatedVotes[matchId] = { A: 0, B: 0 };
    }

    updatedVotes[matchId][option]++;
    updatedVotedMatches[matchId] = option;

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

  const getVotePercentages = (matchId) => {
    const matchVotes = votes[matchId];
    if (!matchVotes) return { A: 0, B: 0 };

    const totalVotes = matchVotes.A + matchVotes.B;
    const percentageA = totalVotes > 0 ? (matchVotes.A / totalVotes) * 100 : 0;
    const percentageB = totalVotes > 0 ? (matchVotes.B / totalVotes) * 100 : 0;

    return { A: percentageA, B: percentageB };
  };

  return (
    <div className="battlezone-container">
      <h2>WWE FAN BATTLEZONE</h2>
      <p>Vote for your favorites!</p>

      {battleZoneMatches.map((match) => {
        const percentages = getVotePercentages(match.id);
        const userVote = votedMatches[match.id];

        return (
          <div key={match.id} className="match-card">
            <h3>{match.title}</h3>
            <div className="vote-row">
              <div>
                <img src={match.imgA} alt={match.optionA} />
                <button
                  onClick={() => handleVote(match.id, 'A', match.optionA)}
                  disabled={!!userVote}
                >
                  Vote {match.optionA}
                </button>
              </div>
              <div>
                <img src={match.imgB} alt={match.optionB} />
                <button
                  onClick={() => handleVote(match.id, 'B', match.optionB)}
                  disabled={!!userVote}
                >
                  Vote {match.optionB}
                </button>
              </div>
            </div>

            {userVote && (
              <div className="vote-results">
                <h4>Results:</h4>
                <div className="vote-percentages">
                  <div className={`vote-option ${userVote === 'A' ? 'voted' : ''}`}>
                    <p>{match.optionA}</p>
                    <div className="percentage-bar">
                      <div className="filled" style={{ width: `${percentages.A}%` }} />
                    </div>
                    <span>{percentages.A.toFixed(1)}%</span>
                  </div>

                  <div className={`vote-option ${userVote === 'B' ? 'voted' : ''}`}>
                    <p>{match.optionB}</p>
                    <div className="percentage-bar">
                      <div className="filled" style={{ width: `${percentages.B}%` }} />
                    </div>
                    <span>{percentages.B.toFixed(1)}%</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default BattlezonePage;
