import React, { useState } from 'react'
import SchemaViewer from './SchemaViewer.jsx'

export default function ChallengeInfo({ challenge }) {
  const [hintVisible, setHintVisible] = useState(false)

  if (!challenge) return null

  return (
    <div className="challenge-info-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div className="challenge-meta" style={{ padding: '0.75rem 1rem', borderBottom: '1px solid var(--border-subtle)', flexShrink: 0 }}>
        <span className="dataset-badge">{challenge.dataset}</span>
        <span className={`difficulty-badge ${challenge.difficulty}`}>
          {challenge.difficulty}
        </span>
        {challenge.ordered && (
          <span style={{ fontSize: '11px', color: 'var(--color-yellow)', marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '3px' }}>
            ↕ Order matters
          </span>
        )}
      </div>

      <div className="challenge-body" style={{ flex: 1, overflowY: 'auto', padding: '1rem' }}>
        <h1 className="challenge-title" style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{challenge.title}</h1>
        <p className="challenge-prompt" style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>{challenge.prompt}</p>

        {challenge.hint && (
          <div style={{ marginBottom: '1.5rem' }}>
            <button
              className="hint-toggle"
              onClick={() => setHintVisible((v) => !v)}
            >
              <span>{hintVisible ? '▾' : '▸'}</span>
              {hintVisible ? 'Hide hint' : 'Show hint'}
            </button>
            {hintVisible && (
              <div className="hint-box">{challenge.hint}</div>
            )}
          </div>
        )}

        <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
          <SchemaViewer schemaSql={challenge.schema_sql} />
        </div>
      </div>
    </div>
  )
}
