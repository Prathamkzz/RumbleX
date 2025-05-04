import React, { useState, useEffect } from 'react';

// ✅ calculateTimeLeft OUTSIDE the component
const calculateTimeLeft = (targetDate) => {
  const difference = +new Date(targetDate) - +new Date();
  if (difference <= 0) {
    return null;
  }
  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((difference / 1000 / 60) % 60),
    seconds: Math.floor((difference / 1000) % 60),
  };
};

const CountdownTimer = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(() => calculateTimeLeft(targetDate));

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);
    return () => clearInterval(timer);
  }, [targetDate]);

  if (!timeLeft) {
    return <div>🎉 The event has started!</div>;
  }

  return (
    <div>
      {/* Make the "Time Left:" text white */}
      <h4 style={{ color: 'white' }}>⏳ Time Left:</h4> 
      <p style={{ fontWeight: 'bold' }}>
        {`${timeLeft.days}d ${timeLeft.hours}h ${timeLeft.minutes}m ${timeLeft.seconds}s`}
      </p>
    </div>
  );
  
};

export default CountdownTimer;
