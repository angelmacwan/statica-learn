import React from 'react'
import ResultTable from './ResultTable.jsx'

export default function ResultsPanel({ queryResult, expectedResult, isCorrect, hasRun }) {
  return (
    <div className="results-panel">
      {/* Status header */}
      <div className="results-header">
        <div className="results-header-left">
          <span style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--text-secondary)' }}>
            Results
          </span>
          {hasRun && isCorrect !== null && (
            <span className={`result-status ${isCorrect ? 'status-correct' : 'status-wrong'}`}>
              {isCorrect ? (
                <> <span>✓</span> Correct! </>
              ) : (
                <> <span>✗</span> Not quite — compare the outputs below </>
              )}
            </span>
          )}
        </div>

        {hasRun && isCorrect && (
          <div style={{
            fontSize: '12px',
            background: 'var(--color-green-bg)',
            color: 'var(--color-green)',
            padding: '3px 10px',
            borderRadius: '2px',
            fontWeight: 500,
          }}>
            ✓ Challenge solved!
          </div>
        )}
      </div>

      {/* Two-pane result area */}
      <div className="results-body">
        {/* Your output */}
        <div className="result-pane">
          <div className="result-pane-header">
            Your Output
            {queryResult?.error && (
              <span style={{ color: 'var(--color-red)', marginLeft: '0.5rem', textTransform: 'none', letterSpacing: 'normal', fontWeight: 400 }}>
                — SQL Error
              </span>
            )}
          </div>
          <div className="result-pane-body">
            {!hasRun ? (
              <div className="result-placeholder">
                <div className="result-placeholder-icon">◈</div>
                <div className="result-placeholder-text">Run your query to see output</div>
              </div>
            ) : (
              <ResultTable result={queryResult} />
            )}
          </div>
        </div>

        {/* Expected output */}
        <div className="result-pane">
          <div className="result-pane-header">
            Expected Output
          </div>
          <div className="result-pane-body">
            {!expectedResult ? (
              <div className="result-placeholder">
                <div className="result-placeholder-icon">◈</div>
                <div className="result-placeholder-text">Loading expected result…</div>
              </div>
            ) : (
              <ResultTable result={expectedResult} />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
