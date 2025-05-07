import React, { useState } from 'react';
import battlezoneMatches from '../Components/BattleZoneData';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './BattleZonePage.css';

const BattlezonePage = ({ isSignedIn }) => {
  const [votes, setVotes] = useState({});
  const [hasVoted, setHasVoted] = useState({});
  const iAdmin = false;

  const handleVote = (matchId, option) => {
    if (!isSignedIn) {
      toast.error('Please sign in to vote');
      return;
    }

    if (hasVoted[matchId]) {
      toast.warning('You already voted in this match');
      return;
    }

    const newVotes = { ...votes };
    if (!newVotes[matchId]) {
      newVotes[matchId] = { A: 0, B: 0 };
    }
    newVotes[matchId][option] += 1;

    setVotes(newVotes);
    setHasVoted({ ...hasVoted, [matchId]: true });
    toast.success('Vote counted!');
  };

  return (
    <div className="battlezone">
      {battlezoneMatches.map((match) => (
        <div className="match-card" key={match.id}>
          <h2>{match.title}</h2>
          <div className="options">
            <div
              className={`option ${hasVoted[match.id] ? 'voted' : ''}`}
              onClick={() => handleVote(match.id, 'A')}
            >
              <img src={match.imgA} alt={match.optionA} />
              <p>{match.optionA}</p>
              {iAdmin && <p>{votes[match.id]?.A || 0} Votes</p>}
            </div>
            <div
              className={`option ${hasVoted[match.id] ? 'voted' : ''}`}
              onClick={() => handleVote(match.id, 'B')}
            >
              <img src={match.imgB} alt={match.optionB} />
              <p>{match.optionB}</p>
              {iAdmin && <p>{votes[match.id]?.B || 0} Votes</p>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default BattlezonePage;
