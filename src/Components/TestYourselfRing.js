import React, { useState, useEffect } from 'react';
import './TestYourselfRing.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { toast } from 'react-toastify';
import { ACHIEVEMENTS, XP_REWARDS } from './AchievementsXP'; // Add XP_REWARDS here

// Large pool of WWE Superstars
const ALL_SUPERSTARS = [
  { name: 'Roman Reigns', img: '/images/ROR.png', stamina: 9, agility: 8 },
  { name: 'Seth Rollins', img: '/images/SR.png', stamina: 8, agility: 9 },
  { name: 'Rhea Ripley', img: '/images/RR.png', stamina: 8, agility: 8 },
  { name: 'Cody Rhodes', img: '/images/CR.png', stamina: 8, agility: 8 },
  { name: 'Gunther', img: '/images/GE.png', stamina: 9, agility: 7 },
  { name: 'Becky Lynch', img: '/images/bl.png', stamina: 7, agility: 9 },
  { name: 'Brock Lesnar', img: '/images/BROCK.png', stamina: 10, agility: 7 },
  { name: 'John Cena', img: '/images/Cena.png', stamina: 9, agility: 8 },
  { name: 'Bron Breakker', img: '/images/BRONB.png', stamina: 8, agility: 7 },
  { name: 'Charlotte Flair', img: '/images/CF.png', stamina: 8, agility: 8 },
  { name: 'AJ Styles', img: '/images/AS.png', stamina: 7, agility: 10 },
  { name: 'Bianca Belair', img: '/images/BB.png', stamina: 7, agility: 8 },
  { name: 'CM Punk', img: '/images/CP.png', stamina: 7, agility: 7 },
  { name: 'Dominik Mysterio', img: '/images/dom.png', stamina: 7, agility: 6 },
  { name: 'Finn Balor', img: '/images/FB.png', stamina: 9, agility: 8 },
  { name: 'Drew McIntyre', img: '/images/DW.png', stamina: 8, agility: 7 },
  { name: 'Iyo Sky', img: '/images/IYO.png', stamina: 9, agility: 10 },
  { name: 'Jacob Fatu', img: '/images/JACOB.png', stamina: 8, agility: 7 },
  { name: 'LA Knight', img: '/images/LA.png', stamina: 9, agility: 7 },
  { name: 'Logan Paul', img: '/images/LP.png', stamina: 8, agility: 10 },
  { name: 'Liv Morgan', img: '/images/LM.png', stamina: 7, agility: 8 },
  { name: 'Tiffany Stratton', img: '/images/TS.png', stamina: 8, agility: 8 },
  { name: 'Lyra Valkyria', img: '/images/LV.png', stamina: 7, agility: 9 },
  { name: 'Randy Orton', img: '/images/RKO.png', stamina: 9, agility: 9 },
  { name: 'Sheamus', img: '/images/SH.png', stamina: 8, agility: 9 },
  { name: 'Jey Uso', img: '/images/JU.png', stamina: 9, agility: 7 },
  { name: 'Penta', img: '/images/pen.png', stamina: 7, agility: 9 },
  // Add more superstars as needed
];

// Shuffle and pick N superstars
function getRandomSuperstars(pool, count = 7) {
  const shuffled = [...pool].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

const BOT_LEVELS = [
  { min: 1, max: 5, name: 'Beginner', minTime: 1800, maxTime: 2200, seq: 2 },
  { min: 6, max: 12, name: 'Noob', minTime: 1400, maxTime: 1800, seq: 2 },
  { min: 13, max: 20, name: 'Mid', minTime: 1100, maxTime: 1500, seq: 3 },
  { min: 21, max: 26, name: 'Average', minTime: 900, maxTime: 1200, seq: 5 },
  { min: 27, max: 30, name: 'Hard', minTime: 700, maxTime: 1000, seq: 6 },
  { min: 31, max: 40, name: 'Extra Hard', minTime: 500, maxTime: 800, seq: 7 },
  { min: 41, max: 65, name: 'Evil', minTime: 350, maxTime: 600, seq: 8 },
  { min: 66, max: 70, name: 'Impossible', minTime: 200, maxTime: 400, seq: 9 },
];

function getBotSettings(level) {
  return BOT_LEVELS.find(lvl => level >= lvl.min && level <= lvl.max) || BOT_LEVELS[0];
}

const SWIPES = ['Up', 'Down', 'Left', 'Right'];

// Calculate the level based on XP
function getLevel(xp) {
  let level = 1;
  let xpNeeded = 20; // XP needed for Level 1 → 2

  while (xp >= xpNeeded) {
    level++;
    xp -= xpNeeded;
    xpNeeded = Math.floor(xpNeeded * 1.5); // Increase XP requirement by 50% for each level
  }

  return level;
}

function playSound(src) {
  const audio = new window.Audio(src);
  audio.volume = 0.6;
  audio.play();
}

export default function TestYourselfRing() {
  const [page, setPage] = useState('landing');
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);

 useEffect(() => {
  if (auth.currentUser) {
    const docRef = doc(db, 'users', auth.currentUser.uid);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setXP(data.xp || 0);
        setLevel(getLevel(data.xp || 0));
      }
    });
    return () => unsubscribe();
  }
}, []);

  return (
    <div className="ring-section">
      <h1 style={{ textAlign: 'center', margin: '24px 0', color: '#ffd700' }}>Test Yourself in the RING</h1>
      {page === 'landing' && (
        <div className="game-list">
          <GameCard
            title="SwipeMania"
            description="Pick your WWE team and swipe your way to victory! Outswipe the bot in fast-paced rounds. Level up and face tougher opponents."
            onPlay={() => setPage('swipemania')}
            img="/images/swipemania.png"
            comingSoon={false}
          />
          <GameCard
            title="More GAMES"
            description="(Coming Soon)"   
            comingSoon={true}
          />
        </div>
      )}
      {page === 'swipemania' && (
        <SwipeMania
          xp={xp}
          setXP={setXP}
          level={level}
          onBack={() => setPage('landing')}
        />
      )}
    </div>
  );
}

function GameCard({ title, description, onPlay, img, comingSoon }) {
  return (
    <div className="game-card">
      {img && <img src={img} alt={title} className="game-card-img" />}
      <h2>{title}</h2>
      <p>{description}</p>
      {comingSoon ? (
        <button className="game-btn" disabled>Coming Soon</button>
      ) : (
        <button className="game-btn" onClick={onPlay}>Play Now</button>
      )}
    </div>
  );
}

function SwipeMania({ xp, setXP, level, onBack }) {
  // Use a dynamic pool of 9 superstars per session
  const [superstars, setSuperstars] = useState(() => getRandomSuperstars(ALL_SUPERSTARS, 9));
  const [step, setStep] = useState('team');
  const [selected, setSelected] = useState([]);
  const [botTeam, setBotTeam] = useState([]);
  const [round, setRound] = useState(1);
  const [playerWins, setPlayerWins] = useState(0);
  const [botWins, setBotWins] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [currentBot, setCurrentBot] = useState(null);
  const [swipeSeq, setSwipeSeq] = useState([]);
  const [playerInput, setPlayerInput] = useState([]);
  const [playerTime, setPlayerTime] = useState(null);
  const [botTime, setBotTime] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [xpGained, setXPGained] = useState(0);
  const [showBotTeam, setShowBotTeam] = useState(false);
  const [showFaceoff, setShowFaceoff] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [width, height] = useWindowSize();
  const [matchWon, setMatchWon ] = useState(false);
  // 
  // For swipe detection
  const [swipeStart, setSwipeStart] = useState(null);

  // Helper to detect swipe direction
  function detectSwipe(start, end) {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30) return 'Right';
      if (dx < -30) return 'Left';
    } else {
      if (dy > 30) return 'Down';
      if (dy < -30) return 'Up';
    }
    return null;
  }

  // Touch events for mobile
  function handleTouchStart(e) {
    const touch = e.touches[0];
    setSwipeStart({ x: touch.clientX, y: touch.clientY });
  }
  function handleTouchEnd(e) {
    if (!swipeStart) return;
    const touch = e.changedTouches[0];
    const end = { x: touch.clientX, y: touch.clientY };
    const dir = detectSwipe(swipeStart, end);
    if (dir) handleSwipe(dir);
    setSwipeStart(null);
  }

  // Mouse events for desktop
  function handleMouseDown(e) {
    setSwipeStart({ x: e.clientX, y: e.clientY });
  }
  function handleMouseUp(e) {
    if (!swipeStart) return;
    const end = { x: e.clientX, y: e.clientY };
    const dir = detectSwipe(swipeStart, end);
    if (dir) handleSwipe(dir);
    setSwipeStart(null);
  }

  function handleSelectSuperstar(idx) {
    if (selected.includes(idx)) {
      setSelected(selected.filter(i => i !== idx));
    } else if (selected.length < 3) {
      setSelected([...selected, idx]);
    }
  }

  function lockTrio() {
    let pool = [...Array(superstars.length).keys()].filter(i => !selected.includes(i));
    let botChoices = [];
    while (botChoices.length < 3) {
      const pick = pool[Math.floor(Math.random() * pool.length)];
      botChoices.push(pick);
      pool = pool.filter(i => i !== pick);
    }
    setBotTeam(botChoices);
    setRound(1);
    setPlayerWins(0);
    setBotWins(0);
    setStep('round');
    setFeedback('');
    setXPGained(0);
    setShowBotTeam(true);
    setShowFaceoff(false);
  }

  function handleShowFaceoff(r = 1, playerTeam = selected, botTeamArr = botTeam) {
    setCurrentPlayer(playerTeam[r - 1]);
    setCurrentBot(botTeamArr[r - 1]);
    setShowFaceoff(true);
  }

  function nextRound(r, playerTeam = selected, botTeamArr = botTeam) {
    setRound(r);
    setCurrentPlayer(playerTeam[r - 1]);
    setCurrentBot(botTeamArr[r - 1]);
    setShowFaceoff(true);
  }

  function startBattle() {
    const botSettings = getBotSettings(level);
    const playerSuperstar = superstars[currentPlayer];
    const seqLen = Math.max(2, botSettings.seq - Math.floor(playerSuperstar.agility / 3));
    const seq = [];
    for (let i = 0; i < seqLen; i++) {
      seq.push(SWIPES[Math.floor(Math.random() * SWIPES.length)]);
    }
    setSwipeSeq(seq);
    setPlayerInput([]);
    setPlayerTime(null);
    setBotTime(null);
    setFeedback('');
    setShowFaceoff(false);
  }

  function handleSwipe(dir) {
    if (playerInput.length >= swipeSeq.length) return;
    playSound('/sounds/swipe.mp3.mp3');
    const now = Date.now();
    let start = playerInput.startTime || now;
    let arr = playerInput.length === 0 ? [] : [...playerInput];
    if (arr.length === 0) arr.startTime = now;
    arr.push(dir);
    arr.startTime = start;
    setPlayerInput(arr);

    if (arr.length === swipeSeq.length) {
      setTimeout(() => finishRound(arr), 100);
    }
  }

  function finishRound(inputArr) {
    const end = Date.now();
    const start = inputArr.startTime || end;
    const playerMs = end - start;
    setPlayerTime(playerMs);

    const botSettings = getBotSettings(level);
    const botSuperstar = superstars[currentBot];
    const botSpeedBonus = botSuperstar.agility * 10;
    const botMs = Math.max(
      botSettings.minTime,
      Math.floor(Math.random() * (botSettings.maxTime - botSettings.minTime + 1)) + botSettings.minTime
    ) - botSpeedBonus;
    setBotTime(botMs);

    // Check sequence and timing
    const correct = inputArr.every((d, i) => d === swipeSeq[i]);
    const win = correct && playerMs < botMs;

    setTimeout(() => {
      setFeedback(win ? 'You Win this Round!' : 'Bot Wins this Round!');
      if (win) {
        setPlayerWins(prev => prev + 1);
      } else {
        setBotWins(prev => prev + 1);
      }

      // No sound effects for rounds, only for match end
      if (round < 3) {
        setTimeout(() => {
          nextRound(round + 1);
        }, 1200);
      } else {
        setTimeout(() => finishGame(win), 1500);
      }
    }, 700);
  }

  function finishGame(lastWin) {
    let totalPlayerWins = playerWins + (lastWin ? 1 : 0);
    let totalBotWins = botWins + (lastWin ? 0 : 1);
    let xpEarned = 0;
    let matchWon = totalPlayerWins > totalBotWins;  // Calculate match result once

    const user = auth.currentUser;
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      
      getDoc(docRef).then(async (docSnap) => {
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const currentXP = userData.xp || 0;
          const achievements = userData.achievements || [];
          const winStreak = userData.winStreak || 0;
          
          // Calculate XP earned
          switch(totalPlayerWins) {
            case 3:
              xpEarned = XP_REWARDS.WIN_ALL_ROUNDS;
              break;
            case 2:
              xpEarned = XP_REWARDS.WIN_TWO_ROUNDS;
              break;
            case 1:
              xpEarned = XP_REWARDS.WIN_ONE_ROUND;
              break;
            default:
              xpEarned = XP_REWARDS.PARTICIPATION;
          }

          // Check for achievements
          const newAchievements = [];

          // First Win Achievement
          if (totalPlayerWins > totalBotWins && !achievements.includes('first_win')) {
            newAchievements.push(ACHIEVEMENTS.FIRST_WIN.id);
            xpEarned += ACHIEVEMENTS.FIRST_WIN.xpReward;
          }

          // Perfect Game Achievement
          if (totalPlayerWins === 3 && totalBotWins === 0 && !achievements.includes('perfect_game')) {
            newAchievements.push(ACHIEVEMENTS.PERFECT_GAME.id);
            xpEarned += ACHIEVEMENTS.PERFECT_GAME.xpReward;
          }

          // Update Win Streak
          const newWinStreak = totalPlayerWins > totalBotWins ? winStreak + 1 : 0;
          
          // Win Streak Achievement
          if (newWinStreak >= 3 && !achievements.includes('win_streak')) {
            newAchievements.push(ACHIEVEMENTS.WIN_STREAK.id);
            xpEarned += ACHIEVEMENTS.WIN_STREAK.xpReward;
          }

          // Update Firestore
          await setDoc(docRef, {
            xp: currentXP + xpEarned,
            winStreak: matchWon ? winStreak + 1 : 0,  // Use matchWon here
            achievements: [...achievements, ...newAchievements],
            gamesPlayed: (userData.gamesPlayed || 0) + 1,
            wins: matchWon ? (userData.wins || 0) + 1 : (userData.wins || 0)  // Use matchWon here
          }, { merge: true });

          // Show achievement notifications
          newAchievements.forEach(achievementId => {
            const achievement = Object.values(ACHIEVEMENTS).find(a => a.id === achievementId);
            if (achievement) {
              toast.success(
                <div>
                  {achievement.icon} Achievement Unlocked!<br/>
                  <strong>{achievement.title}</strong><br/>
                  +{achievement.xpReward}XP
                </div>,
                { position: "top-right", autoClose: 5000 }
              );
            }
          });

          // Show XP notification
          toast.success(`🎮 +${xpEarned} XP!`, {
            position: "top-right",
            autoClose: 2000
          });

          setXPGained(xpEarned);
        }
      });
    }

    // Play sound and show confetti ONCE at the end
    if (matchWon) {
      setShowConfetti(true);
      playSound('/sounds/win.mp3.mp3');
      setFeedback('Great victory! 🏆');
      setTimeout(() => setShowConfetti(false), 3000);
    } else {
      playSound('/sounds/lose.mp3.mp3');
      setFeedback('Better luck next time! 😢');
    }

    setStep('result');
  }

  // --- UI rendering ---
  if (step === 'team') {
    return (
      <div className="swipemania-team">
        <button className="game-btn" onClick={onBack} style={{ marginBottom: 16 }}>← Back</button>
        <h2 className="superstar-select-header">SELECT 3 SUPERSTARS<br />FROM 9</h2>
        <div className="superstar-select-subheader">SELECTED {selected.length}/3</div>
        <div className="superstar-pool">
          {superstars.map((s, idx) => (
            <div
              key={s.name}
              className={`superstar-card${selected.includes(idx) ? ' selected' : ''}`}
              onClick={() => handleSelectSuperstar(idx)}
            >
              <div className="superstar-img-area">
                <img src={s.img} alt={s.name} />
              </div>
              <div className="superstar-name">{s.name}</div>
              
              <div className="superstar-stats">
                🏋️ Stamina: {s.stamina} | 🤸 Agility: {s.agility}
              </div>
            </div>
          ))}
        </div>
        <button
          className="lock-trio-btn"
          onClick={lockTrio}
          disabled={selected.length !== 3}
        >
          LOCK MY TRIO
        </button>
      </div>
    );
  }

  // --- Bot team reveal screen ---
  if (showBotTeam) {
    return (
      <div className="swipemania-botreveal">
        <h2 style={{ color: '#ffd700' }}>Bot's Team</h2>
        <div className="superstar-pool">
          {botTeam.map(idx => (
            <div className="superstar-card selected" key={superstars[idx].name}>
              <div className="superstar-img-area">
                <img src={superstars[idx].img} alt={superstars[idx].name} />
              </div>
              <div>{superstars[idx].name}</div>
            </div>
          ))}
        </div>
        <button
          className="game-btn"
          style={{ marginTop: 24 }}
          onClick={() => {
            setShowBotTeam(false);
            handleShowFaceoff(1, selected, botTeam);
          }}
        >
          Continue
        </button>
      </div>
    );
  }

  // --- Faceoff screen before each round ---
  if (showFaceoff && step === 'round') {
    return (
      <div className="swipemania-faceoff" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 350,
        background: 'linear-gradient(90deg, #232347 60%, #ff416c 100%)',
        borderRadius: 18,
        boxShadow: '0 2px 18px #0005',
        padding: 32
      }}>
        <h2 style={{ color: '#ffd700', fontSize: 32, marginBottom: 24 }}>
          Round {round} — Battle!
        </h2>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 40,
          marginBottom: 24
        }}>
          <div style={{ textAlign: 'center' }}>
            <div className="superstar-img-area">
              <img
                src={superstars[currentPlayer].img}
                alt={superstars[currentPlayer].name}
                style={{
                  width: 120,
                  borderRadius: 16,
                  border: '3px solid #ffd700',
                  boxShadow: '0 0 16px #ffd70088'
                }}
              />
            </div>
            <div style={{
              color: '#ffd700',
              fontWeight: 700,
              fontSize: 20,
              marginTop: 8
            }}>
              {superstars[currentPlayer].name}
            </div>
          </div>
          <span style={{
            fontSize: 48,
            color: '#fff',
            fontWeight: 900,
            textShadow: '0 2px 12px #ff416c'
          }}>
            VS
          </span>
          <div style={{ textAlign: 'center' }}>
            <div className="superstar-img-area">
              <img
                src={superstars[currentBot].img}
                alt={superstars[currentBot].name}
                style={{
                  width: 120,
                  borderRadius: 16,
                  border: '3px solid #ff416c',
                  boxShadow: '0 0 16px #ff416c88'
                }}
              />
            </div>
            <div style={{
              color: '#ff416c',
              fontWeight: 700,
              fontSize: 20,
              marginTop: 8
            }}>
              {superstars[currentBot].name}
            </div>
          </div>
        </div>
        <button
          className="game-btn"
          style={{
            marginTop: 24,
            fontSize: 20,
            padding: '12px 36px',
            background: 'linear-gradient(90deg, #ffd700 40%, #ff416c 100%)'
          }}
          onClick={startBattle}
        >
          Start Round
        </button>
      </div>
    );
  }

  // --- Main round UI ---
  if (step === 'round' && !showFaceoff) {
    return (
      <div className="swipemania-round">
        <h2 style={{ color: '#ffd700', marginBottom: 12 }}>Round {round}</h2>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24, marginBottom: 16 }}>
          <div style={{ textAlign: 'center' }}>
            <div className="superstar-img-area">
              <img src={superstars[currentPlayer].img} alt={superstars[currentPlayer].name} style={{ width: 80, borderRadius: 12, border: '2px solid #ffd700' }} />
            </div>
            <div style={{ color: '#ffd700', fontWeight: 600 }}>{superstars[currentPlayer].name}</div>
          </div>
          <span style={{ fontSize: 28, color: '#fff', fontWeight: 900 }}>VS</span>
          <div style={{ textAlign: 'center' }}>
            <div className="superstar-img-area">
              <img src={superstars[currentBot].img} alt={superstars[currentBot].name} style={{ width: 80, borderRadius: 12, border: '2px solid #ff416c' }} />
            </div>
            <div style={{ color: '#ff416c', fontWeight: 600 }}>{superstars[currentBot].name}</div>
          </div>
        </div>
        <div style={{ margin: '16px 0' }}>
          <ProgressBar value={playerInput.length} max={swipeSeq.length} />
        </div>
        <div style={{ fontSize: 22, margin: '16px 0', letterSpacing: 2, color: '#ffd700' }}>
          {swipeSeq.map((dir, i) =>
            <span key={i} style={{ opacity: playerInput[i] ? 0.3 : 1, marginRight: 8 }}>
              {`[${dir.toUpperCase()}]`}
            </span>
          )}
        </div>
        {playerInput.length < swipeSeq.length && (
          <div className="swipe-hint">
            {swipeSeq[playerInput.length] === 'Up' && <span>⬆️ <span className="swipe-hand up">🤚</span> Swipe Up!</span>}
            {swipeSeq[playerInput.length] === 'Down' && <span>⬇️ <span className="swipe-hand down">🤚</span> Swipe Down!</span>}
            {swipeSeq[playerInput.length] === 'Left' && <span>⬅️ <span className="swipe-hand left">🤚</span> Swipe Left!</span>}
            {swipeSeq[playerInput.length] === 'Right' && <span>➡️ <span className="swipe-hand right">🤚</span> Swipe Right!</span>}
          </div>
        )}
        <div
          className="swipe-area"
          style={{
            margin: '24px auto',
            width: 220,
            height: 220,
            background: '#232347',
            borderRadius: 16,
            border: '3px dashed #ffd700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffd700',
            fontWeight: 700,
            fontSize: 22,
            userSelect: 'none',
            touchAction: 'none'
          }}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={e => { e.preventDefault(); handleMouseDown(e); }}
          onMouseUp={handleMouseUp}
        >
          {playerInput.length < swipeSeq.length
            ? 'Swipe here!'
            : 'Wait...'}
        </div>
        {feedback && (
          <div
            className={feedback.includes('Win') ? 'feedback-win' : 'feedback-lose'}
            style={{ fontWeight: 700, fontSize: 20, margin: '16px 0' }}
          >
            {feedback}
            <br />
            <span style={{ color: '#ffd700', fontWeight: 500 }}>
              Your time: {playerTime ? `${playerTime} ms` : '--'} | Bot time: {botTime ? `${botTime} ms` : '--'}
            </span>
          </div>
        )}
      </div>
    );
  }

  // --- Result screen ---
  if (step === 'result') {
    return (
      <div className="swipemania-result">
        {showConfetti && <Confetti width={width} height={height} />}
        <h2>Match Result</h2>
        <div style={{ fontSize: 22, margin: '16px 0', color: matchWon ? '#0f0' : '#f44' }}>
          {matchWon ? '🏆 You Win the Match!' : '😢 Bot Wins the Match!'}
        </div>
        <div style={{ margin: '12px 0', color: '#ffd700' }}>
          +{xpGained} XP
        </div>
        <div style={{ margin: '12px 0', color: '#ffd700' }}>
          Level: {getLevel(xp + xpGained)}
        </div>
        {feedback && (
          <div style={{ margin: '12px 0', color: '#ffd700', fontStyle: 'italic' }}>
            {feedback}
          </div>
        )}
        <button
          className="game-btn"
          onClick={() => {
            playSound('/sounds/click.mp3');
            setSuperstars(getRandomSuperstars(ALL_SUPERSTARS, 9)); // Shuffle new 9 for next game
            setStep('team');
            setSelected([]);
          }}
        >
          Play Again
        </button>
        <button className="game-btn" onClick={onBack} style={{ marginLeft: 12 }}>Back to Games</button>
      </div>
    );
  }

  return null;
}

// ProgressBar component
function ProgressBar({ value, max }) {
  const percent = value ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="progress-bar">
      <div className="progress-bar-inner" style={{ width: `${percent}%` }} />
    </div>
  );
}