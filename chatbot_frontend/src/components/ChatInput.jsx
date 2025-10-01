import React, { useCallback, useState } from 'react';

/**
 * ChatInput is a controlled input at the bottom to send messages.
 * Props:
 *  - onSend: (text: string) => void
 *  - disabled: boolean
 */
const ChatInput = ({ onSend, disabled = false }) => {
  const [value, setValue] = useState('');

  const submit = useCallback(() => {
    const text = value.trim();
    if (!text || disabled) return;
    onSend?.(text);
    setValue('');
  }, [value, disabled, onSend]);

  const onKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className="input-bar" role="form" aria-label="chat input">
      <div className="input-inner">
        <textarea
          className="input"
          placeholder="Type your message..."
          rows={1}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          disabled={disabled}
          aria-label="Message to chatbot"
        />
        <button
          type="button"
          className="send-btn"
          onClick={submit}
          disabled={disabled || !value.trim()}
          aria-label="Send message"
          title="Send"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatInput;
