import React, { useState, useEffect } from 'react';

export default function InactivePLE() {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const eventDate = new Date('2025-05-11T04:30:00');
    const interval = setInterval(() => {
      const now = new Date();
      const difference = eventDate - now;
      if (difference <= 0) {
        clearInterval(interval);
        setTimeLeft('Event is LIVE!');
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);
        setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        textAlign: 'center',
        padding: '30px',
        color: '#fff',
        background: 'linear-gradient(to right, #1e1e2f, #2a2a40)',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Orbitron', sans-serif"
      }}
    >
      <h2 style={{ fontSize: '2rem', marginBottom: '15px' }}>Backlash isn't live now.</h2>

      <img
        src="/images/Backlash.jpg"
        alt="Event Poster"
        style={{
          width: '100%',
          maxWidth: '450px',
          marginBottom: '25px',
          borderRadius: '12px',
          boxShadow: '0 8px 16px rgba(0,0,0,0.3)'
        }}
      />

      <h3 style={{ fontSize: '1.7rem', marginBottom: '10px' }}>Event Countdown</h3>
      <p
        style={{
          fontSize: '2rem',
          fontWeight: 'bold',
          background: 'linear-gradient(to right, #ff416c, #ff4b2b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transition: 'all 0.3s ease'
        }}
      >
        {timeLeft}
      </p>
    </div>
  );
}

