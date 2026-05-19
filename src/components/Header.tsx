import { Heart, Tv, Shuffle, FolderOpen, Share2, BarChart2 } from 'lucide-react'
import clsx from 'clsx'
import { SearchBar } from './SearchBar.tsx'
import { ThemeToggle } from './ThemeToggle.tsx'
import { LangToggle } from './LangToggle.tsx'

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
  onShare,
  onStatsToggle,
}) {
  return (
    <header
      role="banner"
      className="sticky top-0 z-30 h-16 border-b border-gray-200 bg-white/90 backdrop-blur transition-colors dark:border-border dark:bg-background/90"
    >
      <div className="container-x flex h-full items-center gap-3 sm:gap-4">
        <div className="flex flex-shrink-0 items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white">
            <Tv size={18} aria-hidden="true" />
          </span>
          <h1 className="hidden whitespace-nowrap text-base font-bold text-gray-900 dark:text-text sm:block">
            Hub <span className="text-primary">Entretenimento</span>
          </h1>
        </div>

        <SearchBar value={searchQuery} onChange={onSearchChange} inputRef={inputRef} />

        <div className="flex flex-shrink-0 items-center gap-1">
          {onSurpriseMe && (
            <button
              type="button"
              onClick={onSurpriseMe}
              aria-label="Surpreenda-me com uma fonte aleatória"
              title="Surpreenda-me"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary dark:text-muted dark:hover:bg-background"
            >
              <Shuffle size={18} aria-hidden="true" />
            </button>
          )}

          {onShare && (
            <button
              type="button"
              onClick={onShare}
              aria-label="Compartilhar esta página"
              title="Compartilhar"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary dark:text-muted dark:hover:bg-background"
            >
              <Share2 size={18} aria-hidden="true" />
            </button>
          )}

          {onStatsToggle && (
            <button
              type="button"
              onClick={onStatsToggle}
              aria-label="Ver suas estatísticas"
              title="Suas estatísticas"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-600 transition-colors hover:bg-gray-100 hover:text-primary dark:text-muted dark:hover:bg-background"
            >
              <BarChart2 size={18} aria-hidden="true" />
            </button>
          )}

          <LangToggle />
          <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />

          {onCollectionsToggle && (
            <button
              type="button"
              onClick={onCollectionsToggle}
              aria-label={`Coleções (${collectionsCount ?? 0})`}
              title="Minhas coleções"
              className={clsx(
                'relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
                collectionsCount > 0
                  ? 'text-primary hover:bg-primary/10'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-muted dark:hover:bg-background dark:hover:text-text'
              )}
            >
              <FolderOpen size={18} aria-hidden="true" />
              {collectionsCount > 0 && (
                <span
                  className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white"
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
              'relative flex h-9 w-9 items-center justify-center rounded-lg transition-colors',
              favoritesCount > 0
                ? 'text-red-500 hover:bg-red-500/10'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-muted dark:hover:bg-background dark:hover:text-text'
            )}
          >
            <Heart
              size={18}
              fill={favoritesCount > 0 ? 'currentColor' : 'none'}
              aria-hidden="true"
            />
            {favoritesCount > 0 && (
              <span
                className="absolute -right-0.5 -top-0.5 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white"
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
