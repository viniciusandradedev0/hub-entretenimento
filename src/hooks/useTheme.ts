import { useState, useEffect, useCallback } from 'react'

const STORAGE_KEY = 'theme'

/**
 * Gerencia o tema (dark/light) sincronizado com a classe `dark` no <html>
 * e o localStorage. A inicialização vem do script anti-flash no index.html.
 */
export function useTheme() {
  const [theme, setTheme] = useState(() => {
    if (typeof document === 'undefined') return 'dark'
    return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
  })

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') root.classList.add('dark')
    else root.classList.remove('dark')

    try {
      localStorage.setItem(STORAGE_KEY, theme)
    } catch {
      /* quota exceeded ou modo privado */
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'dark' ? 'light' : 'dark'))
  }, [])

  return { theme, toggleTheme, isDark: theme === 'dark' }
}
