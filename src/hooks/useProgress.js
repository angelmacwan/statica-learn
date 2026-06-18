import { useState, useEffect, useCallback } from 'react'

function loadProgress(storageKey) {
  try {
    const raw = localStorage.getItem(storageKey)
    if (!raw) return { 
      currentIndex: 0,
      challengeData: {} // Map of challengeId -> { status: 'solved'|'attempted', query: string }
    }
    const parsed = JSON.parse(raw)
    // Migrate old format if necessary
    if (Array.isArray(parsed.completed)) {
      const challengeData = {}
      parsed.completed.forEach(idx => {
        challengeData[idx] = { status: 'solved', query: '' }
      })
      return { currentIndex: parsed.currentIndex || 0, challengeData }
    }
    return parsed
  } catch {
    return { currentIndex: 0, challengeData: {} }
  }
}

function saveProgress(storageKey, data) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(data))
  } catch {}
}

export function useProgress(totalChallenges, challenges, storageKey = 'statica-learn-progress') {
  const [progress, setProgress] = useState(() => loadProgress(storageKey))

  useEffect(() => {
    saveProgress(storageKey, progress)
  }, [progress, storageKey])

  const markComplete = useCallback((id, query) => {
    setProgress((prev) => ({
      ...prev,
      challengeData: {
        ...prev.challengeData,
        [id]: { status: 'solved', query }
      }
    }))
  }, [])

  const markAttempted = useCallback((id, query) => {
    setProgress((prev) => {
      // Don't downgrade from solved to attempted
      if (prev.challengeData[id]?.status === 'solved') {
        return {
          ...prev,
          challengeData: {
            ...prev.challengeData,
            [id]: { ...prev.challengeData[id], query }
          }
        }
      }
      return {
        ...prev,
        challengeData: {
          ...prev.challengeData,
          [id]: { status: 'attempted', query }
        }
      }
    })
  }, [])

  const saveQuery = useCallback((id, query) => {
    setProgress((prev) => ({
      ...prev,
      challengeData: {
        ...prev.challengeData,
        [id]: { ...prev.challengeData[id], query }
      }
    }))
  }, [])

  const goToChallenge = useCallback((index) => {
    const clamped = Math.max(0, Math.min(index, totalChallenges - 1))
    setProgress((prev) => ({ ...prev, currentIndex: clamped }))
  }, [totalChallenges])

  const resetProgress = useCallback(() => {
    const fresh = { currentIndex: 0, challengeData: {} }
    setProgress(fresh)
    saveProgress(storageKey, fresh)
  }, [storageKey])

  // Helper to get status and query for a challenge
  const getChallengeProgress = useCallback((id) => {
    return progress.challengeData[id] || { status: 'none', query: '' }
  }, [progress.challengeData])

  return {
    currentIndex: progress.currentIndex,
    challengeData: progress.challengeData,
    markComplete,
    markAttempted,
    saveQuery,
    goToChallenge,
    resetProgress,
    getChallengeProgress
  }
}
