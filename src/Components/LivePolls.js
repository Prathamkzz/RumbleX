import React, { useState } from 'react';

const LivePoll = () => {
  const [pollResults, setPollResults] = useState({
    championVotes: 0,
    surpriseReturnVotes: 0,
  });

  const handleVote = (pollType) => {
    setPollResults({
      ...pollResults,
      [pollType]: pollResults[pollType] + 1,
    });
    // You would also send this updated vote to the backend (e.g., Firebase) here
  };

  return (
    <div>
      <button onClick={() => handleVote('championVotes')}>Champion Vote</button>
      <button onClick={() => handleVote('surpriseReturnVotes')}>Surprise Return Vote</button>
      <p>Champion Vote: {pollResults.championVotes}</p>
      <p>Surprise Return Vote: {pollResults.surpriseReturnVotes}</p>
    </div>
  );
};

export default LivePoll;
