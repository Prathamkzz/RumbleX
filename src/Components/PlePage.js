import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pleData, matchesByPle } from './MatchesData';
import { toast } from 'react-toastify';
import './CSS/MatchStyles.css';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const PlePage = ({ user }) => {
  const { ple } = useParams();
  const pleInfo = pleData.find((p) => p.id === ple);
  const matches = matchesByPle[ple] || [];

  const [votedMatches, setVotedMatches] = useState({});

  // Load vote history from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`votedMatches_${ple}`);
    try {
      const parsed = saved ? JSON.parse(saved) : {};
      setVotedMatches(parsed);
    } catch (err) {
      console.error("Broken localStorage data — cleared");
      localStorage.removeItem(`votedMatches_${ple}`);
      setVotedMatches({});
    }
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
  
    // Prevent double vote
    if (votedMatches[matchId] === true) {
      toast.warn("❗ You've already voted in this match!", {
        position: 'top-center',
        autoClose: 2500,
        theme: 'colored',
      });
      return;
    }
  
    // Update localStorage
    const updated = { ...votedMatches, [matchId]: true };
    localStorage.setItem(`votedMatches_${ple}`, JSON.stringify(updated));
    setVotedMatches(updated);
  
    // --- Award 5 pops for this unique vote ---
    try {
      const userRef = doc(db, 'users', user.uid);
      const userSnap = await getDoc(userRef);
      let pops = userSnap.exists() && userSnap.data().pops ? userSnap.data().pops : 0;
      let votedPredictionPolls = userSnap.exists() && userSnap.data().votedPredictionPolls ? userSnap.data().votedPredictionPolls : [];
      if (!votedPredictionPolls.includes(matchId)) {
        votedPredictionPolls.push(matchId);
        pops += 5;
        await setDoc(userRef, {
          pops,
          votedPredictionPolls
        }, { merge: true });
        toast.info("Wow, you've earned 5 pop(s)!", {
          position: "top-center",
          autoClose: 2500,
          theme: "colored",
        });
      }
    } catch (err) {
      // Optional: handle error
    }
    // --- End pops awarding ---
  
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
        <p style={{ color: '#ccc' }}>
          😔 Oops! Matches for this PLE aren't announced yet.
        </p>
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
          {matches.map((match) => {
            const hasVoted = votedMatches[match.id] === true;

            return (
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

                {pleInfo?.isPast ? (
                  <div
                    style={{
                      marginTop: '20px',
                      backgroundColor: '#1e1e1e',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #444',
                      color: '#f44',
                      fontSize: '15px',
                      fontWeight: '600'
                    }}
                  >
                    🛑 Poll is finished now
                  </div>
                ) : (
                  !hasVoted ? (
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
                    <div style={{
                      marginTop: '20px',
                      backgroundColor: '#1e1e1e',
                      padding: '12px',
                      borderRadius: '8px',
                      border: '1px solid #444',
                      color: '#0f0',
                      fontSize: '15px',
                      fontWeight: '600'
                    }}>
                      ✅ Voted — Now See Our Predictions
                    </div>
                  )
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default PlePage;
