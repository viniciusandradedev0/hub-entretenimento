import { useState, useMemo, useRef, useCallback } from 'react'
import sourcesData from './data/sources.json'
import { CATEGORIES } from './lib/categories.js'
import { useFavorites } from './hooks/useFavorites.js'
import { useTheme } from './hooks/useTheme.js'
import { useSearch } from './hooks/useSearch.js'
import { useClipboard } from './hooks/useClipboard.js'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.js'
import { useNotes } from './hooks/useNotes.js'
import { useClickStats } from './hooks/useClickStats.js'
import { useCollections } from './hooks/useCollections.js'
import { getDailyPick } from './lib/daily.js'
import { Header } from './components/Header.jsx'
import { NavBar } from './components/NavBar.jsx'
import { CategorySection } from './components/CategorySection.jsx'
import { FavoritesPanel } from './components/FavoritesPanel.jsx'
import { Toast } from './components/Toast.jsx'
import { FilterBar } from './components/FilterBar.jsx'
import { TagFilter } from './components/TagFilter.jsx'
import { SortSelector } from './components/SortSelector.jsx'
import { DailyPick } from './components/DailyPick.jsx'
import { BackToTop } from './components/BackToTop.jsx'
import { SourceModal } from './components/SourceModal.jsx'
import { CollectionsPanel } from './components/CollectionsPanel.jsx'

// Calculado uma vez por carregamento — muda à meia-noite automaticamente
const dailySource = getDailyPick(sourcesData)

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [favoritesOpen, setFavoritesOpen] = useState(false)
  const [activeLanguage, setActiveLanguage] = useState('all')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [activeTags, setActiveTags] = useState(new Set())
  const [sortMode, setSortMode] = useState('original')
  const [modalSource, setModalSource] = useState(null)
  const [collectionsOpen, setCollectionsOpen] = useState(false)

  const { favorites, toggleFavorite, addFavorites } = useFavorites()
  const { isDark, toggleTheme } = useTheme()
  const { results, isSearching, debouncedQuery } = useSearch(searchQuery, sourcesData)
  const { copyToClipboard, toastMessage, clearToast } = useClipboard()
  const { notes, setNote } = useNotes()
  const { stats: clickStats, trackClick } = useClickStats()
  const {
    collections,
    createCollection,
    renameCollection,
    deleteCollection,
    addToCollection,
    removeFromCollection,
  } = useCollections()
  const searchInputRef = useRef(null)

  // Atalhos desativados quando o modal está aberto
  useKeyboardShortcuts({
    searchInputRef,
    searchQuery,
    onClearSearch: () => { if (!modalSource) setSearchQuery('') },
    onToggleFavorites: () => { if (!modalSource) setFavoritesOpen((o) => !o) },
  })

  const handleToggleTag = useCallback((tag) => {
    setActiveTags((prev) => {
      const next = new Set(prev)
      if (next.has(tag)) next.delete(tag)
      else next.add(tag)
      return next
    })
  }, [])

  const handleSurpriseMe = useCallback(() => {
    const eligible = sourcesData.filter((s) => s.free && s.legal)
    if (!eligible.length) return
    const pick = eligible[Math.floor(Math.random() * eligible.length)]
    window.open(pick.url, '_blank', 'noopener,noreferrer')
  }, [])

  const handleExport = useCallback(() => {
    const data = { favorites: [...favorites] }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'favoritos.json'
    a.click()
    URL.revokeObjectURL(url)
  }, [favorites])

  const handleImport = useCallback(({ ids }) => {
    addFavorites(ids)
  }, [addFavorites])

  // Filtros: busca + idioma + só favoritos + tags (OR entre tags)
  const filteredResults = useMemo(() => {
    return results.filter((s) => {
      if (activeLanguage !== 'all' && s.language !== activeLanguage) return false
      if (onlyFavorites && !favorites.has(s.id)) return false
      if (activeTags.size > 0 && !s.bestFor.some((t) => activeTags.has(t))) return false
      return true
    })
  }, [results, activeLanguage, onlyFavorites, favorites, activeTags])

  // Agrupa por categoria para passar para cada CategorySection
  const sourcesByCategory = useMemo(() => {
    const map = new Map()
    for (const cat of CATEGORIES) map.set(cat.slug, [])
    for (const source of filteredResults) {
      if (map.has(source.category)) map.get(source.category).push(source)
    }
    return map
  }, [filteredResults])

  const hasActiveFilters = isSearching || onlyFavorites || activeLanguage !== 'all' || activeTags.size > 0

  return (
    <div className="min-h-screen flex flex-col">
      <Header
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        isDark={isDark}
        onThemeToggle={toggleTheme}
        favoritesCount={favorites.size}
        onFavoritesToggle={() => setFavoritesOpen((o) => !o)}
        inputRef={searchInputRef}
        onSurpriseMe={handleSurpriseMe}
        onCollectionsToggle={() => setCollectionsOpen((o) => !o)}
        collectionsCount={collections.length}
      />

      <NavBar />

      <main className="container-x flex-1 py-6 sm:py-8">
        <div className="space-y-6">
          {/* Destaque diário */}
          <DailyPick source={dailySource} onOpenModal={setModalSource} />

          {/* Filtros */}
          <div className="space-y-1">
            <FilterBar
              activeLanguage={activeLanguage}
              onLanguageChange={setActiveLanguage}
              onlyFavorites={onlyFavorites}
              onOnlyFavoritesToggle={() => setOnlyFavorites((o) => !o)}
              totalVisible={filteredResults.length}
              totalAll={sourcesData.length}
            />
            <TagFilter
              sources={sourcesData}
              activeTags={activeTags}
              onToggleTag={handleToggleTag}
            />
          </div>

          {/* Banner de busca */}
          {isSearching && filteredResults.length > 0 && (
            <div
              className="rounded-lg bg-primary/10 border border-primary/20 px-4 py-3 text-sm"
              aria-live="polite"
            >
              <strong className="text-primary">{filteredResults.length}</strong>{' '}
              <span className="text-gray-700 dark:text-text">
                resultado{filteredResults.length !== 1 ? 's' : ''} para "{debouncedQuery}"
              </span>
            </div>
          )}

          {/* Empty state */}
          {hasActiveFilters && filteredResults.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 dark:border-border px-6 py-10 text-center space-y-3">
              <p className="text-2xl">🔍</p>
              <p className="font-semibold text-gray-800 dark:text-text">Nenhuma fonte encontrada</p>
              <p className="text-sm text-gray-500 dark:text-muted">
                {isSearching && (
                  <>Nenhum resultado para <strong className="text-primary">"{debouncedQuery}"</strong>.</>
                )}
                {(onlyFavorites || activeLanguage !== 'all' || activeTags.size > 0) &&
                  ' Tente ajustar os filtros.'}
              </p>
              <p className="text-xs text-gray-400 dark:text-muted">
                Sugestões: <em>indie, documentário, jogos browser, podcast…</em>
              </p>
            </div>
          )}

          {/* Ordenação + seções */}
          <div className="space-y-10">
            <div className="flex justify-end">
              <SortSelector value={sortMode} onChange={setSortMode} />
            </div>

            {CATEGORIES.map((category) => (
              <CategorySection
                key={category.slug}
                category={category}
                sources={sourcesByCategory.get(category.slug) || []}
                favorites={favorites}
                onToggleFavorite={toggleFavorite}
                onCopyTerms={copyToClipboard}
                searchTerm={debouncedQuery}
                onOpenModal={setModalSource}
                sortMode={sortMode}
                clickStats={clickStats}
                onTrackClick={trackClick}
                collections={collections}
                onAddToCollection={addToCollection}
              />
            ))}
          </div>
        </div>
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
        onExport={handleExport}
        onImport={handleImport}
      />

      <CollectionsPanel
        isOpen={collectionsOpen}
        onClose={() => setCollectionsOpen(false)}
        collections={collections}
        allSources={sourcesData}
        onCreateCollection={createCollection}
        onRenameCollection={renameCollection}
        onDeleteCollection={deleteCollection}
        onRemoveFromCollection={removeFromCollection}
        onCopyTerms={copyToClipboard}
      />

      <Toast message={toastMessage} onDismiss={clearToast} />
      <BackToTop />
      <SourceModal
        source={modalSource}
        onClose={() => setModalSource(null)}
        note={notes[modalSource?.id] ?? ''}
        onNoteChange={(text) => setNote(modalSource.id, text)}
      />
    </div>
  )
}
