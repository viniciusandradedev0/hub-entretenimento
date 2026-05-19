import { Search, X } from 'lucide-react'

/**
 * Campo de busca global. Controlado por `value` e `onChange`.
 */
export function SearchBar({ value, onChange, inputRef }) {
  return (
    <div className="relative min-w-0 flex-1" role="search">
      <Search
        size={16}
        className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-muted"
        aria-hidden="true"
      />
      <input
        ref={inputRef}
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar fontes (ex: jogos indie, audiobook clássico...)"
        aria-label="Buscar fontes de entretenimento"
        autoComplete="off"
        spellCheck="false"
        className="h-10 w-full rounded-full border border-gray-200 bg-gray-100 pl-9 pr-9 text-sm text-gray-900 placeholder-gray-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border dark:bg-background dark:text-text dark:placeholder-muted"
      />
      {value ? (
        <button
          type="button"
          onClick={() => onChange('')}
          aria-label="Limpar busca"
          title="Limpar (Esc)"
          className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 transition-colors hover:text-gray-900 dark:text-muted dark:hover:text-text"
        >
          <X size={15} aria-hidden="true" />
        </button>
      ) : (
        <kbd
          aria-hidden="true"
          className="absolute right-3 top-1/2 hidden -translate-y-1/2 items-center rounded border border-gray-300 bg-white px-1.5 py-0.5 font-mono text-[10px] font-medium leading-none text-gray-400 dark:border-border dark:bg-surface dark:text-muted sm:inline-flex"
        >
          /
        </kbd>
      )}
    </div>
  )
}
