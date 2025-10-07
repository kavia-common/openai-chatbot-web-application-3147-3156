import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';

// PUBLIC_INTERFACE
export default function ChatWindow({ messages, loading }) {
  /** Scrollable window displaying message bubbles and a typing indicator. */
  const endRef = useRef(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  return (
    <div className="chatwindow" role="log" aria-live="polite">
      {messages.map((m) => (
        <MessageBubble key={m.id} role={m.role} content={m.content} timestamp={m.timestamp} status={m.status} />
      ))}
      {loading && (
        <div className="bubble bubble--bot bubble--typing">
          <div className="bubble__content">Assistant is typing…</div>
        </div>
      )}
      <div ref={endRef} />
    </div>
  );
}
