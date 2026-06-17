import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'statica-learn-progress'

function loadProgress() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { completed: [], currentIndex: 0 }
    return JSON.parse(raw)
  } catch {
    return { completed: [], currentIndex: 0 }
  }
}

function saveProgress(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {}
}

export function useProgress(totalChallenges) {
  const [progress, setProgress] = useState(loadProgress)

  useEffect(() => {
    saveProgress(progress)
  }, [progress])

  const markComplete = useCallback((index) => {
    setProgress((prev) => {
      if (prev.completed.includes(index)) return prev
      return { ...prev, completed: [...prev.completed, index] }
    })
  }, [])

  const goToChallenge = useCallback((index) => {
    const clamped = Math.max(0, Math.min(index, totalChallenges - 1))
    setProgress((prev) => ({ ...prev, currentIndex: clamped }))
  }, [totalChallenges])

  const resetProgress = useCallback(() => {
    const fresh = { completed: [], currentIndex: 0 }
    setProgress(fresh)
    saveProgress(fresh)
  }, [])

  return {
    currentIndex: progress.currentIndex,
    completed: progress.completed,
    markComplete,
    goToChallenge,
    resetProgress,
  }
}
