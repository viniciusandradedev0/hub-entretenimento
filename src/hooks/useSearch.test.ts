import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, beforeEach, afterEach } from 'vitest'
import { useSearch } from './useSearch.ts'
import type { Source } from '../types.ts'

const mockSources: Source[] = [
  {
    id: 'pluto-tv',
    category: 'filmes',
    name: 'Pluto TV',
    url: 'https://pluto.tv',
    description: 'Filmes e séries gratuitos com anúncios.',
    bestFor: ['Filmes', 'Séries'],
    language: 'pt-BR',
    searchTerms: ['pluto filmes grátis'],
    icon: 'Film',
    free: true,
    legal: true,
    lastVerified: '2026-05-18',
  },
  {
    id: 'itch-io',
    category: 'jogos',
    name: 'itch.io',
    url: 'https://itch.io',
    description: 'Jogos indie gratuitos.',
    bestFor: ['Indie', 'Game jams'],
    language: 'multi',
    searchTerms: ['itch jogos indie'],
    icon: 'Gamepad2',
    free: true,
    legal: true,
    lastVerified: '2026-05-18',
  },
]

describe('useSearch', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('retorna todas as fontes quando query está vazia', () => {
    const { result } = renderHook(() => useSearch('', mockSources))
    expect(result.current.results).toHaveLength(2)
    expect(result.current.isSearching).toBe(false)
  })

  it('filtra por nome após debounce', async () => {
    const { result, rerender } = renderHook(({ q }) => useSearch(q, mockSources), {
      initialProps: { q: '' },
    })
    rerender({ q: 'pluto' })
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current.results).toHaveLength(1)
    expect(result.current.results[0].id).toBe('pluto-tv')
  })

  it('filtra por bestFor', () => {
    const { result, rerender } = renderHook(({ q }) => useSearch(q, mockSources), {
      initialProps: { q: '' },
    })
    rerender({ q: 'indie' })
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current.results[0].id).toBe('itch-io')
  })

  it('isSearching é true quando há query', () => {
    const { result, rerender } = renderHook(({ q }) => useSearch(q, mockSources), {
      initialProps: { q: '' },
    })
    rerender({ q: 'jogos' })
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current.isSearching).toBe(true)
  })

  it('retorna vazio quando não há correspondência', () => {
    const { result, rerender } = renderHook(({ q }) => useSearch(q, mockSources), {
      initialProps: { q: '' },
    })
    rerender({ q: 'xyzabcnotfound' })
    act(() => {
      vi.advanceTimersByTime(250)
    })
    expect(result.current.results).toHaveLength(0)
  })
})
