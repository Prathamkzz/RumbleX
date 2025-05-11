import React, { useState, useEffect } from 'react';
import './TestYourselfRing.css';

// Example WWE Superstars pool (expand as needed)
const SUPERSTARS = [
  { name: 'Roman Reigns', img: '/images/BRON.png', speed: 8, power: 9 },
  { name: 'Seth Rollins', img: '/images/bl.png', speed: 9, power: 8 },
  { name: 'Rhea Ripley', img: '/images/Cena.png', speed: 8, power: 8 },
  { name: 'Cody Rhodes', img: '/images/DA.png', speed: 8, power: 8 },
  { name: 'Gunther', img: '/images/dom.png', speed: 7, power: 9 },
  { name: 'Becky Lynch', img: '/images/GE.png', speed: 9, power: 7 },
  { name: 'Brock Lesnar', img: '/images/JA.png', speed: 7, power: 10 },
];

const BOT_LEVELS = [
  { min: 1, max: 5, name: 'Beginner', minTime: 1800, maxTime: 2200, seq: 2 },
  { min: 6, max: 12, name: 'Noob', minTime: 1400, maxTime: 1800, seq: 2 },
  { min: 13, max: 20, name: 'Mid', minTime: 1100, maxTime: 1500, seq: 3 },
  { min: 21, max: 26, name: 'Average', minTime: 900, maxTime: 1200, seq: 3 },
  { min: 27, max: 30, name: 'Hard', minTime: 700, maxTime: 1000, seq: 4 },
  { min: 31, max: 40, name: 'Extra Hard', minTime: 500, maxTime: 800, seq: 4 },
  { min: 41, max: 65, name: 'Evil', minTime: 350, maxTime: 600, seq: 5 },
  { min: 66, max: 70, name: 'Impossible', minTime: 200, maxTime: 400, seq: 6 },
];

function getBotSettings(level) {
  return BOT_LEVELS.find(lvl => level >= lvl.min && level <= lvl.max) || BOT_LEVELS[0];
}

const SWIPES = ['Up', 'Down', 'Left', 'Right'];

function getLevel(xp) {
  return Math.floor(xp / 50) + 1;
}

export default function TestYourselfRing() {
  const [page, setPage] = useState('landing');
  const [xp, setXP] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    const savedXP = parseInt(localStorage.getItem('swipemania_xp') || '0', 10);
    setXP(savedXP);
    setLevel(getLevel(savedXP));
  }, []);

  useEffect(() => {
    localStorage.setItem('swipemania_xp', xp);
    setLevel(getLevel(xp));
  }, [xp]);

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
            title="Promo Battle"
            description="Cut the best promo and win the crowd! (Coming Soon)"
            comingSoon={true}
          />
          <GameCard
            title="Guess The Theme"
            description="Can you guess the superstar's entrance music? (Coming Soon)"
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

  function handleSelectSuperstar(idx) {
    if (selected.includes(idx)) {
      setSelected(selected.filter(i => i !== idx));
    } else if (selected.length < 3) {
      setSelected([...selected, idx]);
    }
  }

  function startGame() {
    let pool = [...Array(SUPERSTARS.length).keys()].filter(i => !selected.includes(i));
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
    nextRound(1, [...selected], [...botChoices]);
  }

  function nextRound(r, playerTeam = selected, botTeamArr = botTeam) {
    setRound(r);
    setCurrentPlayer(playerTeam[r - 1]);
    setCurrentBot(botTeamArr[r - 1]);
    const botSettings = getBotSettings(level);
    const seqLen = botSettings.seq;
    const seq = [];
    for (let i = 0; i < seqLen; i++) {
      seq.push(SWIPES[Math.floor(Math.random() * SWIPES.length)]);
    }
    setSwipeSeq(seq);
    setPlayerInput([]);
    setPlayerTime(null);
    setBotTime(null);
    setFeedback('');
  }

  function handleSwipe(dir) {
    if (playerInput.length >= swipeSeq.length) return;
    const now = Date.now();
    let start = playerInput.startTime || now;
    let arr = playerInput.length === 0 ? [] : [...playerInput];
    if (arr.length === 0) arr.startTime = now;
    arr.push(dir);
    arr.startTime = start;
    setPlayerInput(arr);

    if (arr.length + 1 === swipeSeq.length) {
      setTimeout(() => finishRound(arr.concat(dir)), 100);
    }
  }

  function finishRound(inputArr) {
    const end = Date.now();
    const start = inputArr.startTime || end;
    const playerMs = end - start;
    setPlayerTime(playerMs);

    const botSettings = getBotSettings(level);
    const botSuperstar = SUPERSTARS[currentBot];
    const botSpeedBonus = botSuperstar.speed * 10;
    const botMs = Math.max(
      botSettings.minTime,
      Math.floor(Math.random() * (botSettings.maxTime - botSettings.minTime + 1)) + botSettings.minTime
    ) - botSpeedBonus;
    setBotTime(botMs);

    const correct = inputArr.every((d, i) => d === swipeSeq[i]);
    let win = false;
    if (correct && playerMs < botMs) win = true;
    else if (!correct) win = false;
    else if (playerMs === botMs) win = Math.random() > 0.5;

    setTimeout(() => {
      setFeedback(win ? 'You Win this Round!' : 'Bot Wins this Round!');
      setPlayerWins(w => win ? w + 1 : w);
      setBotWins(w => !win ? w + 1 : w);

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
    let xpEarned = totalPlayerWins > totalBotWins ? 10 : 5;
    setXP(xp => xp + xpEarned);
    setXPGained(xpEarned);
    setStep('result');
  }

  if (step === 'team') {
    return (
      <div className="swipemania-team">
        <button className="game-btn" onClick={onBack} style={{ marginBottom: 16 }}>← Back</button>
        <h2>Pick Your Team (3 Superstars)</h2>
        <div className="superstar-pool">
          {SUPERSTARS.map((s, idx) => (
            <div
              key={s.name}
              className={`superstar-card ${selected.includes(idx) ? 'selected' : ''}`}
              onClick={() => handleSelectSuperstar(idx)}
            >
              <img src={s.img} alt={s.name} />
              <div>{s.name}</div>
              <div style={{ fontSize: 12, color: '#ffd700' }}>Speed: {s.speed} | Power: {s.power}</div>
            </div>
          ))}
        </div>
        <button
          className="game-btn"
          onClick={startGame}
          disabled={selected.length !== 3}
          style={{ marginTop: 24 }}
        >
          Start Match
        </button>
      </div>
    );
  }

  if (step === 'round') {
    return (
      <div className="swipemania-round">
        <button className="game-btn" onClick={onBack} style={{ marginBottom: 16 }}>← Back</button>
        <h2>Round {round} / 3</h2>
        <div className="round-progress">
          <span style={{ color: '#ffd700' }}>You: {playerWins}</span>
          <span style={{ color: '#f44', margin: '0 16px' }}>Bot: {botWins}</span>
        </div>
        <div className="battle-row">
          <div className="superstar-card selected">
            <img src={SUPERSTARS[currentPlayer].img} alt={SUPERSTARS[currentPlayer].name} />
            <div>{SUPERSTARS[currentPlayer].name}</div>
          </div>
          <span style={{ fontSize: 32, color: '#fff', margin: '0 24px' }}>VS</span>
          <div className="superstar-card selected">
            <img src={SUPERSTARS[currentBot].img} alt={SUPERSTARS[currentBot].name} />
            <div>{SUPERSTARS[currentBot].name}</div>
          </div>
        </div>
        <div className="swipe-sequence">
          {swipeSeq.map((dir, i) => (
            <span key={i} className="swipe-arrow">{arrowIcon(dir)}</span>
          ))}
        </div>
        <div className="swipe-controls">
          {SWIPES.map(dir => (
            <button
              key={dir}
              className="swipe-btn"
              onClick={() => handleSwipe(dir)}
              disabled={playerInput.length >= swipeSeq.length}
            >
              {arrowIcon(dir)} {dir}
            </button>
          ))}
        </div>
        <div className="progress-bars">
          <div>
            <span style={{ color: '#ffd700' }}>You</span>
            <ProgressBar value={playerTime} max={2500} />
          </div>
          <div>
            <span style={{ color: '#f44' }}>Bot</span>
            <ProgressBar value={botTime} max={2500} />
          </div>
        </div>
        {feedback && (
          <div className="round-feedback">{feedback}</div>
        )}
      </div>
    );
  }

  if (step === 'result') {
    return (
      <div className="swipemania-result">
        <h2>Match Result</h2>
        <div style={{ fontSize: 22, margin: '16px 0', color: xpGained === 10 ? '#0f0' : '#f44' }}>
          {xpGained === 10 ? '🏆 You Win the Match!' : '😢 Bot Wins the Match!'}
        </div>
        <div style={{ margin: '12px 0', color: '#ffd700' }}>
          +{xpGained} XP
        </div>
        <div style={{ margin: '12px 0', color: '#ffd700' }}>
          Level: {getLevel(xp + xpGained)}
        </div>
        <button className="game-btn" onClick={() => setStep('team')}>Play Again</button>
        <button className="game-btn" onClick={onBack} style={{ marginLeft: 12 }}>Back to Games</button>
      </div>
    );
  }

  return null;
}

function ProgressBar({ value, max }) {
  const percent = value ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="progress-bar">
      <div className="progress-bar-inner" style={{ width: `${percent}%` }} />
    </div>
  );
}

function arrowIcon(dir) {
  switch (dir) {
    case 'Up': return '⬆️';
    case 'Down': return '⬇️';
    case 'Left': return '⬅️';
    case 'Right': return '➡️';
    default: return '';
  }
}