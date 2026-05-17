import { Sun, Moon } from 'lucide-react'

/**
 * Botão que alterna entre dark e light mode.
 */
export function ThemeToggle({ isDark, onToggle }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isDark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      title={isDark ? 'Modo claro' : 'Modo escuro'}
      className="
        w-9 h-9 rounded-lg flex items-center justify-center
        text-gray-600 dark:text-muted
        hover:bg-gray-100 dark:hover:bg-background hover:text-gray-900 dark:hover:text-text
        transition-colors
      "
    >
      {isDark ? <Sun size={18} aria-hidden="true" /> : <Moon size={18} aria-hidden="true" />}
    </button>
  )
}
