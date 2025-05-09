import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  getDocs
} from 'firebase/firestore';
import './PleLiveDashboard.css';
import InactivePle from './InactivePle';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

const EMOJIS = ['🔥', '😂', '😱', '👏', '👎'];

export default function PLELiveDashboard() {
  const { pleId } = useParams();
  const db = getFirestore();

  // FIX: Track user state with onAuthStateChanged
  const [user, setUser] = useState(() => getAuth().currentUser);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const [cooldown, setCooldown] = useState(false);
  const [votedPolls, setVotedPolls] = useState(() => {
    const stored = localStorage.getItem('votedPolls');
    return stored ? JSON.parse(stored) : [];
  });

  const [pollQuestions, setPollQuestions] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [floatingEmojis, setFloatingEmojis] = useState([]);
  const [isLive, setIsLive] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [reactionTimestamps, setReactionTimestamps] = useState([]);

  const updateLiveStatus = useCallback(async (status) => {
    const liveStatusRef = doc(db, 'liveStatus', pleId);
    try {
      await updateDoc(liveStatusRef, { isLive: status });
    } catch (error) {
      console.error("Error updating live status: ", error);
    }
  }, [db, pleId]);

  useEffect(() => {
    const countdownEndTime = new Date('2025-05-11T04:30:00+05:30').getTime();

    const interval = setInterval(() => {
      const timeLeft = countdownEndTime - Date.now();
      if (timeLeft <= 0) {
        clearInterval(interval);
        setIsLive(true);
        updateLiveStatus(true);
      } else {
        setCountdown(formatTimeLeft(timeLeft));
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [updateLiveStatus]);

  const formatTimeLeft = (timeLeft) => {
    const hours = Math.floor((timeLeft / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((timeLeft / (1000 * 60)) % 60);
    const seconds = Math.floor((timeLeft / 1000) % 60);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  useEffect(() => {
    const liveStatusRef = doc(db, 'liveStatus', pleId);
    const unsubscribe = onSnapshot(liveStatusRef, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setIsLive(data.isLive);
      }
    });
    return () => unsubscribe();
  }, [pleId, db]);

  useEffect(() => {
    const fetchPolls = async () => {
      try {
        const snapshot = await getDocs(collection(db, 'polls'));
        const polls = snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
          .filter(poll => poll.pleId === pleId);
        setPollQuestions(polls);
      } catch (error) {
        console.error("Error fetching polls: ", error);
      }
    };
    fetchPolls();
  }, [db, pleId]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'chatRooms', pleId, 'messages'), (snapshot) => {
      const msgs = snapshot.docs.map((doc) => doc.data().message);
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, [db, pleId]);

  const handleReact = (emoji, event) => {
    if (!user) {
      toast.info("Please sign in to react!");
      return;
    }
    const now = Date.now();
    const recent = reactionTimestamps.filter((t) => now - t < 30000);
    if (recent.length >= 10) {
      setCooldown(true);
      toast.info("🚫 10 reactions per 30s limit!");
      setTimeout(() => {
        setCooldown(false);
      }, 3000);
      return;
    }

    setReactionTimestamps([...recent, now]);
    toast.info(`You reacted with ${emoji}`);

    const position = {
      top: event.clientY - 20,
      left: event.clientX - 20,
    };
    setFloatingEmojis((prev) => [...prev, { emoji, position, id: Math.random() }]);
  };

  const handlePollVote = async (pollId, optionIndex) => {
    if (!user) {
      toast.info("Please sign in to vote!");
      return;
    }

    const poll = pollQuestions.find((p) => p.id === pollId);
    if (!poll || votedPolls.includes(pollId)) {
      toast.info("You’ve already voted!");
      return;
    }

    const pollRef = doc(db, 'polls', pollId);
    const updatedVotes = [...(poll.votes || [])];
    updatedVotes[optionIndex]++;

    try {
      await updateDoc(pollRef, { votes: updatedVotes });
      setVotedPolls((prev) => {
        const updated = [...prev, pollId];
        localStorage.setItem('votedPolls', JSON.stringify(updated));
        return updated;
      });
    } catch (error) {
      console.error("Error voting on poll: ", error);
    }
  };

  const handleSendMessage = async () => {
    if (!user) {
      toast.info("Please sign in to chat!");
      return;
    }
    if (message.trim()) {
      try {
        await addDoc(collection(db, 'chatRooms', pleId, 'messages'), {
          message,
          timestamp: new Date(),
        });
        setMessage('');
      } catch (err) {
        console.error("Error sending message: ", err);
      }
    }
  };

  return (
    <>
      <ToastContainer position="top-center" autoClose={2000} />
      <div className="dashboard-container">
        <h2 className="dashboard-title">Backlash</h2>

        {!isLive && (
          <div className="countdown">
            <h3>Countdown to Live: {countdown}</h3>
          </div>
        )}

        {isLive ? (
          <>
            <section className="live-chat-container">
              <h3 className="section-title">💬 Live Chat</h3>
              <div className="messages">
                {messages.length > 0 ? (
                  messages.map((msg, index) => (
                    <div key={index} className="live-message">{msg}</div>
                  ))
                ) : (
                  <p>No messages yet</p>
                )}
              </div>
              <div className="live-chat-input">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Send a message..."
                />
                <button onClick={handleSendMessage}>Send</button>
              </div>
            </section>

            <section className="reactions-section">
              <h3 className="section-title">🔥 Live Reactions</h3>
              <div className="reactions">
                {EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={(event) => handleReact(emoji, event)}
                    className="reaction-btn"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
              {cooldown && (
                <p className="cooldown-msg">🚫 Limit reached – try again in a moment!</p>
              )}
            </section>

            <section className="polls-section">
              <h3 className="section-title">🧐 Live Polls</h3>
              {pollQuestions.length > 0 ? (
                pollQuestions.map((poll) => {
                  const total = (poll.votes || []).reduce((a, b) => a + b, 0);
                  return (
                    <div key={poll.id} className="poll-container">
                      <div className="poll-question">{poll.question}</div>
                      {(poll.options || []).map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handlePollVote(poll.id, index)}
                          disabled={votedPolls.includes(poll.id)}
                          className={`poll-button ${votedPolls.includes(poll.id) ? 'voted' : ''}`}
                        >
                          {option}
                        </button>
                      ))}
                      <div className="poll-progress">
                        {(poll.votes || []).map((vote, index) => {
                          const percent = total ? (vote / total) * 100 : 0;
                          return (
                            <div
                              key={index}
                              className="poll-bar"
                              style={{ width: `${percent}%` }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  );
                })
              ) : (
                <p>No polls available</p>
              )}
            </section>
          </>
        ) : (
          <InactivePle />
        )}

        {floatingEmojis.map(({ emoji, position, id }) => (
          <div
            key={id}
            className="emoji-float"
            style={{ top: `${position.top}px`, left: `${position.left}px` }}
          >
            {emoji}
          </div>
        ))}
      </div>
    </>
  );
}