import React, { useState, useRef } from 'react';

// PUBLIC_INTERFACE
export default function MessageInput({ onSend, disabled }) {
  /** Message input area with Enter-to-send and button. */
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      triggerSend();
    }
  };

  const triggerSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
    textareaRef.current?.focus();
  };

  return (
    <div className="inputbar">
      <textarea
        ref={textareaRef}
        className="inputbar__textarea"
        placeholder="Type your message..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={1}
        disabled={disabled}
        aria-label="Message input"
      />
      <button className="inputbar__send" onClick={triggerSend} disabled={disabled || !value.trim()} aria-label="Send message">
        Send
      </button>
    </div>
  );
}
