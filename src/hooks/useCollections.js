import { useState, useCallback } from 'react'

const STORAGE_KEY = 'hub:collections'

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
  } catch {
    return []
  }
}

function save(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch { /* quota exceeded — ignora */ }
}

export function useCollections() {
  const [collections, setCollections] = useState(load)

  const persist = useCallback((next) => {
    setCollections(next)
    save(next)
  }, [])

  const createCollection = useCallback((name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    const newCol = { id: String(Date.now()), name: trimmed, sourceIds: [] }
    persist((prev) => [...prev, newCol])
    return newCol.id
  }, [persist])

  const renameCollection = useCallback((id, name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    persist((prev) => prev.map((c) => c.id === id ? { ...c, name: trimmed } : c))
  }, [persist])

  const deleteCollection = useCallback((id) => {
    persist((prev) => prev.filter((c) => c.id !== id))
  }, [persist])

  const addToCollection = useCallback((sourceId, collectionId) => {
    persist((prev) =>
      prev.map((c) =>
        c.id === collectionId && !c.sourceIds.includes(sourceId)
          ? { ...c, sourceIds: [...c.sourceIds, sourceId] }
          : c
      )
    )
  }, [persist])

  const removeFromCollection = useCallback((sourceId, collectionId) => {
    persist((prev) =>
      prev.map((c) =>
        c.id === collectionId
          ? { ...c, sourceIds: c.sourceIds.filter((id) => id !== sourceId) }
          : c
      )
    )
  }, [persist])

  const isInCollection = useCallback((sourceId, collectionId) => {
    const col = collections.find((c) => c.id === collectionId)
    return col ? col.sourceIds.includes(sourceId) : false
  }, [collections])

  return {
    collections,
    createCollection,
    renameCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
    isInCollection,
  }
}
