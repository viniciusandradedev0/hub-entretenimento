import { useEffect, useRef } from 'react'

const FOCUSABLE = [
  'a[href]',
  'button:not([disabled])',
  'textarea:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(', ')

/** Prende o foco dentro do container enquanto `active` for true. */
export function useFocusTrap(active: boolean) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    if (!active || !ref.current) return
    const container = ref.current

    const getFocusable = () =>
      Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
        (el) => !el.closest('[aria-hidden="true"]')
      )

    // Foca o primeiro elemento focável ao abrir
    const first = getFocusable()[0]
    first?.focus()

    const handleKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return
      const focusable = getFocusable()
      if (!focusable.length) return
      const last = focusable[focusable.length - 1]
      if (e.shiftKey) {
        if (document.activeElement === focusable[0]) {
          e.preventDefault()
          last.focus()
        }
      } else {
        if (document.activeElement === last) {
          e.preventDefault()
          focusable[0].focus()
        }
      }
    }

    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [active])

  return ref
}
