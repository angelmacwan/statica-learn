import React, { useState, useCallback, useEffect } from 'react'
import PythonEditor from './PythonEditor.jsx'

export default function PythonEditorPanel({ 
  pyReady, 
  pyError, 
  onRun, 
  onChange, 
  onNext, 
  onPrev, 
  canPrev, 
  isCorrect, 
  savedCode,
  initialCode
}) {
  const [code, setCode] = useState(savedCode || initialCode)

  useEffect(() => {
    setCode(savedCode || initialCode)
  }, [savedCode, initialCode])

  const handleReset = useCallback(() => {
    setCode(initialCode)
    onChange?.(initialCode)
  }, [onChange, initialCode])

  const handleRun = useCallback(() => {
    onRun(code)
  }, [code, onRun])

  const handleCodeChange = useCallback((newCode) => {
    setCode(newCode)
    onChange?.(newCode)
  }, [onChange])

  return (
    <div className="editor-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="editor-toolbar" style={{ padding: '0.5rem 1rem', background: 'var(--bg-layer)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <span className="editor-label" style={{ fontSize: '11px', fontWeight: 600, color: 'var(--text-secondary)' }}>Python Editor</span>
        <span className="editor-hint">
          {pyReady ? (
            <span style={{ color: 'var(--color-green)', fontSize: '11px' }}>● Python Ready</span>
          ) : pyError ? (
            <span style={{ color: 'var(--color-red)', fontSize: '11px' }}>● Python Error</span>
          ) : (
            <span style={{ color: 'var(--color-yellow)', fontSize: '11px' }}>● Loading Python…</span>
          )}
        </span>
      </div>

      <div style={{ flex: 1, minHeight: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        <PythonEditor
          value={code}
          onChange={handleCodeChange}
          onRun={handleRun}
          disabled={!pyReady}
        />
      </div>

      <div className="editor-actions" style={{ padding: '0.5rem 1rem', borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-layer)', display: 'flex', gap: '0.5rem', alignItems: 'center', flexShrink: 0 }}>
        <button
          className="btn btn-primary"
          onClick={handleRun}
          disabled={!pyReady}
          id="run-code-btn"
        >
          ▶ Run
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={handleReset}
          id="reset-code-btn"
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
