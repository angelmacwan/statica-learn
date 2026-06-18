import React from 'react'

export default function ResultTable({ result, label }) {
  if (!result) {
    return (
      <div className="result-placeholder">
        <div className="result-placeholder-icon">⬡</div>
        <div className="result-placeholder-text">Run a query to see results</div>
      </div>
    )
  }

  if (result.error) {
    return (
      <div className="result-error">
        <div className="result-error-label">SQL Error</div>
        <div className="result-error-msg">{result.error}</div>
      </div>
    )
  }

  if (result.empty || (result.rows && result.rows.length === 0)) {
    return (
      <div className="result-empty">
        Your query returned 0 rows.
      </div>
    )
  }

  const { columns, rows, truncated, totalRows } = result

  const numericColumns = React.useMemo(() => {
    if (!rows || rows.length === 0) return {}
    const isNum = {}
    columns.forEach((_, colIndex) => {
      // Check if all non-null values in this column are numeric
      const allNumeric = rows.every(row => {
        const val = row[colIndex]
        return val === null || val === undefined || val === '' || !isNaN(Number(val))
      })
      isNum[colIndex] = allNumeric
    })
    return isNum
  }, [columns, rows])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <div className="result-table-wrap" style={{ flex: 1, overflow: 'auto' }}>
        <table className="result-table">
          <thead>
            <tr>
              {columns.map((col, ci) => (
                <th key={col} style={{ textAlign: numericColumns[ci] ? 'right' : 'left' }}>{col}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri}>
                {row.map((cell, ci) => (
                  <td 
                    key={ci} 
                    title={cell === null ? 'NULL' : String(cell)}
                    style={{ 
                      textAlign: numericColumns[ci] ? 'right' : 'left',
                      fontVariantNumeric: numericColumns[ci] ? 'tabular-nums' : 'normal'
                    }}
                  >
                    {cell === null
                      ? <span style={{ color: 'var(--text-placeholder)', fontStyle: 'italic' }}>NULL</span>
                      : String(cell)
                    }
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{
        padding: '3px 12px',
        fontSize: '11px',
        color: 'var(--text-placeholder)',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-layer)',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <span>{rows.length} row{rows.length !== 1 ? 's' : ''}</span>
        {truncated && (
          <span style={{ color: 'var(--color-yellow)' }}>
            ⚠ Showing first 500 of {totalRows} rows
          </span>
        )}
      </div>
    </div>
  )
}
