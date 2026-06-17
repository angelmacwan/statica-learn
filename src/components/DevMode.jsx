import React, { useState } from 'react'

export default function DevMode({ challenge, expectedResult, onTestAll, testResults }) {
  const [collapsed, setCollapsed] = useState(false)

  if (!challenge) return null

  return (
    <div className="dev-panel">
      <div className="dev-panel-header">
        <span>🛠 Dev Mode</span>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <button
            onClick={onTestAll}
            style={{
              background: 'rgba(190,149,255,0.15)',
              border: '1px solid rgba(190,149,255,0.3)',
              color: 'var(--color-purple)',
              cursor: 'pointer',
              padding: '2px 8px',
              fontSize: '10px',
              borderRadius: '2px',
              fontFamily: 'inherit',
              fontWeight: 600,
            }}
          >
            Test All Challenges
          </button>
          <button
            onClick={() => setCollapsed((v) => !v)}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--color-purple)',
              cursor: 'pointer',
              fontSize: '14px',
              padding: '0 4px',
            }}
          >
            {collapsed ? '▲' : '▼'}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="dev-panel-body">
          <div>
            <div className="dev-section-label">Current Challenge ID</div>
            <div className="dev-code">{challenge.id}</div>
          </div>

          <div>
            <div className="dev-section-label">Answer SQL</div>
            <div className="dev-code">{challenge.answer_sql}</div>
          </div>

          <div>
            <div className="dev-section-label">Expected Result</div>
            <div className="dev-code">
              {expectedResult
                ? expectedResult.error
                  ? `ERROR: ${expectedResult.error}`
                  : `${expectedResult.rows?.length ?? 0} rows — columns: [${expectedResult.columns?.join(', ')}]`
                : 'Loading…'
              }
            </div>
          </div>

          {testResults && (
            <div>
              <div className="dev-section-label">Test All Results</div>
              {testResults.map((r) => (
                <div
                  key={r.id}
                  className={`dev-test-result ${r.ok ? 'dev-test-pass' : 'dev-test-fail'}`}
                >
                  {r.ok ? '✓' : '✗'} {r.id}: {r.ok ? 'OK' : r.error}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
