import React, { useState, useCallback, useEffect } from 'react'
import SQLEditor from './SQLEditor.jsx'

const DEFAULT_QUERY = `-- Write your SQL query here\n-- Press Ctrl+Enter (Cmd+Enter on Mac) to run\n\nSELECT `

export default function SQLEditorPanel({ 
  dbReady, 
  dbError, 
  onRun, 
  onChange, 
  onNext, 
  onPrev, 
  canPrev, 
  isCorrect, 
  savedQuery 
}) {
  const [query, setQuery] = useState(savedQuery || DEFAULT_QUERY)

  useEffect(() => {
    setQuery(savedQuery || DEFAULT_QUERY)
  }, [savedQuery])

  const handleReset = useCallback(() => {
    setQuery(DEFAULT_QUERY)
    onChange?.(DEFAULT_QUERY)
  }, [onChange])

  const handleRun = useCallback(() => {
    onRun(query)
  }, [query, onRun])

  const handleQueryChange = useCallback((newQuery) => {
    setQuery(newQuery)
    onChange?.(newQuery)
  }, [onChange])

  return (
    <div className="editor-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="editor-toolbar" style={{ padding: '0.5rem 1rem', background: 'var(--bg-layer)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <span className="editor-label" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>SQL Editor</span>
        <span className="editor-hint">
          {dbReady ? (
            <span style={{ color: 'var(--color-green)', fontSize: '11px' }}>● DB Ready</span>
          ) : dbError ? (
            <span style={{ color: 'var(--color-red)', fontSize: '11px' }}>● DB Error</span>
          ) : (
            <span style={{ color: 'var(--color-yellow)', fontSize: '11px' }}>● Loading DB…</span>
          )}
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <SQLEditor
          value={query}
          onChange={handleQueryChange}
          onRun={handleRun}
          disabled={!dbReady}
        />
      </div>

      <div className="editor-actions" style={{ padding: '0.5rem 1rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-layer)', display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
        <button
          className="btn btn-primary"
          onClick={handleRun}
          disabled={!dbReady}
          id="run-query-btn"
        >
          ▶ Run
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleReset}
          id="reset-query-btn"
        >
          ↺ Reset
        </button>
        
        <div style={{ flex: 1 }} />
        
        <div className="challenge-nav" style={{ display: 'flex', gap: '0.375rem' }}>
          <button
            className="btn btn-ghost btn-sm"
            onClick={onPrev}
            disabled={!canPrev}
            title="Previous challenge"
          >
            ← Prev
          </button>
          {isCorrect && (
            <button
              className="btn btn-success btn-sm"
              onClick={onNext}
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
