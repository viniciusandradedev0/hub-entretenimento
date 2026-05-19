import { renderHook, act } from '@testing-library/react'
import { describe, expect, it, vi, beforeEach } from 'vitest'
import { useClipboard } from './useClipboard.ts'

beforeEach(() => {
  Object.assign(navigator, {
    clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
  })
})

describe('useClipboard', () => {
  it('começa sem toast', () => {
    const { result } = renderHook(() => useClipboard())
    expect(result.current.toastMessage).toBeNull()
  })

  it('exibe toast após copiar', async () => {
    const { result } = renderHook(() => useClipboard())
    await act(async () => {
      await result.current.copyToClipboard('texto teste')
    })
    expect(result.current.toastMessage).toBe('Termos copiados!')
  })

  it('clearToast zera o toast', async () => {
    const { result } = renderHook(() => useClipboard())
    await act(async () => {
      await result.current.copyToClipboard('texto')
    })
    act(() => result.current.clearToast())
    expect(result.current.toastMessage).toBeNull()
  })

  it('chama navigator.clipboard.writeText com o texto correto', async () => {
    const { result } = renderHook(() => useClipboard())
    await act(async () => {
      await result.current.copyToClipboard('meu texto')
    })
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith('meu texto')
  })
})
