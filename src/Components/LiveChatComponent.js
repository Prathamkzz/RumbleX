// LiveChat.js
import React, { useEffect, useState } from 'react';
import { getFirestore, collection, addDoc, serverTimestamp, onSnapshot, query, orderBy } from 'firebase/firestore';
import { auth } from '../firebaseConfig';

const db = getFirestore();

const LiveChat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const user = auth.currentUser;

  useEffect(() => {
    const q = query(collection(db, 'LIVECHAT'), orderBy('timestamp', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
    });
    return () => unsubscribe();
  }, []);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!user) {
      alert('You must be signed in to send messages.');
      return;
    }

    await addDoc(collection(db, 'LIVECHAT'), {
      message: message.trim(),
      userId: user.uid,
      username: user.displayName || 'Anonymous',
      timestamp: serverTimestamp()
    });

    setMessage('');
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h2>Live Chat</h2>
      <div style={{ maxHeight: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '10px', marginBottom: '10px' }}>
        {messages.map(msg => (
          <div key={msg.id} style={{ marginBottom: '10px' }}>
            <strong>{msg.username}</strong>: {msg.message}
          </div>
        ))}
      </div>
      <form onSubmit={sendMessage} style={{ display: 'flex', gap: '10px' }}>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          style={{ flex: 1, padding: '8px' }}
        />
        <button type="submit" style={{ padding: '8px 12px' }}>Send</button>
      </form>
    </div>
  );
};

export default LiveChat;
