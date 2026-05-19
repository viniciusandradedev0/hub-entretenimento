import clsx from 'clsx'
import { Heart } from 'lucide-react'

const LANGUAGE_OPTIONS = [
  { value: 'all', label: 'Todos' },
  { value: 'pt-BR', label: 'PT-BR' },
  { value: 'en', label: 'EN' },
  { value: 'multi', label: 'Multi' },
]

export function FilterBar({
  activeLanguage,
  onLanguageChange,
  onlyFavorites,
  onOnlyFavoritesToggle,
  totalVisible,
  totalAll,
}) {
  const hasActiveFilter = activeLanguage !== 'all' || onlyFavorites

  return (
    <div className="flex flex-wrap items-center gap-2 py-3 sm:gap-3">
      {/* Filtros de idioma */}
      {LANGUAGE_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onLanguageChange(option.value)}
          className={clsx(
            'rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
            activeLanguage === option.value
              ? 'border border-primary bg-primary text-white'
              : 'border border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary dark:border-border dark:text-muted'
          )}
        >
          {option.label}
        </button>
      ))}

      {/* Separador visual */}
      <div className="h-4 w-px bg-gray-200 dark:bg-border" aria-hidden="true" />

      {/* Toggle "Só favoritos" */}
      <button
        onClick={onOnlyFavoritesToggle}
        className={clsx(
          'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
          onlyFavorites
            ? 'border border-red-500/50 bg-red-500/10 text-red-500'
            : 'border border-gray-200 text-gray-600 hover:border-primary/50 hover:text-primary dark:border-border dark:text-muted'
        )}
      >
        <Heart size={12} fill={onlyFavorites ? 'currentColor' : 'none'} />
        Só favoritos
      </button>

      {/* Contador de resultados */}
      {hasActiveFilter && (
        <span className="ml-auto text-xs text-gray-500 dark:text-muted">
          {totalVisible} de {totalAll} fontes
        </span>
      )}
    </div>
  )
}
