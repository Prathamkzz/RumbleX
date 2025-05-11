import React, { useState, useEffect } from 'react';
import './InactivePle.css';

export default function InactivePLE() {
  const [timeLeft, setTimeLeft] = useState(null);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    const eventDate = new Date('2025-06-08T04:30:00');
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

  const handleNotify = () => {
    setNotified(true);
    setTimeout(() => setNotified(false), 3000);
  };

  return (
    <div className="inactive-ple-bg">
      <h2 className="inactive-ple-title">MITB isn't live now.</h2>

      <img
        src="/images/MITB.webp"
        alt="Event Poster"
        className="inactive-ple-poster"
      />

      <h3 className="inactive-ple-countdown-title">Event Countdown</h3>
      <p className="inactive-ple-countdown">{timeLeft}</p>

      <button
        onClick={handleNotify}
        disabled={notified}
        className="inactive-ple-notify-btn"
      >
        {notified ? 'You will be notified!' : '🔔 Notify Me When Live'}
      </button>

      <div className="inactive-ple-details">
        <h3>Event Details</h3>
        <ul>
          <li><b>Date:</b> June 8, 2025</li>
          <li><b>Start Time:</b> 4:30 AM IST</li>
          <li><b>Location:</b>Intuit Dome, Inglewood, California.</li>
          <li><b>How to Watch:</b> Peacock (US), Netflix (India), Netflix (Intl)</li>
          <li><b>Hashtag:</b> #MITB2025</li>
        </ul>
      </div>
    </div>
  );
}

