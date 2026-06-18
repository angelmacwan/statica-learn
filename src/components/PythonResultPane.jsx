import React from 'react'

export default function PythonResultPane({ title, result, hasRun, isCorrect, showStatus }) {
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
            Python Error
          </span>
        )}
      </div>
      <div className="result-pane-body" style={{ flex: 1, overflow: 'auto', minHeight: 0, padding: '1rem' }}>
        {!result && !hasRun ? (
          <div className="result-placeholder" style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>
            Run your code to see output
          </div>
        ) : !result ? (
          <div className="result-placeholder" style={{ color: 'var(--text-secondary)' }}>
            Loading…
          </div>
        ) : (
          <div className="python-output" style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap', color: result.error ? 'var(--color-red)' : 'var(--text-primary)' }}>
            {result.error && <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{result.error}</div>}
            {result.output || (!result.error && <span style={{ color: 'var(--text-placeholder)', fontStyle: 'italic' }}>No output</span>)}
          </div>
        )}
      </div>
    </div>
  )
}
