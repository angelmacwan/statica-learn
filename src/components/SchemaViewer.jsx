import React, { useState, useMemo } from 'react'

function parseSchema(schemaSql) {
  const tables = []
  // Improved regex to find CREATE TABLE blocks
  // It looks for CREATE TABLE, then the name, then everything inside the outermost parentheses
  const tableRegex = /CREATE\s+TABLE\s+(\w+)\s*\(([\s\S]*?)\)(?:;|$)/gi
  let match
  while ((match = tableRegex.exec(schemaSql)) !== null) {
    const tableName = match[1]
    const columnsDef = match[2]
    
    // Split columns by comma, but only those not inside parentheses
    const columns = []
    let currentColumn = ''
    let parenDepth = 0
    
    for (let i = 0; i < columnsDef.length; i++) {
      const char = columnsDef[i]
      if (char === '(') parenDepth++
      if (char === ')') parenDepth--
      
      if (char === ',' && parenDepth === 0) {
        columns.push(currentColumn.trim())
        currentColumn = ''
      } else {
        currentColumn += char
      }
    }
    if (currentColumn.trim()) {
      columns.push(currentColumn.trim())
    }

    const parsedColumns = columns
      .filter(Boolean)
      .map((col) => {
        // Match column name and type, handling potential constraints
        const parts = col.split(/\s+/)
        const name = parts[0]
        const type = parts[1] || ''
        const isPK = col.toUpperCase().includes('PRIMARY KEY')
        return { name, type, isPK }
      })
    tables.push({ name: tableName, columns: parsedColumns })
  }
  return tables
}

export default function SchemaViewer({ schemaSql }) {
  const [open, setOpen] = useState(true)

  const tables = useMemo(() => parseSchema(schemaSql || ''), [schemaSql])

  return (
    <div className="schema-panel">
      <button
        className={`schema-toggle-btn ${open ? 'open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        id="schema-toggle"
      >
        <span>Schema Reference — {tables.length} table{tables.length !== 1 ? 's' : ''}</span>
        <span style={{ fontSize: '10px', opacity: 0.7 }}>{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="schema-body">
          {tables.map((table) => (
            <div key={table.name} className="schema-table">
              <div className="schema-table-name">{table.name}</div>
              <ul className="schema-columns">
                {table.columns.map((col) => (
                  <li key={col.name} className="schema-column">
                    <span className="schema-column-name">{col.name}</span>
                    <span className="schema-column-type">{col.type}</span>
                    {col.isPK && <span className="schema-column-pk">PK</span>}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
