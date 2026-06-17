import React from 'react'

export default function Header({ currentIndex, total, completed, onGoTo }) {
  const completedCount = completed.length

  return (
    <header className="app-header">
      <div className="app-logo">
        <div className="app-logo-icon">S</div>
        <span className="app-logo-name">Statica Learn</span>
      </div>

      <div className="header-center">
        <div className="progress-dots" role="navigation" aria-label="Challenge navigation">
          {Array.from({ length: total }, (_, i) => (
            <button
              key={i}
              className={`progress-dot ${
                completed.includes(i) ? 'completed' : ''
              } ${i === currentIndex ? 'current' : ''}`}
              onClick={() => onGoTo(i)}
              title={`Challenge ${i + 1}${completed.includes(i) ? ' ✓' : ''}`}
              aria-label={`Go to challenge ${i + 1}`}
              aria-current={i === currentIndex ? 'step' : undefined}
            />
          ))}
        </div>
        <span className="progress-text">
          {completedCount}/{total} solved
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
