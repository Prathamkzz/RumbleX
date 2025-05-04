// VoteHub.js
import React from 'react';
import { Link } from 'react-router-dom';
import { pleData } from './MatchesData';

const VoteHub = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2 style={{ color: 'white' }}>🗳️ Vote Yourself</h2>
      <p style={{ color: '#ccc' }}>Select a PLE to start voting!</p>

      <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '30px', marginTop: '30px' }}>
        {pleData.map((ple) => (
          <div key={ple.id}>
            <Link to={`/predictions/vote/${ple.id}`}>
              <img
                src={ple.image}
                alt={ple.name}
                style={{
                  width: '280px',
                  borderRadius: '10px',
                  boxShadow: '0 0 10px rgba(255,255,255,0.2)',
                  transition: 'transform 0.2s',
                }}
                onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.03)')}
                onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              />
            </Link>
            <h3 style={{ marginTop: '10px', color: 'white' }}>{ple.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default VoteHub;
