import React from 'react'

export default function PythonTestCasesPane({ title, testCases }) {
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
        </div>
      </div>
      <div className="result-pane-body" style={{ flex: 1, overflow: 'auto', minHeight: 0 }}>
        {!testCases || testCases.length === 0 ? (
          <div className="result-placeholder" style={{ color: 'var(--text-secondary)', fontStyle: 'italic', padding: '1rem' }}>
            No test cases available
          </div>
        ) : (
          <div className="result-table-wrap">
            <table className="result-table">
              <thead>
                <tr>
                  <th>Input</th>
                  <th>Expected Output</th>
                </tr>
              </thead>
              <tbody>
                {testCases.map((tc, idx) => (
                  <tr key={idx}>
                    <td style={{ fontFamily: 'monospace' }}>{tc.input}</td>
                    <td style={{ fontFamily: 'monospace' }}>{tc.expected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
