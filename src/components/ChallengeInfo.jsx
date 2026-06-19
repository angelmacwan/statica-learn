import React, { useState } from 'react'
import SchemaViewer from './SchemaViewer.jsx'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import remarkBreaks from 'remark-breaks'

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
        <div className="challenge-prompt markdown-body" style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>
          <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{challenge.prompt}</ReactMarkdown>
        </div>

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
              <div className="hint-box markdown-body">
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreaks]}>{challenge.hint}</ReactMarkdown>
              </div>
            )}
          </div>
        )}

        {challenge.schema_sql && (
          <div style={{ marginTop: 'auto', paddingTop: '1rem' }}>
            <SchemaViewer schemaSql={challenge.schema_sql} />
          </div>
        )}
      </div>
    </div>
  )
}
