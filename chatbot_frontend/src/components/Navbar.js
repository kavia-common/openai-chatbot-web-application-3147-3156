import React from 'react';
import './Navbar.css';
import { CONFIG } from '../config';

// PUBLIC_INTERFACE
export default function Navbar({ onToggleTheme, theme = 'light' }) {
  /** Top navigation bar with brand, API base URL badge, and theme toggle button. */
  const apiBase = CONFIG.API_BASE_URL;

  return (
    <header className="navbar">
      <div className="navbar__brand">
        <span className="navbar__logo" aria-hidden>🤖</span>
        <span className="navbar__title">Ocean Chat</span>
      </div>

      <div className="navbar__right">
        <span
          className="navbar__api-badge"
          title="Current API base URL"
          aria-label={`Current API base URL: ${apiBase}`}
        >
          <span className="sr-only">API base URL: </span>
          API: {apiBase}
        </span>

        <button
          className="navbar__toggle"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? '🌙' : '🌞'}
        </button>
      </div>
    </header>
  );
}
