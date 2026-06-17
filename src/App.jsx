import React, { useState, useCallback, useMemo } from 'react'
import challenges from './data/challenges.json'
import { useDatabase, checkAnswer } from './hooks/useDatabase.js'
import { useProgress } from './hooks/useProgress.js'
import Header from './components/Header.jsx'
import ChallengePanel from './components/ChallengePanel.jsx'
import ResultsPanel from './components/ResultsPanel.jsx'
import DevMode from './components/DevMode.jsx'

const IS_DEV = new URLSearchParams(window.location.search).get('dev') === 'true'

export default function App() {
  const { currentIndex, completed, markComplete, goToChallenge } = useProgress(challenges.length)
  const challenge = challenges[currentIndex]

  const { dbReady, expectedResult, dbError, executeQuery } = useDatabase(challenge)

  const [queryResult, setQueryResult] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [hasRun, setHasRun] = useState(false)
  const [devTestResults, setDevTestResults] = useState(null)

  // Reset result state when challenge changes
  const prevChallengeId = React.useRef(null)
  if (prevChallengeId.current !== challenge?.id) {
    prevChallengeId.current = challenge?.id
    // Can't set state during render, so handle via useEffect below
  }

  React.useEffect(() => {
    setQueryResult(null)
    setIsCorrect(null)
    setHasRun(false)
    setDevTestResults(null)
  }, [challenge?.id])

  const handleRun = useCallback((sql) => {
    if (!dbReady) return
    const result = executeQuery(sql)
    setQueryResult(result)
    setHasRun(true)

    if (!result.error) {
      const correct = checkAnswer(result, expectedResult, challenge?.ordered ?? false)
      setIsCorrect(correct)
      if (correct) {
        markComplete(currentIndex)
      }
    } else {
      setIsCorrect(false)
    }
  }, [dbReady, executeQuery, expectedResult, challenge, currentIndex, markComplete])

  const handleNext = useCallback(() => {
    if (currentIndex < challenges.length - 1) {
      goToChallenge(currentIndex + 1)
    }
  }, [currentIndex, goToChallenge])

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      goToChallenge(currentIndex - 1)
    }
  }, [currentIndex, goToChallenge])

  // Dev mode: test all challenges
  const handleTestAll = useCallback(async () => {
    const { default: initSqlJs } = await import('sql.js')
    const SQL = await initSqlJs({ locateFile: (f) => `/${f}` })
    const results = challenges.map((ch) => {
      try {
        const db = new SQL.Database()
        db.run(ch.schema_sql)
        db.run(ch.seed_sql)
        const r = db.exec(ch.answer_sql)
        db.close()
        return { id: ch.id, ok: true }
      } catch (err) {
        return { id: ch.id, ok: false, error: err.message }
      }
    })
    setDevTestResults(results)
  }, [])

  return (
    <>
      <Header
        currentIndex={currentIndex}
        total={challenges.length}
        completed={completed}
        onGoTo={goToChallenge}
      />

      <main className="app-main">
        {!dbReady && !dbError && (
          <div className="loading-overlay" style={{ position: 'relative', flex: 1, display: 'none' }} />
        )}

        <div className="panels-row">
          <ChallengePanel
            challenge={challenge}
            dbReady={dbReady}
            dbError={dbError}
            onRun={handleRun}
            onNext={handleNext}
            onPrev={handlePrev}
            canPrev={currentIndex > 0}
            isCorrect={isCorrect}
          />

          <ResultsPanel
            queryResult={queryResult}
            expectedResult={expectedResult}
            isCorrect={isCorrect}
            hasRun={hasRun}
          />
        </div>
      </main>

      {IS_DEV && (
        <DevMode
          challenge={challenge}
          expectedResult={expectedResult}
          onTestAll={handleTestAll}
          testResults={devTestResults}
        />
      )}
    </>
  )
}
