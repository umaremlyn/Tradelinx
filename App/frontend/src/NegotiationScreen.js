import React, { useEffect, useState } from 'react';
import './NegotiationScreen.css';
// import { fetchMessages } from './api.extra';
// TODO: Implement fetchMessages in ./api.js or remove usage if not needed

const conversationId = 'demo'; // Replace with actual conversation id from backend or route

const NegotiationScreen = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMessages(conversationId)
      .then(data => {
        setMessages(data.messages || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Could not load messages');
        setLoading(false);
      });
  }, []);

  return (
    <div className="negotiation-chat-container">
      <div className="negotiation-chat-messages">
        {loading && <div>Loading...</div>}
        {error && <div>{error}</div>}
        {!loading && !error && messages.map((msg, i) => (
          <div key={i} className={`negotiation-chat-bubble ${msg.sender === 'me' ? 'me' : 'other'}`}>{msg.text}</div>
        ))}
      </div>
      <div className="negotiation-chat-input-row">
        <input
          className="negotiation-chat-input"
          placeholder="Type your message..."
          value={input}
          onChange={e => setInput(e.target.value)}
        />
        <button className="negotiation-chat-send-btn">▶️</button>
      </div>
    </div>
  );
};

export default NegotiationScreen;
