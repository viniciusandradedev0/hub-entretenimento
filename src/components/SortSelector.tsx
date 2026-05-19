import { ArrowDownNarrowWide } from 'lucide-react'

const OPTIONS = [
  { value: 'original', label: 'Original' },
  { value: 'alphabetic', label: 'A→Z' },
  { value: 'most-clicked', label: 'Mais acessadas' },
]

/**
 * Seletor de ordenação reutilizável.
 * Recebe valor atual e callback para alteração.
 */
export function SortSelector({ value, onChange }) {
  return (
    <div className="flex items-center gap-1.5">
      <ArrowDownNarrowWide size={14} className="text-gray-400 dark:text-muted" aria-hidden="true" />
      <label className="sr-only" htmlFor="sort-select">
        Ordenar por
      </label>
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-md border border-gray-200 bg-transparent px-2 py-1 text-xs text-gray-700 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border dark:text-muted"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value} className="bg-white dark:bg-surface">
            {o.label}
          </option>
        ))}
      </select>
    </div>
  )
}
