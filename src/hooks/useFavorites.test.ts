import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useFavorites } from './useFavorites.ts'

beforeEach(() => {
  localStorage.clear()
})

describe('useFavorites', () => {
  it('começa com conjunto vazio', () => {
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites.size).toBe(0)
  })

  it('adiciona favorito ao chamar toggleFavorite', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite('pluto-tv'))
    expect(result.current.favorites.has('pluto-tv')).toBe(true)
  })

  it('remove favorito na segunda chamada (toggle)', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite('pluto-tv'))
    act(() => result.current.toggleFavorite('pluto-tv'))
    expect(result.current.favorites.has('pluto-tv')).toBe(false)
  })

  it('persiste favoritos no localStorage', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite('tubi'))
    const stored = JSON.parse(localStorage.getItem('hub:favorites') || '[]')
    expect(stored).toContain('tubi')
  })

  it('carrega favoritos salvos no localStorage', () => {
    localStorage.setItem('hub:favorites', JSON.stringify(['itch-io']))
    const { result } = renderHook(() => useFavorites())
    expect(result.current.favorites.has('itch-io')).toBe(true)
  })

  it('addFavorites mescla IDs sem duplicatas', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite('tubi'))
    act(() => result.current.addFavorites(['tubi', 'plex-free']))
    expect(result.current.favorites.size).toBe(2)
  })

  it('clearFavorites esvazia a lista', () => {
    const { result } = renderHook(() => useFavorites())
    act(() => result.current.toggleFavorite('tubi'))
    act(() => result.current.clearFavorites())
    expect(result.current.favorites.size).toBe(0)
  })
})
