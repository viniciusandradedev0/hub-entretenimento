import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'hub:favorites'

/**
 * Gerencia a lista de IDs favoritados persistida no localStorage.
 * Retorna: { favorites (Set), toggleFavorite, addFavorites, isFavorite, clearFavorites }.
 */
export function useFavorites() {
  const [favorites, setFavorites] = useState<Set<string>>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return new Set<string>(stored ? JSON.parse(stored) : [])
    } catch {
      return new Set<string>()
    }
  })

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...favorites]))
    } catch {
      /* quota excedida ou modo privado - ignora silenciosamente */
    }
  }, [favorites])

  const toggleFavorite = useCallback((id) => {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  const addFavorites = useCallback((ids) => {
    if (!ids || !ids[Symbol.iterator]) return
    setFavorites((prev) => {
      const next = new Set(prev)
      for (const id of ids) {
        if (typeof id === 'string' && id.length > 0) next.add(id)
      }
      return next
    })
  }, [])

  const isFavorite = useCallback((id) => favorites.has(id), [favorites])

  const clearFavorites = useCallback(() => setFavorites(new Set()), [])

  return { favorites, toggleFavorite, addFavorites, isFavorite, clearFavorites }
}
