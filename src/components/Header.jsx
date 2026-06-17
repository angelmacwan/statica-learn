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
          style={{ textDecoration: 'none', background: 'none', border: 'none', padding: 0, cursor: 'pointer', fontFamily: 'inherit' }}
        >
          <div className="app-logo-icon">S</div>
          <span className="app-logo-name">Statica Learn</span>
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
