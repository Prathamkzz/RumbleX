import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseConfig';
import SignInModal from './Components/SignInModal';
import './Components/CSS/App.css';
import VoteHub from './Components/VoteHub';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import MatchDetails from './Components/MatchDetails';
import BattlezonePage from './Components/BattleZonePage';
import News from './Components/News';
import NewsArticle from './Components/NewsArticle';
import NewsDetail from './Components/NewsDetail';
import Profile from './Components/Profile';
import PredictionsPage from './Components/PredictionsPage';
import OurPredictionsHub from './Components/OurPredictionsHub';
import PlePage from './Components/PlePage';
import OURPLEPAGES from './Components/OURPLEPAGES';
import ShowTimings from './Components/ShowTimings';
import Sidebar from './Components/Sidebar';
import LivePlePage from './Components/LivePlePage';
import PleLiveDashboard from './Components/PleLiveDashboard';
import TestYourselfRing from './Components/TestYourselfRing';

// XP/Level helpers
function getLevel(xp) {
  let level = 1;
  let xpNeeded = 20;
  let remainingXP = xp;
  while (remainingXP >= xpNeeded) {
    level++;
    remainingXP -= xpNeeded;
    xpNeeded = Math.floor(xpNeeded * 1.5);
  }
  return level;
}

function getXPForNextLevel(level) {
  let xpNeeded = 20;
  for (let i = 1; i < level; i++) {
    xpNeeded = Math.floor(xpNeeded * 1.5);
  }
  return xpNeeded;
}

function getXPIntoLevel(xp) {
  let xpNeeded = 20;
  let remainingXP = xp;
  while (remainingXP >= xpNeeded) {
    remainingXP -= xpNeeded;
    xpNeeded = Math.floor(xpNeeded * 1.5);
  }
  return remainingXP;
}

function Home({ pops, level }) {
  return (
    <div>
      <Sidebar pops={pops} level={level} />
      <Link to="/" style={{ textDecoration: "none" }}>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <img src="/images/RX.png" alt="RumbleX Logo" style={{ height: "80px", marginBottom: "10px" }} />
        </div>
      </Link>
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>Welcome to RumbleX 👋</h2>
      <section id="top-wwe-news">
        <h2>📰 Top WWE News</h2>
        <Link to="/news">
          <img src="/images/NEWS.jpg" alt="Top WWE News" style={{ width: "100%", maxWidth: "600px", cursor: "pointer" }} />
          <p><strong>Breaking News: Latest WWE Updates and Surprises Unfolding!</strong></p>
        </Link>
      </section>
      <section id="match-predictions">
        <h2>🔮 Match Predictions</h2>
        <Link to="/predictions">
          <img src="/images/MITB.webp" alt="Match Predictions" style={{ width: "100%", maxWidth: "600px", cursor: "pointer" }} />
          <p>Who will have the opportunity of a LIFE time?!</p>
        </Link>
      </section>
      <section id="next-wwe-show">
        <h2>🕒 Next WWE Show</h2>
        <Link to="/show-timings">
          <img src="/images/123.webp" alt="Next WWE Show" style={{ width: "100%", maxWidth: "600px", cursor: "pointer" }} />
          <p>WWE Raw starts in: <strong>(TAP TO KNOW)</strong></p>
        </Link>
      </section>
      <section className="home-section">
        <h2>🔴 Live PLEs</h2>
        <Link to="/live-ples">
          <img src="/images/MITB.webp" alt="Live PLEs" style={{ width: "100%", maxWidth: "600px", cursor: "pointer" }} />
        </Link>
        <Link to="/live-ples" className="home-section-link">
          Go to Live PLEs
        </Link>
      </section>
      <section className="home-section">
        <h2>⚔️ Fan Battlezone</h2>
        <Link to="/battlezone">
          <img src="/images/21.jpg" alt="BattleZone" style={{ width: "100%", maxWidth: "600px", cursor: "pointer" }} />
        </Link>
        <Link to="/battlezone" className="home-section-link">
          Enter Battlezone
        </Link>
      </section>
    </div>
  );
}

function About() {
  return (
    <div>
      <section className="about-section">
        <h2>About Us</h2>
        <p>
          Welcome to <strong>RUMBLEX</strong> – We’re a community-powered hub made by fans, for fans of WWE. From live match reactions to polls, fan predictions, memes, and even a career mode fantasy journey—our goal is to turn your WWE obsession into an interactive experience.
        </p>
        <ul>
          <li>🔥 React in real-time</li>
          <li>🗣️ Chat with other fans live</li>
          <li>🧠 Vote on match polls</li>
        </ul>
        <p>
          We’re not just watching—<em>we’re living the action together!</em>
        </p>
      </section>
    </div>
  );
}

function Disclaimer() {
  return (
    <div>
      <h2>Disclaimer</h2>
      <p>This website/app is not affiliated with, endorsed by, or in any way officially connected to World Wrestling Entertainment, Inc. (WWE), or any of its subsidiaries or affiliates.

All WWE-related content, including names, logos, images, trademarks, and any other intellectual property, are the sole property of WWE. This platform is a fan-made project created purely for entertainment, commentary, and fan interaction purposes.

We do not claim ownership of any WWE trademarks or materials, nor are we attempting to impersonate or replace any official WWE service.</p>
    </div>
  );
}

function App() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [pops, setPops] = useState(0);
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);
  const [showXPInfo, setShowXPInfo] = useState(false);

  // Handle auth state changes and initial data load
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const data = docSnap.data();
          setUsername(data.username || '');
          setPops(data.pops || 0);
          
          // Handle daily login pops
          const today = new Date().toISOString().slice(0, 10);
          if (data.lastLoginDate !== today) {
            await setDoc(docRef, { 
              pops: (data.pops || 0) + 1,
              lastLoginDate: today 
            }, { merge: true });
            setPops((data.pops || 0) + 1);
          }
        }
      } else {
        // Reset states when user logs out
        setUsername('');
        setPops(0);
        setXP(0);
        setLevel(1);
      }
    });
    return () => unsubscribe();
  }, []);

  // Real-time XP/Level updates
  useEffect(() => {
    let unsubscribe;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setXP(data.xp || 0);
          setLevel(getLevel(data.xp || 0));
        }
      });
    }
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [user]);

  return (
    <Router>
      <div className="App">
        <ToastContainer />
        <nav className="navbar">
          <div className="nav-left">
            <h2>
              <Link to="/" style={{ textDecoration: "none", display: "flex", alignItems: "center" }}>
                <span
                  style={{
                    fontWeight: "bold",
                    background: "linear-gradient(to right, gold, #b87333)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: "1.5rem"
                  }}
                >
                  RUMBLEX
                </span>
              </Link>
            </h2>
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><Link to="/test-yourself">Test Yourself</Link></li>
              <li><Link to="/predictions">Predictions</Link></li>
              <li><Link to="/show-timings">Show Timings</Link></li>
              <li><Link to="/news">News</Link></li>
              <li><Link to="/live-ples">Live PLEs</Link></li>
              <li><Link to="/battlezone">Fan Battlezone</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
              <li><Link to="/dashboard">Dashboard</Link></li>
            </ul>
          </div>
          <div className="auth-section" style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <button
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: 'Join RumbleX!',
                    text: 'Check out this awesome WWE fan site!',
                    url: window.location.origin,
                  });
                } else {
                  navigator.clipboard.writeText(window.location.origin);
                  toast.info('Link copied to clipboard!');
                }
              }}
              style={{
                background: 'linear-gradient(135deg, gold 60%, orange 100%)',
                color: '#fff',
                border: 'none',
                borderRadius: 6,
                padding: '8px 16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginRight: 8
              }}
              title="Share this website"
            >
              🔗 Share
            </button>
            {!user ? (
              <>
                <button className="sign-in-btn" onClick={() => setIsModalOpen(true)}>Sign In</button>
                {isModalOpen && (
                  <SignInModal setUser={setUser} onClose={() => setIsModalOpen(false)} />
                )}
              </>
            ) : (
              <div className="profile-section" style={{ position: "relative" }}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{
                    background: "none",
                    color: "white",
                    border: "1px solid white",
                    padding: "5px 10px",
                    borderRadius: "5px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <img
                    src={user.photoURL || "/images/default-avatar.png"}
                    alt="User Avatar"
                    style={{ width: "30px", height: "30px", borderRadius: "50%" }}
                  />
                  {username ? `@${username}` : (user.displayName || user.email)}
                  <span style={{
                    display: 'inline-block',
                    width: 24,
                    height: 24,
                    background: 'linear-gradient(135deg, gold 60%, orange 100%)',
                    borderRadius: '50%',
                    boxShadow: '0 0 6px gold',
                    marginLeft: 8,
                    textAlign: 'center',
                    lineHeight: '24px',
                    fontWeight: 'bold',
                    fontSize: 15,
                    color: '#fff',
                    border: '2px solid #fff'
                  }}>
                    ✨
                  </span>
                  <span style={{ fontWeight: 'bold', fontSize: 15, color: '#ffd700', marginLeft: 2 }}>{pops}</span>
                  <span
                    style={{
                      marginLeft: 10,
                      background: 'linear-gradient(90deg, #ffd700 60%, #ff416c 100%)',
                      color: '#232347',
                      fontWeight: 900,
                      borderRadius: 12,
                      padding: '2px 10px',
                      fontSize: 14,
                      boxShadow: '0 2px 8px #ffd70055',
                      cursor: 'pointer'
                    }}
                    onClick={() => setShowXPInfo(!showXPInfo)}
                    title="Click to see XP needed for next level"
                  >
                    Lv. {level}
                  </span>
                  {showXPInfo && (
                    <div
                      style={{
                        position: 'absolute',
                        top: 40,
                        right: 0,
                        background: '#232347',
                        color: '#ffd700',
                        padding: '8px 16px',
                        borderRadius: 8,
                        boxShadow: '0 2px 8px #0008',
                        zIndex: 1000,
                        fontSize: 15
                      }}
                      onClick={() => setShowXPInfo(false)}
                    >
                      XP: {getXPIntoLevel(xp)} / {getXPForNextLevel(level)}
                      <br />
                      {getXPForNextLevel(level) - getXPIntoLevel(xp)} XP to next level
                    </div>
                  )}
                </button>
                {isDropdownOpen && (
                  <div className="profile-dropdown">
                    <ul style={{ listStyle: "none", margin: 0, padding: "10px" }}>
                      <li style={{ padding: "5px 0", cursor: "pointer" }}>
                        <Link to="/profile" style={{ textDecoration: "none", color: "black" }}>Profile</Link>
                      </li>
                      <li
                        style={{ padding: "5px 0", cursor: "pointer" }}
                        onClick={async () => {
                          await signOut(auth);
                          setUser(null);
                          setIsDropdownOpen(false);
                        }}
                      >
                        Sign Out
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home pops={pops} level={level} />} />
          <Route path="/test-yourself" element={<TestYourselfRing />} />
          <Route path="/predictions" element={<PredictionsPage />} />
          <Route path="/predictions/votehub" element={<VoteHub user={user} />} />
          <Route path="/predictions/vote/:ple" element={<PlePage user={user} />} />
          <Route path="/our-predictions" element={<OurPredictionsHub />} />
          <Route path="/our-predictions/:ple" element={<OURPLEPAGES />} />
          <Route path="/show-timings" element={<ShowTimings />} />
          <Route path="/news" element={<News />} />
          <Route path="/news/:slug" element={<NewsArticle />} />
          <Route path="/news/:slug/detail" element={<NewsDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/battlezone" element={<BattlezonePage isSignedIn={!!user} user={user} />} />
          <Route path="/match/:pleId/:matchId" element={<MatchDetails />} />
          <Route path="/live-ples/:pleId" element={<PleLiveDashboard />} />
          <Route path="/live-ples" element={<LivePlePage />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/dashboard" element={<div>Dashboard Coming Soon</div>} />
          <Route path="*" element={<div style={{ color: 'white', textAlign: 'center' }}>404 - Page Not Found</div>} />
        </Routes>
        <p className="disclaimer">
          This website is for entertainment purposes only. Not affiliated with WWE.
        </p>
      </div>
    </Router>
  );
}

export default App;