import React from 'react';

// PUBLIC_INTERFACE
export default function MessageBubble({ role, content, timestamp, status }) {
  /** Renders a single chat message bubble. */
  const isUser = role === 'user';
  return (
    <div className={`bubble ${isUser ? 'bubble--user' : 'bubble--bot'}`}> 
      <div className="bubble__content">{content}</div>
      <div className="bubble__meta">
        <span className="bubble__time">{new Date(timestamp).toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})}</span>
        {status && <span className="bubble__status"> · {status}</span>}
      </div>
    </div>
  );
}
