import { useState, useCallback } from 'react'

export function useNotes() {
  const [notes, setNotes] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('hub:notes') ?? '{}')
    } catch {
      return {}
    }
  })

  const setNote = useCallback((sourceId, text) => {
    setNotes((prev) => {
      const next = { ...prev, [sourceId]: text }
      localStorage.setItem('hub:notes', JSON.stringify(next))
      return next
    })
  }, [])

  return { notes, setNote }
}
