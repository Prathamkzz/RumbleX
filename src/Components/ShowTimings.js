import React from 'react';
import './CSS/ShowTimings.css'; // Import the CSS file
import moment from 'moment-timezone'; // Import moment-timezone
import { formatDate } from '../utils/utils'; // Adjusted path to 'src/utils/utils.js'
import CountdownTimer from './CountDownTimer'; // Import your CountdownTimer component

// Helper function to convert IST to ET (U.S. Eastern Time)
const convertToET = (indiaTime) => {
  return moment.tz(indiaTime, 'Asia/Kolkata').clone().tz('America/New_York').format('YYYY-MM-DDTHH:mm:ss');
};

const showTimings = [
  {
    show: 'RAW',
    indiaTime: '2025-05-20T05:30:00', 
    image: '/images/123.webp',
  },
  {
    show: 'SmackDown',
    indiaTime: '2025-05-17T05:30:00',
    image: '/images/SD.avif',
  },
  {
    show: 'NXT',
    indiaTime: '2025-05-15T05:30:00',
    image: '/images/NXT.jpg',
  },
  {
    show: 'MITB',
    indiaTime: '2025-06-08T04:30:00',
    image: '/images/MITB.webp',
  },
];

const ShowTimings = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '40px' }}>
      <h2 style={{ color: 'white' }}>🕒 WWE Show Timings</h2>

      <div className="show-timings-grid">
        {showTimings.map((show) => (
          <div key={show.show} className="show-card">
            <img src={show.image} alt={show.show} />
            <h3>{show.show}</h3>
            
            <p>🇮🇳 {formatDate(show.indiaTime)} (IST)</p>
            <p>🇺🇸 {formatDate(convertToET(show.indiaTime))} (ET)</p>

            {/* Countdown Timer for each event */}
            <CountdownTimer targetDate={show.indiaTime} />

          </div>
        ))}
      </div>

      <p className="disclaimer">
        ⏰ All timings are approximate. Check your local listings.
      </p>
    </div>
  );
};

export default ShowTimings;
