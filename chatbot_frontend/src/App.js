import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import './index.css';
import { sendMessage } from './services/api';
import ChatMessage from './components/ChatMessage';
import TopNav from './components/TopNav';
import ChatInput from './components/ChatInput';

// PUBLIC_INTERFACE
function App() {
  /** Main React component that renders:
   * - Top navigation bar
   * - Scrollable chat window with bubbles
   * - Fixed input at the bottom
   * Handles communication with backend via REST.
   */
  const [messages, setMessages] = useState([
    { id: 'sys-1', role: 'assistant', content: "Hello! I'm your AI assistant. How can I help you today?" }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    // Auto-scroll to bottom when messages change
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, loading]);

  // PUBLIC_INTERFACE
  const handleSend = async (text) => {
    /** Sends a user message to the backend and appends assistant response. */
    if (!text || loading) return;

    setError('');
    const userMsg = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text
    };
    setMessages(prev => [...prev, userMsg]);
    setLoading(true);
    try {
      // Expecting backend to respond with: { reply: "..." }
      const resp = await sendMessage(text);
      const assistantText = resp?.reply ?? 'Sorry, I did not understand that.';
      const assistantMsg = {
        id: `asst-${Date.now()}`,
        role: 'assistant',
        content: assistantText
      };
      setMessages(prev => [...prev, assistantMsg]);
    } catch (e) {
      console.error(e);
      setError('Failed to reach the chatbot. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ocean-app">
      <TopNav title="Ocean Chatbot" subtitle="Your AI assistant" />
      <main className="chat-shell">
        <div className="chat-gradient" />
        <div className="chat-container">
          <div className="chat-window" ref={scrollRef} role="log" aria-live="polite">
            {messages.map(m => (
              <ChatMessage key={m.id} role={m.role} content={m.content} />
            ))}
            {loading && (
              <div className="typing">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
              </div>
            )}
            {error && (
              <div className="error-banner" role="alert">
                {error}
              </div>
            )}
          </div>
          <ChatInput onSend={handleSend} disabled={loading} />
        </div>
      </main>
      <footer className="footer-note">
        Built with Ocean Professional theme
      </footer>
    </div>
  );
}

export default App;
