import { useState, useEffect, useRef, useCallback } from 'react'

let SQL = null

async function loadSqlJs() {
  if (SQL) return SQL
  const initSqlJs = (await import('sql.js')).default
  SQL = await initSqlJs({ locateFile: (file) => `/${file}` })
  return SQL
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
      try {
        const SqlJs = await loadSqlJs()
        if (cancelled) return

        const newDb = new SqlJs.Database()
        newDb.run(challenge.schema_sql)
        newDb.run(challenge.seed_sql)

        // Pre-run answer to get expected result
        const expected = runQuery(newDb, challenge.answer_sql)

        if (cancelled) {
          newDb.close()
          return
        }

        dbRef.current = newDb
        setDb(newDb)
        setExpectedResult(expected)
        setDbReady(true)
      } catch (err) {
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

  if (ordered) {
    // Compare preserving order but normalize values
    const userRows = userResult.rows?.map((row) =>
      result.columns?.map((_, i) =>
        row[i] === null ? 'null' : String(row[i]).trim()
      )
    )
    // Simpler ordered comparison
    const userStr = JSON.stringify(
      userResult.rows?.map((row) =>
        row.map((v) => (v === null ? 'null' : String(v).trim()))
      )
    )
    const expStr = JSON.stringify(
      expectedResult.rows?.map((row) =>
        row.map((v) => (v === null ? 'null' : String(v).trim()))
      )
    )
    return userStr === expStr
  }

  return JSON.stringify(normalize(userResult)) === JSON.stringify(normalize(expectedResult))
}
