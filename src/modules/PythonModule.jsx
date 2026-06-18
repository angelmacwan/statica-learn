import React, { useState, useCallback } from 'react'
import confetti from 'canvas-confetti'
import challenges from '../data/python-challenges.json'
import { usePython } from '../hooks/usePython.js'
import { useProgress } from '../hooks/useProgress.js'
import Header from '../components/Header.jsx'
import ChallengeInfo from '../components/ChallengeInfo.jsx'
import PythonEditorPanel from '../components/PythonEditorPanel.jsx'
import PythonResultPane from '../components/PythonResultPane.jsx'
import PythonTestCasesPane from '../components/PythonTestCasesPane.jsx'
import ChallengesList from '../components/ChallengesList.jsx'

export default function PythonModule() {
  const { 
    currentIndex, 
    challengeData, 
    markComplete, 
    markAttempted, 
    saveQuery: saveCode,
    goToChallenge, 
    getChallengeProgress 
  } = useProgress(challenges.length, challenges, 'statica-learn-python-progress')
  
  const challenge = challenges[currentIndex]

  const { pyReady, pyError, executePython } = usePython(challenge)

  const [runResult, setRunResult] = useState(null)
  const [isCorrect, setIsCorrect] = useState(null)
  const [hasRun, setHasRun] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Reset result state when challenge changes
  React.useEffect(() => {
    setRunResult(null)
    setIsCorrect(null)
    setHasRun(false)
  }, [challenge?.id])

  const handleRun = useCallback(async (code) => {
    if (!pyReady) return
    const result = await executePython(code)
    setHasRun(true)
    
    if (result.success && !result.error) {
      setRunResult({ ...result, output: result.output || 'All tests passed!' })
      setIsCorrect(true)
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#22c55e', '#3b82f6', '#f59e0b']
      })
      markComplete(challenge.id, code)
    } else {
      setRunResult(result)
      setIsCorrect(false)
      markAttempted(challenge.id, code)
    }
  }, [pyReady, executePython, challenge, markComplete, markAttempted])

  const handleCodeChange = useCallback((code) => {
    if (challenge) {
      saveCode(challenge.id, code)
    }
  }, [challenge, saveCode])

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
        <div className="panels-row" style={{ display: 'flex', width: '100%' }}>
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
            minHeight: 0,
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
              overflow: 'hidden',
              minHeight: 0
            }}>
              <div style={{ background: 'var(--bg-base)', overflow: 'hidden', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <ChallengeInfo challenge={challenge} />
              </div>
              <div style={{ background: 'var(--bg-base)', overflow: 'hidden', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <PythonTestCasesPane 
                  title="Test Cases" 
                  testCases={challenge.test_cases}
                />
              </div>
            </div>

            {/* Right Column */}
            <div className="right-column" style={{ 
              display: 'grid', 
              gridTemplateRows: '1.2fr 1fr', 
              gap: '1px', 
              background: 'var(--border-subtle)',
              overflow: 'hidden',
              minHeight: 0
            }}>
              <div style={{ background: 'var(--bg-base)', overflow: 'hidden', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <PythonEditorPanel 
                  pyReady={pyReady}
                  pyError={pyError}
                  onRun={handleRun}
                  onChange={handleCodeChange}
                  onNext={handleNext}
                  onPrev={handlePrev}
                  canPrev={currentIndex > 0}
                  isCorrect={isCorrect}
                  savedCode={getChallengeProgress(challenge?.id).query}
                  initialCode={challenge.initial_code}
                />
              </div>
              <div style={{ background: 'var(--bg-base)', overflow: 'hidden', minHeight: 0, display: 'flex', flexDirection: 'column' }}>
                <PythonResultPane 
                  title="Your Output" 
                  result={runResult} 
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
