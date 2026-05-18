import { Heart, Tv, Shuffle, FolderOpen } from 'lucide-react'
import clsx from 'clsx'
import { SearchBar } from './SearchBar.jsx'
import { ThemeToggle } from './ThemeToggle.jsx'

/**
 * Header fixo no topo: logo + busca + tema + atalho favoritos.
 */
export function Header({
  searchQuery,
  onSearchChange,
  isDark,
  onThemeToggle,
  favoritesCount,
  onFavoritesToggle,
  onSurpriseMe,
  inputRef,
  onCollectionsToggle,
  collectionsCount,
}) {
  return (
    <header
      role="banner"
      className="
        sticky top-0 z-30 h-16
        bg-white/90 dark:bg-background/90 backdrop-blur
        border-b border-gray-200 dark:border-border
        transition-colors
      "
    >
      <div className="container-x h-full flex items-center gap-3 sm:gap-4">
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-primary text-white">
            <Tv size={18} aria-hidden="true" />
          </span>
          <h1 className="hidden sm:block text-base font-bold text-gray-900 dark:text-text whitespace-nowrap">
            Hub <span className="text-primary">Entretenimento</span>
          </h1>
        </div>

        <SearchBar value={searchQuery} onChange={onSearchChange} inputRef={inputRef} />

        <div className="flex items-center gap-1 flex-shrink-0">
          {onSurpriseMe && (
            <button
              type="button"
              onClick={onSurpriseMe}
              aria-label="Surpreenda-me com uma fonte aleatória"
              title="Surpreenda-me"
              className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors text-gray-600 dark:text-muted hover:bg-gray-100 dark:hover:bg-background hover:text-primary"
            >
              <Shuffle size={18} aria-hidden="true" />
            </button>
          )}

          <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />

          {onCollectionsToggle && (
            <button
              type="button"
              onClick={onCollectionsToggle}
              aria-label={`Coleções (${collectionsCount ?? 0})`}
              title="Minhas coleções"
              className={clsx(
                'relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
                collectionsCount > 0
                  ? 'text-primary hover:bg-primary/10'
                  : 'text-gray-600 dark:text-muted hover:bg-gray-100 dark:hover:bg-background hover:text-gray-900 dark:hover:text-text'
              )}
            >
              <FolderOpen size={18} aria-hidden="true" />
              {collectionsCount > 0 && (
                <span
                  className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center"
                  aria-hidden="true"
                >
                  {collectionsCount}
                </span>
              )}
            </button>
          )}

          <button
            type="button"
            onClick={onFavoritesToggle}
            aria-label={`Favoritos (${favoritesCount})`}
            title="Favoritos"
            className={clsx(
              'relative w-9 h-9 rounded-lg flex items-center justify-center transition-colors',
              favoritesCount > 0
                ? 'text-red-500 hover:bg-red-500/10'
                : 'text-gray-600 dark:text-muted hover:bg-gray-100 dark:hover:bg-background hover:text-gray-900 dark:hover:text-text'
            )}
          >
            <Heart size={18} fill={favoritesCount > 0 ? 'currentColor' : 'none'} aria-hidden="true" />
            {favoritesCount > 0 && (
              <span
                className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-primary text-white text-[10px] font-bold flex items-center justify-center"
                aria-hidden="true"
              >
                {favoritesCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  )
}
