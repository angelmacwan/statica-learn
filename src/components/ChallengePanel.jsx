import React, { useState, useCallback } from 'react'
import SQLEditor from './SQLEditor.jsx'
import SchemaViewer from './SchemaViewer.jsx'

const DEFAULT_QUERY = `-- Write your SQL query here
-- Press Ctrl+Enter (Cmd+Enter on Mac) to run

SELECT `

export default function ChallengePanel({
  challenge,
  dbReady,
  dbError,
  onRun,
  onNext,
  onPrev,
  canPrev,
  isCorrect,
}) {
  const [query, setQuery] = useState(DEFAULT_QUERY)
  const [hintVisible, setHintVisible] = useState(false)

  // Reset editor and hint when challenge changes
  const challengeId = challenge?.id
  const prevIdRef = React.useRef(null)
  if (prevIdRef.current !== challengeId) {
    prevIdRef.current = challengeId
  }

  const handleReset = useCallback(() => {
    setQuery(DEFAULT_QUERY)
    setHintVisible(false)
  }, [])

  const handleRun = useCallback(() => {
    onRun(query)
  }, [query, onRun])

  // Reset state when challenge changes
  React.useEffect(() => {
    setQuery(DEFAULT_QUERY)
    setHintVisible(false)
  }, [challengeId])

  if (!challenge) return null

  return (
    <div className="challenge-panel">
      {/* Meta badges */}
      <div className="challenge-meta">
        <span className="dataset-badge">{challenge.dataset}</span>
        <span className={`difficulty-badge ${challenge.difficulty}`}>
          {challenge.difficulty}
        </span>
        {challenge.ordered && (
          <span style={{
            fontSize: '11px',
            color: 'var(--color-yellow)',
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
          }}>
            ↕ Order matters
          </span>
        )}
      </div>

      {/* Challenge prompt */}
      <div className="challenge-body">
        <h1 className="challenge-title">{challenge.title}</h1>
        <p className="challenge-prompt">{challenge.prompt}</p>

        {challenge.hint && (
          <>
            <button
              className="hint-toggle"
              onClick={() => setHintVisible((v) => !v)}
              id={`hint-toggle-${challenge.id}`}
            >
              <span>{hintVisible ? '▾' : '▸'}</span>
              {hintVisible ? 'Hide hint' : 'Show hint'}
            </button>
            {hintVisible && (
              <div className="hint-box">{challenge.hint}</div>
            )}
          </>
        )}
      </div>

      {/* Editor section */}
      <div className="editor-section">
        <div className="editor-toolbar">
          <span className="editor-label">SQL Editor</span>
          <span className="editor-hint">
            {dbReady ? (
              <span style={{ color: 'var(--color-green)', fontSize: '11px' }}>
                ● DB Ready
              </span>
            ) : dbError ? (
              <span style={{ color: 'var(--color-red)', fontSize: '11px' }}>
                ● DB Error
              </span>
            ) : (
              <span style={{ color: 'var(--color-yellow)', fontSize: '11px' }}>
                ● Loading DB…
              </span>
            )}
          </span>
        </div>

        <SQLEditor
          value={query}
          onChange={setQuery}
          onRun={handleRun}
          disabled={!dbReady}
        />

        <div className="editor-actions">
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
          <div className="challenge-nav">
            <button
              className="btn btn-ghost btn-sm"
              onClick={onPrev}
              disabled={!canPrev}
              id="prev-challenge-btn"
              title="Previous challenge"
            >
              ← Prev
            </button>
            {isCorrect && (
              <button
                className="btn btn-success btn-sm"
                onClick={onNext}
                id="next-challenge-btn"
              >
                Next →
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Schema viewer */}
      <SchemaViewer schemaSql={challenge.schema_sql} />
    </div>
  )
}
