import React, { useState, useMemo } from 'react'

function parseSchema(schemaSql) {
  const tables = []
  const tableRegex = /CREATE\s+TABLE\s+(\w+)\s*\(([^)]+)\)/gi
  let match
  while ((match = tableRegex.exec(schemaSql)) !== null) {
    const tableName = match[1]
    const columnsDef = match[2]
    const columns = columnsDef
      .split(',')
      .map((col) => col.trim())
      .filter(Boolean)
      .map((col) => {
        const parts = col.split(/\s+/)
        const name = parts[0]
        const type = parts[1] || ''
        const isPK = col.toUpperCase().includes('PRIMARY KEY')
        return { name, type, isPK }
      })
    tables.push({ name: tableName, columns })
  }
  return tables
}

export default function SchemaViewer({ schemaSql }) {
  const [open, setOpen] = useState(false)

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
