import React from 'react';
import { Link } from 'react-router-dom';

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div
      style={{
        width: '250px',
        height: '100vh',
        background: '#202123',
        position: 'fixed',
        top: 0,
        left: isOpen ? 0 : '-250px',
        transition: 'left 0.3s ease',
        zIndex: 999,
        color: 'white',
        padding: '20px'
      }}
    >
      <h4>Sidebar Menu</h4>
      <ul>
        <li><Link to="/" onClick={toggleSidebar}>Home</Link></li>
        <li><Link to="/memes" onClick={toggleSidebar}>Memes</Link></li>
        <li><Link to="/predictions" onClick={toggleSidebar}>Predictions</Link></li>
        <li><Link to="/show-timings" onClick={toggleSidebar}>Show Timings</Link></li>
        <li><Link to="/news" onClick={toggleSidebar}>News</Link></li>
        <li><Link to="/battlezone" onClick={toggleSidebar}>Fan Battlezone</Link></li>
        <li><Link to="/about" onClick={toggleSidebar}>About</Link></li>
        <li><Link to="/disclaimer" onClick={toggleSidebar}>Disclaimer</Link></li>
      </ul>
    </div>
  );
}

export default Sidebar;
