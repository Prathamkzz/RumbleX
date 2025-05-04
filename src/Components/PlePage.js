import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { pleData, matchesByPle } from './MatchesData';
import { Pie } from 'react-chartjs-2';
import { toast } from 'react-toastify';
import './CSS/MatchStyles.css';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { db } from '../firebaseConfig'; // adjust path as needed
import {
  doc,
  setDoc,
  increment,
  onSnapshot,

} from 'firebase/firestore';

ChartJS.register(ArcElement, Tooltip, Legend);

const PlePage = ({ user }) => {
  const { ple } = useParams();
  const pleInfo = pleData.find((p) => p.id === ple);

  // Memoize the matches calculation
  const matches = useMemo(() => matchesByPle[ple] || [], [ple]);

  const [votes, setVotes] = useState({});
  const [votedMatches, setVotedMatches] = useState({});

  // Load votes live from Firestore
  useEffect(() => {
    const unsubscribes = [];

    matches.forEach((match) => {
      const matchRef = doc(db, "votes", ple, "matches", match.id);
      const unsubscribe = onSnapshot(matchRef, (docSnap) => {
        if (docSnap.exists()) {
          setVotes(prev => ({
            ...prev,
            [match.id]: docSnap.data()
          }));
        }
      });
      unsubscribes.push(unsubscribe);
    });

    return () => unsubscribes.forEach(unsub => unsub());
  }, [ple, matches]);

  const handleVote = async (matchId, wrestler) => {
    if (!user) {
      toast.error("⚠️ Please Sign In to Vote!", {
        position: "top-center",
        autoClose: 3000,
        theme: "dark",
      });
      return;
    }

    if (votedMatches[matchId]) {
      toast.warn("❗ You've already voted in this match!", {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
      return;
    }

    const matchRef = doc(db, "votes", ple, "matches", matchId);

    try {
      await setDoc(matchRef, { [wrestler]: increment(1) }, { merge: true });

      setVotedMatches((prev) => {
        const updated = { ...prev, [matchId]: true };
        localStorage.setItem(`votedMatches_${ple}`, JSON.stringify(updated));
        return updated;
      });

      toast.success(`🎉 You voted for ${wrestler}!`, {
        position: "top-center",
        autoClose: 2500,
        theme: "colored",
      });
    } catch (err) {
      console.error("Error voting:", err);
      toast.error("⚠️ Failed to vote. Try again.", {
        position: "top-center",
        autoClose: 2500,
        theme: "dark",
      });
    }
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem(`votedMatches_${ple}`)) || {};
    setVotedMatches(saved);
  }, [ple]);

  const generatePieData = (matchVotes) => {
    const labels = Object.keys(matchVotes);
    const data = Object.values(matchVotes);

    return {
      labels,
      datasets: [
        {
          data,
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        },
      ],
    };
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
                <div style={{ width: '260px', margin: 'auto', marginTop: '30px' }}>
                  <Pie data={generatePieData(votes[match.id] || {})} />
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
