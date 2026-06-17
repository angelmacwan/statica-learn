import { useState, useEffect, useRef, useCallback } from 'react'

let SQL = null

export async function loadSqlJs() {
  if (SQL) return SQL
  console.log('loadSqlJs: Importing sql.js...')
  try {
    const module = await import('sql.js')
    console.log('loadSqlJs: Module imported', module)
    
    // Handle different export patterns
    let initSqlJs = module.default
    
    // Fallback for some environments where the module itself is the function
    // or it's a CJS module imported without a default export
    if (typeof initSqlJs !== 'function') {
      if (typeof module === 'function') {
        initSqlJs = module
      } else if (typeof window !== 'undefined' && typeof window.initSqlJs === 'function') {
        initSqlJs = window.initSqlJs
      }
    }

    if (typeof initSqlJs !== 'function') {
      throw new Error(`initSqlJs is not a function (type: ${typeof initSqlJs}). Module keys: ${Object.keys(module)}`)
    }
    
    SQL = await initSqlJs({ 
      // Ensure the worker and wasm are loaded from the correct path
      locateFile: (file) => `/${file}` 
    })
    return SQL
  } catch (err) {
    console.error('loadSqlJs: Failed to load sql.js', err)
    throw err
  }
}

export function useDatabase(challenge) {
  const [db, setDb] = useState(null)
  const [dbReady, setDbReady] = useState(false)
  const [expectedResult, setExpectedResult] = useState(null)
  const [dbError, setDbError] = useState(null)
  const dbRef = useRef(null)

  useEffect(() => {
    if (!challenge) return

    setDbReady(false)
    setExpectedResult(null)
    setDbError(null)

    // Close old DB
    if (dbRef.current) {
      try { dbRef.current.close() } catch (_) {}
    }

    let cancelled = false

    async function init() {
      console.log('useDatabase: Initializing DB for challenge', challenge.id)
      try {
        const SqlJs = await loadSqlJs()
        console.log('useDatabase: sql.js loaded')
        if (cancelled) return

        const newDb = new SqlJs.Database()
        newDb.run(challenge.schema_sql)
        newDb.run(challenge.seed_sql)
        console.log('useDatabase: Schema and seed data applied')

        // Pre-run answer to get expected result
        const expected = runQuery(newDb, challenge.answer_sql)
        console.log('useDatabase: Expected result calculated')

        if (cancelled) {
          newDb.close()
          return
        }

        dbRef.current = newDb
        setDb(newDb)
        setExpectedResult(expected)
        setDbReady(true)
        console.log('useDatabase: DB Ready')
      } catch (err) {
        console.error('useDatabase: Error during init', err)
        if (!cancelled) {
          setDbError(err.message)
          setDbReady(false)
        }
      }
    }

    init()

    return () => { cancelled = true }
  }, [challenge?.id])

  const executeQuery = useCallback((sql) => {
    if (!dbRef.current) return { error: 'Database not ready' }
    return runQuery(dbRef.current, sql)
  }, [])

  return { dbReady, expectedResult, dbError, executeQuery }
}

function runQuery(db, sql) {
  try {
    const results = db.exec(sql.trim())
    if (!results || results.length === 0) {
      return { columns: [], rows: [], empty: true }
    }
    const { columns, values } = results[0]
    return {
      columns,
      rows: values.slice(0, 500),
      truncated: values.length > 500,
      totalRows: values.length,
    }
  } catch (err) {
    return { error: err.message }
  }
}

export function normalize(result) {
  if (!result || result.error || !result.rows) return []
  return result.rows
    .map((row) =>
      Object.fromEntries(
        result.columns.map((col, i) => [
          col.toLowerCase(),
          row[i] === null ? 'null' : String(row[i]).trim(),
        ])
      )
    )
    .sort((a, b) => JSON.stringify(a).localeCompare(JSON.stringify(b)))
}

export function checkAnswer(userResult, expectedResult, ordered = false) {
  if (!userResult || userResult.error) return false
  if (!expectedResult || expectedResult.error) return false

  const normalizeVal = (v) => (v === null || v === undefined ? 'null' : String(v).trim())

  if (ordered) {
    const userStr = JSON.stringify(
      userResult.rows?.map((row) => row.map(normalizeVal))
    )
    const expStr = JSON.stringify(
      expectedResult.rows?.map((row) => row.map(normalizeVal))
    )
    return userStr === expStr
  }

  return JSON.stringify(normalize(userResult)) === JSON.stringify(normalize(expectedResult))
}
