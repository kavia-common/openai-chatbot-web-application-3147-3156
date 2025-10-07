import React, { useCallback, useMemo, useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ChatWindow from './components/ChatWindow';
import MessageInput from './components/MessageInput';
import { sendMessage } from './api/client';
import './App.css';

let nextId = 1;

function now() { return new Date().toISOString(); }

// PUBLIC_INTERFACE
export default function App() {
  /** Root app rendering a chat interface with Ocean Professional theme. */
  const [theme, setTheme] = useState('light');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync theme to document attribute for CSS selectors
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const containerAttrs = useMemo(() => ({ 'data-theme': theme }), [theme]);

  const onToggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'));
  }, []);

  const handleSend = useCallback(async (text) => {
    const userMsg = { id: nextId++, role: 'user', content: text, timestamp: now() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);
    setError(null);
    try {
      const history = (messages.concat(userMsg)).slice(-10).map(m => ({ role: m.role, content: m.content }));
      const res = await sendMessage({ message: text, history });
      if (!res.ok) throw new Error(res.error || 'Failed to get response');
      const botMsg = { id: nextId++, role: 'assistant', content: res.reply, timestamp: now() };
      setMessages((prev) => [...prev, botMsg]);
    } catch (e) {
      setError(e.message);
      setMessages((prev) => prev.map(m => m.id === userMsg.id ? { ...m, status: 'failed' } : m));
    } finally {
      setLoading(false);
    }
  }, [messages]);

  const retryLast = useCallback(() => {
    const lastFailed = [...messages].reverse().find(m => m.status === 'failed' && m.role === 'user');
    if (lastFailed) handleSend(lastFailed.content);
  }, [messages, handleSend]);

  return (
    <div className="app" {...containerAttrs}>
      <Navbar onToggleTheme={onToggleTheme} theme={theme} />
      <main className="main">
        <ChatWindow messages={messages} loading={loading} />
        {error && (
          <div role="alert" style={{ color: 'var(--error)', margin: '8px 0' }}>
            {error} <button onClick={retryLast} style={{ marginLeft: 8 }}>Retry</button>
          </div>
        )}
        <MessageInput onSend={handleSend} disabled={loading} />
      </main>
    </div>
  );
}
