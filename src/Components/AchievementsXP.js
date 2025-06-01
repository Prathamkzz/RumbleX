import React, { useState, useEffect, useCallback } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../firebaseConfig';
import { toast } from 'react-toastify';
import './AchievementsXP.css';

// XP Constants
export const XP_REWARDS = {
  WIN_ALL_ROUNDS: 15,
  WIN_TWO_ROUNDS: 10,
  WIN_ONE_ROUND: 5,
  PARTICIPATION: 1
};

// Achievement Definitions
export const ACHIEVEMENTS = {
  FIRST_WIN: {
    id: 'first_win',
    title: 'First Victory',
    description: 'Win your first match',
    xpReward: 10,
    icon: '🏆'
  },
  PERFECT_GAME: {
    id: 'perfect_game',
    title: 'Perfect Game',
    description: 'Win all rounds without losing',
    xpReward: 20,
    icon: '⭐'
  },
  LEVEL_5: {
    id: 'level_5',
    title: 'Rising Star',
    description: 'Reach Level 5',
    xpReward: 25,
    icon: '⚡'
  },
  WIN_STREAK: {
    id: 'win_streak',
    title: 'Winning Streak',
    description: 'Win 3 games in a row',
    xpReward: 30,
    icon: '🔥'
  }
};

// XP Helper Functions
export function getXPForNextLevel(level) {
  let xpNeeded = 20;
  for (let i = 1; i < level; i++) {
    xpNeeded = Math.floor(xpNeeded * 1.5);
  }
  return xpNeeded;
}

export function getLevel(xp) {
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

export function getXPIntoLevel(xp) {
  let xpNeeded = 20;
  let remainingXP = xp;
  while (remainingXP >= xpNeeded) {
    remainingXP -= xpNeeded;
    xpNeeded = Math.floor(xpNeeded * 1.5);
  }
  return remainingXP;
}

// Achievement Component
function AchievementsXP() {
  const [achievements, setAchievements] = useState([]);
  const [showLevelUpAnimation, setShowLevelUpAnimation] = useState(false);
  const user = auth.currentUser;

  // Check for Daily Reward - move inside useCallback
  const checkDailyReward = useCallback(async () => {
    if (!user) return;
    
    const docRef = doc(db, 'users', user.uid);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      const lastReward = data.lastDailyReward;
      const today = new Date().toISOString().slice(0, 10);
      
      if (lastReward !== today) {
        const xpReward = 5;
        const popsReward = 1;
        
        await setDoc(docRef, {
          xp: (data.xp || 0) + xpReward,
          pops: (data.pops || 0) + popsReward,
          lastDailyReward: today
        }, { merge: true });
        
        toast.success(`Daily Reward: +${xpReward}XP, +${popsReward} Pops! 🎁`, {
          position: "top-right",
          autoClose: 3000
        });
      }
    }
  }, [user]);

  // Check for Achievements - move inside useCallback
  const checkAchievements = useCallback(async (userData) => {
    const unlockedAchievements = [];
    
    // Check Level 5 Achievement
    if (getLevel(userData.xp) >= 5 && !userData.achievements?.includes('level_5')) {
      unlockedAchievements.push(ACHIEVEMENTS.LEVEL_5);
    }
    
    // Check Win Streak Achievement
    if (userData.winStreak >= 3 && !userData.achievements?.includes('win_streak')) {
      unlockedAchievements.push(ACHIEVEMENTS.WIN_STREAK);
    }
    
    // If any achievements were unlocked
    if (unlockedAchievements.length > 0) {
      const docRef = doc(db, 'users', user.uid);
      const totalXPReward = unlockedAchievements.reduce((sum, ach) => sum + ach.xpReward, 0);
      
      await setDoc(docRef, {
        xp: (userData.xp || 0) + totalXPReward,
        achievements: [...(userData.achievements || []), ...unlockedAchievements.map(a => a.id)]
      }, { merge: true });

      // Update local achievements state
      setAchievements(prev => [...prev, ...unlockedAchievements.map(a => a.id)]);

      // Show achievement notifications
      unlockedAchievements.forEach(achievement => {
        toast.success(
          <div>
            {achievement.icon} Achievement Unlocked!<br/>
            <strong>{achievement.title}</strong><br/>
            +{achievement.xpReward}XP
          </div>,
          { position: "top-right", autoClose: 5000 }
        );
      });
    }
  }, [user]);

  // Update useEffect with dependencies
  useEffect(() => {
    if (user) {
      const docRef = doc(db, 'users', user.uid);
      let prevLevel;
      
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          setAchievements(data.achievements || []);
          const newXP = data.xp || 0;
          const newLevel = getLevel(newXP);
          
          if (prevLevel && newLevel > prevLevel) {
            setShowLevelUpAnimation(true);
            toast.success(`🎮 Level Up! You reached Level ${newLevel}!`, {
              position: "top-center",
              autoClose: 3000
            });
            setTimeout(() => setShowLevelUpAnimation(false), 3000);
          }
          
          prevLevel = newLevel;
          checkAchievements(data);
        }
      });
      
      checkDailyReward();
      
      return () => unsubscribe();
    }
  }, [user, checkAchievements, checkDailyReward]);

  // Render Achievement List
  return (
    <div className="achievements-container">
      {showLevelUpAnimation && (
        <div className="level-up-animation">
          LEVEL UP! 🎮✨
        </div>
      )}
      <h2>Achievements</h2>
      <div className="achievements-grid">
        {Object.values(ACHIEVEMENTS).map(achievement => (
          <div 
            key={achievement.id}
            className={`achievement-card ${
              achievements.includes(achievement.id) ? 'unlocked' : 'locked'
            }`}
          >
            <div className="achievement-icon">{achievement.icon}</div>
            <h3>{achievement.title}</h3>
            <p>{achievement.description}</p>
            <span className="xp-reward">+{achievement.xpReward} XP</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default AchievementsXP;