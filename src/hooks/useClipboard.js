import { useState, useCallback } from 'react'

/**
 * Hook para copiar texto para a área de transferência. Usa a Clipboard API
 * com fallback para `document.execCommand` em contextos não-seguros.
 * Expõe `toastMessage` para feedback visual.
 */
export function useClipboard() {
  const [toastMessage, setToastMessage] = useState(null)

  const copyToClipboard = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      // Fallback para contextos file:// ou navegadores antigos
      const el = document.createElement('textarea')
      el.value = text
      el.style.cssText = 'position:fixed;top:0;left:0;opacity:0;'
      document.body.appendChild(el)
      el.focus()
      el.select()
      try { document.execCommand('copy') } catch {}
      document.body.removeChild(el)
    }
    setToastMessage('Termos copiados!')
  }, [])

  const clearToast = useCallback(() => setToastMessage(null), [])

  return { copyToClipboard, toastMessage, clearToast }
}
