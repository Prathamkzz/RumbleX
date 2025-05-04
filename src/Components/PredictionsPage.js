// src/Components/PredictionsPage.js
import React from 'react';
import { Link } from 'react-router-dom';

const PredictionsPage = () => {
  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2 style={{ color: 'white' }}>What would you like to do?</h2>

      {/* Vote Yourself Button */}
      <div style={{ margin: '20px' }}>
        <Link to="/predictions/votehub">
          <button style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            🗳️ Vote Yourself
          </button>
        </Link>
      </div>

      {/* See Our Predictions Button */}
      <div style={{ margin: '20px' }}>
        <Link to="/our-predictions">
          <button style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
            📊  Our Prediction
          </button>
        </Link>
      </div>
    </div>
  );
};

export default PredictionsPage;
