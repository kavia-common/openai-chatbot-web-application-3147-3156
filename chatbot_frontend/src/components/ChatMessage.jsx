import React from 'react';

/**
 * ChatMessage renders a single message bubble with role-specific styling.
 * role: 'user' | 'assistant'
 */
const ChatMessage = ({ role = 'assistant', content = '' }) => {
  const isUser = role === 'user';
  const initials = isUser ? 'U' : 'A';

  return (
    <div className={`msg ${isUser ? 'user' : 'assistant'}`} aria-label={`${role} message`}>
      <div className="avatar" aria-hidden="true">{initials}</div>
      <div className="bubble">
        {content}
      </div>
    </div>
  );
};

export default ChatMessage;
