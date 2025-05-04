import React from 'react';
import { useParams } from 'react-router-dom';
import { matchesByPle } from './MatchesData';

const MatchDetails = () => {
  const { pleId, matchId } = useParams();
  const match = matchesByPle[pleId]?.find((m) => m.id === matchId);

  if (!match) return <p style={{ color: 'white' }}>❌ Match not found!</p>;

  return (
    <div style={{ color: 'white', padding: '30px', textAlign: 'center' }}>
      <h2>{match.matchTitle}</h2>
      <img src={match.poster} alt={match.matchTitle} style={{ width: '400px', borderRadius: '10px' }} />

      <h3 style={{ marginTop: '30px', color: 'red' }}>🔥 BACKSTORY 🔥</h3>
      <p>{match.backstory || "Backstory not available yet."}</p>

      <h3 style={{ marginTop: '30px', color: 'red' }}>🎯 Don't forget to cast your VOTE</h3>
      <ul style={{ listStyle: 'none', padding: 0 }}>
       
      </ul>
    </div>
  );
};

export default MatchDetails;
