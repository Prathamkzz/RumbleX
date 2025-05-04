// src/Components/OURPLEPAGES.js
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { pleData, matchesByPle } from './MatchesData';
import { Pie } from 'react-chartjs-2';

// Register Chart.js elements
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const OURPLEPAGES = () => {
  const { ple } = useParams();
  const matches = matchesByPle[ple] || [];
  const pleInfo = pleData.find((p) => p.id === ple);

  const generatePieData = (prediction) => {
    const labels = Object.keys(prediction);
    const data = Object.values(prediction);

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
      <h2 style={{ color: 'white' }}>Our Predictions for {pleInfo?.name}</h2>

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
            <div key={match.id} style={{ background: '#111', padding: '20px', borderRadius: '12px' }}>
              {/* Match Poster */}
              <Link to={`/match/${ple}/${match.id}`}>
                <img
                  src={match.poster}
                  alt={match.matchTitle}
                  style={{
                    width: '300px',
                    borderRadius: '10px',
                    marginBottom: '20px',
                    transition: 'transform 0.2s ease-in-out',
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                  onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />
              </Link>

              {/* Match Title */}
              <h3 style={{ color: 'white' }}>{match.matchTitle}</h3>

              {/* Prediction Pie Chart */}
              <div style={{ width: '260px', margin: 'auto', marginTop: '20px' }}>
                <Pie data={generatePieData(match.prediction)} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OURPLEPAGES;
