import { useState, useMemo } from 'react'
import sourcesData from './data/sources.json'
import { CATEGORIES } from './lib/categories.js'
import { useFavorites } from './hooks/useFavorites.js'
import { useTheme } from './hooks/useTheme.js'
import { useSearch } from './hooks/useSearch.js'
import { useClipboard } from './hooks/useClipboard.js'
import { Header } from './components/Header.jsx'
import { CategorySection } from './components/CategorySection.jsx'
import { FavoritesPanel } from './components/FavoritesPanel.jsx'
import { Toast } from './components/Toast.jsx'

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [favoritesOpen, setFavoritesOpen] = useState(false)

  const { favorites, toggleFavorite } = useFavorites()
  const { isDark, toggleTheme } = useTheme()
  const { results, isSearching, debouncedQuery } = useSearch(searchQuery, sourcesData)
  const { copyToClipboard, toastMessage, clearToast } = useClipboard()

  // Agrupa as fontes filtradas por categoria
  const sourcesByCategory = useMemo(() => {
    const map = new Map()
    for (const cat of CATEGORIES) map.set(cat.slug, [])
    for (const source of results) {
      if (map.has(source.category)) map.get(source.category).push(source)
    }
    return map
  }, [results])

  const totalResults = results.length

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDark={isDark}
        onThemeToggle={toggleTheme}
        favoritesCount={favorites.size}
        onFavoritesToggle={() => setFavoritesOpen((o) => !o)}
      />

      <main className="container-x flex-1 py-6 sm:py-8 space-y-10">
        {isSearching && (
          <div
            className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-sm"
            aria-live="polite"
          >
            <strong className="text-primary">{totalResults}</strong>{' '}
            <span className="text-gray-700 dark:text-text">
              resultado{totalResults !== 1 ? 's' : ''} para "{debouncedQuery}"
            </span>
            {totalResults === 0 && (
              <span className="block mt-1 text-gray-600 dark:text-muted">
                Tente termos como: <em>indie, podcasts, documentário, jogos browser…</em>
              </span>
            )}
          </div>
        )}

        {CATEGORIES.map((category) => (
          <CategorySection
            key={category.slug}
            category={category}
            sources={sourcesByCategory.get(category.slug) || []}
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onCopyTerms={copyToClipboard}
          />
        ))}
      </main>

      <footer className="container-x py-6 text-center text-xs text-gray-500 dark:text-muted">
        Apenas links públicos. Conteúdo pertence aos respectivos provedores.
      </footer>

      <FavoritesPanel
        isOpen={favoritesOpen}
        onClose={() => setFavoritesOpen(false)}
        favorites={favorites}
        allSources={sourcesData}
        onToggleFavorite={toggleFavorite}
        onCopyTerms={copyToClipboard}
      />

      <Toast message={toastMessage} onDismiss={clearToast} />
    </div>
  )
}
