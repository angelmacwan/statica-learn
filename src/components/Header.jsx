import React from 'react'
import { Link } from 'react-router-dom'

export default function Header({ currentIndex, challenges, challengeData, onGoTo, sidebarOpen, onToggleSidebar }) {
  const total = challenges.length
  const solvedCount = Object.values(challengeData || {}).filter(d => d.status === 'solved').length

  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <button
          className="btn btn-ghost btn-sm"
          onClick={onToggleSidebar}
          title={sidebarOpen ? 'Hide challenge list' : 'Show challenge list'}
          id="toggle-sidebar-btn"
          style={{ fontSize: '13px', padding: '0.25rem 0.5rem' }}
        >
          ☰
        </button>
        <Link 
          className="app-logo" 
          to="/"
          style={{ textDecoration: 'none', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <div className="app-logo-icon" style={{ background: 'none', borderRadius: 0, width: 'auto', height: 'auto', padding: 0 }}>
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              {/* Database cylinder body */}
              <ellipse cx="16" cy="8" rx="10" ry="4" fill="#4589ff" />
              <rect x="6" y="8" width="20" height="14" fill="#4589ff" />
              <ellipse cx="16" cy="22" rx="10" ry="4" fill="#0353e9" />
              {/* Shine lines */}
              <ellipse cx="16" cy="8" rx="10" ry="4" fill="none" stroke="#74aaff" strokeWidth="1" />
              <line x1="6" y1="14" x2="26" y2="14" stroke="#0353e9" strokeWidth="1" />
              <line x1="6" y1="19" x2="26" y2="19" stroke="#0353e9" strokeWidth="1" />
              {/* Highlight */}
              <ellipse cx="13" cy="7.5" rx="3" ry="1.2" fill="white" opacity="0.25" />
            </svg>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span className="app-logo-name" style={{ fontSize: '15px', fontWeight: 700, letterSpacing: '-0.01em' }}>StaticaLearn</span>
            <span style={{ fontSize: '11px', color: 'var(--text-placeholder)', fontWeight: 400, letterSpacing: '0.02em' }}>by StaticaLabs</span>
          </div>
        </Link>
      </div>

      <div className="header-center">
        <div className="progress-dots" role="navigation" aria-label="Challenge navigation">
          {challenges.map((ch, i) => {
            const status = challengeData[ch.id]?.status || 'none'
            return (
              <button
                key={ch.id}
                className={`progress-dot ${status} ${i === currentIndex ? 'current' : ''}`}
                onClick={() => onGoTo(i)}
                title={`${ch.title} (${status})${i === currentIndex ? ' - Current' : ''}`}
                aria-label={`Go to challenge ${i + 1}: ${ch.title}`}
                aria-current={i === currentIndex ? 'step' : undefined}
              />
            )
          })}
        </div>
        <span className="progress-text">
          {solvedCount}/{total} solved
        </span>
      </div>

      <div className="header-right">
        <span style={{
          fontSize: '12px',
          color: 'var(--text-secondary)',
          fontVariantNumeric: 'tabular-nums',
        }}>
          Challenge {currentIndex + 1} of {total}
        </span>
      </div>
    </header>
  )
}
