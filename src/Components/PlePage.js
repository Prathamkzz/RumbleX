import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pleData, matchesByPle } from './MatchesData'; // Import static data
import { toast } from 'react-toastify';
import './CSS/MatchStyles.css';

const PlePage = ({ user }) => {
  const { ple } = useParams();
  const pleInfo = pleData.find((p) => p.id === ple);

  // Matches are loaded directly from the static data
  const matches = useMemo(() => matchesByPle[ple] || [], [ple]);

  const [votedMatches, setVotedMatches] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`votedMatches_${ple}`)) || {};
    setVotedMatches(saved);
  }, [ple]);

  const handleVote = async (matchId, wrestler) => {
    if (!user) {
      toast.error('⚠️ Please Sign In to Vote!', {
        position: 'top-center',
        autoClose: 3000,
        theme: 'dark',
      });
      return;
    }

    if (votedMatches[matchId]) {
      toast.warn("❗ You've already voted in this match!", {
        position: 'top-center',
        autoClose: 2500,
        theme: 'colored',
      });
      return;
    }

    setVotedMatches((prev) => {
      const updated = { ...prev, [matchId]: true };
      localStorage.setItem(`votedMatches_${ple}`, JSON.stringify(updated));
      return updated;
    });

    toast.success(`🎉 You voted for ${wrestler}!`, {
      position: 'top-center',
      autoClose: 2500,
      theme: 'colored',
    });
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h2 style={{ color: 'white', marginBottom: '20px' }}>{pleInfo?.name}</h2>

      {matches.length === 0 ? (
        <p style={{ color: '#ccc' }}>😔 Oops! Matches for this PLE aren't announced yet.</p>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '40px',
            justifyItems: 'center',
            padding: '40px',
          }}
        >
          {matches.map((match) => (
            <div
              key={match.id}
              style={{
                background: '#111',
                padding: '20px',
                borderRadius: '12px',
                maxWidth: '400px',
                width: '100%',
              }}
            >
              <Link to={`/match/${ple}/${match.id}`}>
                <img
                  src={match.poster}
                  alt={match.matchTitle}
                  className="match-poster"
                />
              </Link>

              <h3 style={{ color: 'white', marginTop: '10px' }}>{match.matchTitle}</h3>

              {!votedMatches[match.id] ? (
                <div style={{ marginTop: '20px' }}>
                  {Object.keys(match.prediction).map((wrestler) => (
                    <div
                      key={wrestler}
                      className="poll-card"
                      onClick={() => handleVote(match.id, wrestler)}
                    >
                      <img
                        src={match.wrestlerImages?.[wrestler]}
                        alt={wrestler}
                        className="poll-image"
                      />
                      <span className="poll-text">{wrestler}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ marginTop: '30px' }}>
                  <Link to={`/our-predictions/${ple}`} style={{ color: '#36A2EB', textDecoration: 'none', fontWeight: 'bold' }}>
                    ✅ Voted — Now See Our Predictions
                  </Link>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PlePage;
