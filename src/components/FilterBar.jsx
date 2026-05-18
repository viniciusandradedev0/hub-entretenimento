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
    <div className="flex flex-wrap items-center gap-2 sm:gap-3 py-3">
      {/* Filtros de idioma */}
      {LANGUAGE_OPTIONS.map((option) => (
        <button
          key={option.value}
          onClick={() => onLanguageChange(option.value)}
          className={clsx(
            'px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
            activeLanguage === option.value
              ? 'bg-primary text-white border border-primary'
              : 'border border-gray-200 dark:border-border text-gray-600 dark:text-muted hover:border-primary/50 hover:text-primary'
          )}
        >
          {option.label}
        </button>
      ))}

      {/* Separador visual */}
      <div className="w-px h-4 bg-gray-200 dark:bg-border" aria-hidden="true" />

      {/* Toggle "Só favoritos" */}
      <button
        onClick={onOnlyFavoritesToggle}
        className={clsx(
          'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-colors',
          onlyFavorites
            ? 'bg-red-500/10 text-red-500 border border-red-500/50'
            : 'border border-gray-200 dark:border-border text-gray-600 dark:text-muted hover:border-primary/50 hover:text-primary'
        )}
      >
        <Heart
          size={12}
          fill={onlyFavorites ? 'currentColor' : 'none'}
        />
        Só favoritos
      </button>

      {/* Contador de resultados */}
      {hasActiveFilter && (
        <span className="text-xs text-gray-500 dark:text-muted ml-auto">
          {totalVisible} de {totalAll} fontes
        </span>
      )}
    </div>
  )
}
