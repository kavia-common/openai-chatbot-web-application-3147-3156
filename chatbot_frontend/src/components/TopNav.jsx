import React from 'react';

/**
 * TopNav renders the sticky navigation with brand and accent.
 */
const TopNav = ({ title = 'Ocean Chatbot', subtitle = 'Professional' }) => {
  return (
    <header className="navbar" role="banner">
      <div className="nav-inner">
        <div className="brand">
          <div className="brand-mark" aria-hidden="true" />
          <div>
            <div className="brand-title">{title}</div>
            <div className="brand-subtitle">{subtitle}</div>
          </div>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
          <span
            style={{
              background: 'linear-gradient(135deg, rgba(37,99,235,0.12), rgba(255,255,255,0.9))',
              color: '#1f2937',
              border: '1px solid rgba(37,99,235,0.3)',
              boxShadow: '0 6px 16px rgba(37,99,235,0.12)',
              borderRadius: 999,
              padding: '6px 10px',
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: 0.3
            }}
          >
            Ocean Professional
          </span>
        </div>
      </div>
    </header>
  );
};

export default TopNav;
