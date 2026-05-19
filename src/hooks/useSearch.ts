import { useState, useEffect, useMemo } from 'react'
import type { Source } from '../types.ts'

export function useSearch(query: string, sources: Source[]) {
  const [debouncedQuery, setDebouncedQuery] = useState(query)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 250)
    return () => clearTimeout(timer)
  }, [query])

  const results = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase()
    if (!q) return sources
    return sources.filter(
      (source) =>
        source.name.toLowerCase().includes(q) ||
        source.description.toLowerCase().includes(q) ||
        source.bestFor.join(' ').toLowerCase().includes(q) ||
        source.searchTerms.join(' ').toLowerCase().includes(q)
    )
  }, [debouncedQuery, sources])

  return {
    results,
    isSearching: debouncedQuery.trim().length > 0,
    debouncedQuery,
  }
}
