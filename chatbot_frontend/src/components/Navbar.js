import React from 'react';
import './Navbar.css';

// PUBLIC_INTERFACE
export default function Navbar({ onToggleTheme, theme = 'light' }) {
  /** Top navigation bar with brand and theme toggle button. */
  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo" aria-hidden>🤖</span>
        <span className="navbar__title">Ocean Chat</span>
      </div>
      <button className="navbar__toggle" onClick={onToggleTheme} aria-label="Toggle theme">
        {theme === 'light' ? '🌙' : '🌞'}
      </button>
    </header>
  );
}
