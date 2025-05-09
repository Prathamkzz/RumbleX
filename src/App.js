import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { auth } from './firebaseConfig';
import { signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';
import SignInModal from './Components/SignInModal';
import './Components/CSS/App.css';
import VoteHub from './Components/VoteHub';
import { ToastContainer } from 'react-toastify';
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
import './Components/Sidebar.css';

import LivePlePage from './Components/LivePlePage';
import PleLiveDashboard from './Components/PleLiveDashboard';


function Home() {
  return (
    <div>
      <Sidebar />
      <a href="/" style={{ textDecoration: "none" }}>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <img src="/images/RX.png" alt="RumbleX Logo" style={{ height: "80px", marginBottom: "10px" }} />
        </div>
      </a>
      <h2 style={{ textAlign: "center", marginTop: "20px" }}>Welcome to RumbleX 👋</h2>


      <section id="top-wwe-news">
        <h2>📰 Top WWE News</h2>
        <a href="/news">
          <img src="/images/NEWS.jpg" alt="Top WWE News" style={{ width: "100%", maxWidth: "600px" }} />
          <p><strong>Breaking News: Latest WWE Updates and Surprises Unfolding!</strong></p>
        </a>
      </section>

      <section id="match-predictions">
        <h2>🔮 Match Predictions</h2>
        <a href="/predictions">
          <img src="/images/PRED.jpg" alt="Match Predictions" style={{ width: "100%", maxWidth: "600px" }} />
          <p>Who will win? Cena or Orton — Vote now!</p>
        </a>
      </section>

      <section id="next-wwe-show">
        <h2>🕒 Next WWE Show</h2>
        <a href="/show-timings">
          <img src="/images/123.webp" alt="Next WWE Show" style={{ width: "100%", maxWidth: "600px" }} />
          <p>WWE Raw starts in: <strong>(TAP TO KNOW)</strong></p>
        </a>
      </section>
    </div>
  );
}

function About() {
  return (
    <div>
      
      <p><section className="about-section">
  <h2>About Us</h2>
  <p>
    Welcome to <strong>RUMBLEX</strong> – We’re a community-powered hub made by fans, for fans of WWE. From live match reactions to polls, fan predictions, memes, and even a career mode fantasy journey—our goal is to turn your WWE obsession into an interactive experience.

This platform brings fans together during premimun-Live-Events (PLEs), where you can:
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
</p>
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
  const [, setIsEventLive] = useState(false); // Track event status
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  
  

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const docRef = doc(db, 'users', currentUser.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setUsername(docSnap.data().username || '');
        } else {
          setUsername('');
        }
      } else {
        setUsername('');
      }
    });
    return () => unsubscribe();
  }, []);

  
  useEffect(() => {
    // Example: Simulate getting live event status
    const fetchEventStatus = () => {
      // Simulated check for event live status
      setIsEventLive(true); // You would dynamically fetch this
    };
    
    fetchEventStatus(); // This function will update the event status
  }, []);

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
             
              <li><Link to="/predictions">Predictions</Link></li>
              <li><Link to="/show-timings">Show Timings</Link></li>
              <li><Link to="/news">News</Link></li>
              <li><Link to="/live-ples">Live PLEs</Link></li>
              <li><Link to="/battlezone">Fan Battlezone</Link></li>
              <li><Link to="/about">About</Link></li>
              <li><Link to="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>
          <div className="auth-section">
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
          <Route path="/" element={<Home />} />
         
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
          <Route path="/live-ples" element={ <LivePlePage /> } />
          <Route path="/profile" element={<Profile />} />
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