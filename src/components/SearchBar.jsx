import { Search, X } from 'lucide-react'

/**
 * Campo de busca global. Controlado por `value` e `onChange`.
 */
export function SearchBar({ value, onChange }) {
  return (
    <div className="relative flex-1 min-w-0" role="search">
      <Search
        size={16}
        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-muted pointer-events-none"
        aria-hidden="true"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar fontes (ex: jogos indie, audiobook clássico...)"
        aria-label="Buscar fontes de entretenimento"
        autoComplete="off"
        spellCheck="false"
        className="
          w-full h-10 pl-9 pr-9 rounded-full text-sm
          bg-gray-100 dark:bg-background
          border border-gray-200 dark:border-border
          text-gray-900 dark:text-text
          placeholder-gray-400 dark:placeholder-muted
          focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
          transition-colors
        "
      />
      {value && (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          title="Limpar"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded text-gray-400 dark:text-muted hover:text-gray-900 dark:hover:text-text transition-colors"
        >
          <X size={15} aria-hidden="true" />
        </button>
      )}
    </div>
  )
}
