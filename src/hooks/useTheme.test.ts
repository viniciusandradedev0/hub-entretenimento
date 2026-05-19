import { renderHook, act } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import { useTheme } from './useTheme.ts'

beforeEach(() => {
  localStorage.clear()
  document.documentElement.classList.add('dark')
})

describe('useTheme', () => {
  it('detecta tema dark do DOM', () => {
    const { result } = renderHook(() => useTheme())
    expect(result.current.isDark).toBe(true)
  })

  it('toggle muda para light', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.isDark).toBe(false)
    expect(document.documentElement.classList.contains('dark')).toBe(false)
  })

  it('toggle volta para dark', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    act(() => result.current.toggleTheme())
    expect(result.current.isDark).toBe(true)
  })

  it('persiste tema no localStorage', () => {
    const { result } = renderHook(() => useTheme())
    act(() => result.current.toggleTheme())
    expect(localStorage.getItem('theme')).toBe('light')
  })
})
