import { useState, useCallback } from 'react'

const STORAGE_KEY = 'hub:click-stats'

export function useClickStats() {
  const [stats, setStats] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')
    } catch {
      return {}
    }
  })

  const trackClick = useCallback((sourceId) => {
    setStats((prev) => {
      const next = { ...prev, [sourceId]: (prev[sourceId] || 0) + 1 }
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  return { stats, trackClick }
}
