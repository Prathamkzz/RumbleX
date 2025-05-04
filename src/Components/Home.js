import React from 'react';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import './Home.css'; // Your CSS file for Home component styling

const Home = () => {
  return (
    <div className="home-container">
      <h1>Welcome to Vortexo</h1>
      <p>This is the homepage. Choose a section from the navbar or URL!</p>

      {/* Featured Meme Section */}
      <div className="section">
        <h2>🔥 Featured Meme</h2>
        <Link to="/memes">
          <img
            src="/images/BG.jpg"
            alt="Featured Meme"
            style={{
              width: '90%',
              maxWidth: '600px',
              borderRadius: '20px',
              boxShadow: '0 8px 20px rgba(0,0,0,0.3)',
              cursor: 'pointer',
              transition: 'transform 0.3s ease',
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = 'scale(1.05)')}
            onMouseOut={(e) => (e.currentTarget.style.transform = 'scale(1)')}
          />
        </Link>
      </div>

      {/* Top WWE News Section */}
      <div className="section">
        <h2>📰 Top WWE News</h2>
        <Link to="/news">
          <img
            src="/images/CENA.jpg"
            alt="Top WWE News"
            style={{ borderRadius: '10px', width: '100%', maxWidth: '600px', marginBottom: '10px' }}
          />
          <p><strong>New direction for CENA</strong> — Tap to read!</p>
        </Link>
      </div>

      {/* Match Predictions Section */}
      <div className="section">
        <h2>🔮 Match Predictions</h2>
        <Link to="/predictions">
          <img
            src="/images/RVC.jpg"
            alt="Match Predictions"
            style={{ borderRadius: '10px', width: '100%', maxWidth: '600px', marginBottom: '10px' }}
          />
          <p>Who will win? Cody Rhodes vs Roman Reigns — Vote now!</p>
        </Link>
      </div>

      {/* Next WWE Show Section */}
      <div className="section">
        <h2>🕒 Next WWE Show</h2>
        <Link to="/show-timings">
          <img
            src="/images/123.webp"
            alt="WWE Show Timings"
            style={{ borderRadius: '10px', width: '100%', maxWidth: '600px', marginBottom: '10px' }}
          />
          <p>WWE Raw starts in: <strong>5h 42m</strong></p>
        </Link>
      </div>

      {/* Disclaimer */}
      <div style={{ marginTop: '60px', fontSize: '12px', color: '#888', textAlign: 'center' }}>
        <p>
          This website is a fan-made community platform for entertainment purposes only.
          We are not affiliated, associated, authorized, endorsed by, or in any way officially connected with WWE or any of its subsidiaries or affiliates.
        </p>
      </div>
    </div>
  );
};

export default Home;
