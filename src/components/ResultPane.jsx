import React from 'react'
import ResultTable from './ResultTable.jsx'

export default function ResultPane({ title, result, hasRun, isCorrect, showStatus }) {
  return (
    <div className="result-pane" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="result-pane-header" style={{ 
        padding: '0.375rem 1rem', 
        background: 'var(--bg-layer)', 
        borderBottom: '1px solid var(--border-subtle)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexShrink: 0,
        fontSize: '11px',
        fontWeight: 500,
        textTransform: 'uppercase',
        letterSpacing: '0.06em',
        color: 'var(--text-secondary)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span>{title}</span>
          {showStatus && hasRun && isCorrect !== null && (
            <span className={`result-status ${isCorrect ? 'status-correct' : 'status-wrong'}`} style={{ textTransform: 'none', letterSpacing: 'normal', fontSize: '12px' }}>
              {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
            </span>
          )}
        </div>
        {result?.error && (
          <span style={{ color: 'var(--color-red)', textTransform: 'none', letterSpacing: 'normal', fontWeight: 400 }}>
            SQL Error
          </span>
        )}
      </div>
      <div className="result-pane-body" style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {!result && !hasRun ? (
          <div className="result-placeholder">
            <div className="result-placeholder-icon">◈</div>
            <div className="result-placeholder-text">Run query to see {title.toLowerCase()}</div>
          </div>
        ) : !result ? (
          <div className="result-placeholder">
            <div className="result-placeholder-icon">◈</div>
            <div className="result-placeholder-text">Loading {title.toLowerCase()}…</div>
          </div>
        ) : (
          <ResultTable result={result} />
        )}
      </div>
    </div>
  )
}
