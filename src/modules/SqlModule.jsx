import React, { useState, useCallback } from 'react'
import confetti from 'canvas-confetti'
import challenges from '../data/challenges.json'
import { useDatabase, checkAnswer } from '../hooks/useDatabase.js'
import { useProgress } from '../hooks/useProgress.js'
import Header from '../components/Header.jsx'
import ChallengeInfo from '../components/ChallengeInfo.jsx'
import SQLEditorPanel from '../components/SQLEditorPanel.jsx'
import ResultPane from '../components/ResultPane.jsx'
import ChallengesList from '../components/ChallengesList.jsx'

export default function SqlModule() {
  const { 
    currentIndex, 
    challengeData, 
    markComplete, 
    markAttempted, 
    saveQuery,
    goToChallenge, 
    getChallengeProgress 
  } = useProgress(challenges.length, challenges)
  
  const challenge = challenges[currentIndex]

  const { dbReady, expectedResult, dbError, executeQuery } = useDatabase(challenge)

  const [queryResult, setQueryResult] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [hasRun, setHasRun] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Reset result state when challenge changes
  React.useEffect(() => {
    setQueryResult(null)
    setIsCorrect(null)
    setHasRun(false)
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
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#22c55e', '#3b82f6', '#f59e0b']
        })
        markComplete(challenge.id, sql)
      } else {
        markAttempted(challenge.id, sql)
      }
    } else {
      setIsCorrect(false)
      markAttempted(challenge.id, sql)
    }
  }, [dbReady, executeQuery, expectedResult, challenge, markComplete, markAttempted])

  const handleQueryChange = useCallback((sql) => {
    saveQuery(challenge.id, sql)
  }, [challenge?.id, saveQuery])

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

  const handleSelectChallenge = useCallback((idx) => {
    goToChallenge(idx)
  }, [goToChallenge])

  return (
    <>
      <Header
        currentIndex={currentIndex}
        challenges={challenges}
        challengeData={challengeData}
        onGoTo={goToChallenge}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(v => !v)}
      />

      <main className="app-main">
        <div className="panels-row" style={{ display: 'flex', width: '100%', height: '100%' }}>
          {/* Sidebar */}
          {sidebarOpen && (
            <ChallengesList
              challenges={challenges}
              currentIndex={currentIndex}
              challengeData={challengeData}
              onSelect={handleSelectChallenge}
            />
          )}

          {/* Main 2-column layout */}
          <div className="main-content-grid" style={{ 
            flex: 1, 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr', 
            gap: '1px', 
            background: 'var(--border-subtle)',
            overflow: 'hidden' 
          }}>
            {/* Left Column */}
            <div className="left-column" style={{ 
              display: 'grid', 
              gridTemplateRows: '1.2fr 1fr', 
              gap: '1px', 
              background: 'var(--border-subtle)',
              height: '100%',
              overflow: 'hidden'
            }}>
              <div style={{ background: 'var(--bg-base)', overflow: 'hidden' }}>
                <ChallengeInfo challenge={challenge} />
              </div>
              <div style={{ background: 'var(--bg-base)', overflow: 'hidden' }}>
                <ResultPane 
                  title="Expected Output" 
                  result={expectedResult} 
                  hasRun={hasRun}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="right-column" style={{ 
              display: 'grid', 
              gridTemplateRows: '1.2fr 1fr', 
              gap: '1px', 
              background: 'var(--border-subtle)',
              height: '100%',
              overflow: 'hidden'
            }}>
              <div style={{ background: 'var(--bg-base)', overflow: 'hidden' }}>
                <SQLEditorPanel 
                  dbReady={dbReady}
                  dbError={dbError}
                  onRun={handleRun}
                  onChange={handleQueryChange}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  canPrev={currentIndex > 0}
                  isCorrect={isCorrect}
                  savedQuery={getChallengeProgress(challenge?.id).query}
                />
              </div>
              <div style={{ background: 'var(--bg-base)', overflow: 'hidden' }}>
                <ResultPane 
                  title="Your Output" 
                  result={queryResult} 
                  hasRun={hasRun}
                  isCorrect={isCorrect}
                  showStatus={true}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
