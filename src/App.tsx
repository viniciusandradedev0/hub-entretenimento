import { useState, useMemo, useRef, useCallback, useEffect } from 'react'
import type { Source } from './types.ts'
import sourcesData from './data/sources.ts'
import { CATEGORIES } from './lib/categories.ts'
import { useFavorites } from './hooks/useFavorites.ts'
import { useTheme } from './hooks/useTheme.ts'
import { useSearch } from './hooks/useSearch.ts'
import { useClipboard } from './hooks/useClipboard.ts'
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts.ts'
import { useNotes } from './hooks/useNotes.ts'
import { useClickStats } from './hooks/useClickStats.ts'
import { useCollections } from './hooks/useCollections.ts'
import { getDailyPick, dayHash } from './lib/daily.ts'
import { decodeShare, buildShareUrl } from './lib/share.ts'
import type { FeaturedVideoItem } from './types.ts'
import featuredVideosRaw from './data/featured-videos.json'
import { Header } from './components/Header.tsx'
import { NavBar } from './components/NavBar.tsx'
import { CategorySection } from './components/CategorySection.tsx'
import { FavoritesPanel } from './components/FavoritesPanel.tsx'
import { Toast } from './components/Toast.tsx'
import { FilterBar } from './components/FilterBar.tsx'
import { TagFilter } from './components/TagFilter.tsx'
import { SortSelector } from './components/SortSelector.tsx'
import { DailyPick } from './components/DailyPick.tsx'
import { BackToTop } from './components/BackToTop.tsx'
import { SourceModal } from './components/SourceModal.tsx'
import { CollectionsPanel } from './components/CollectionsPanel.tsx'
import { UpdatePrompt } from './components/UpdatePrompt.tsx'
import { FeaturedVideo } from './components/FeaturedVideo.tsx'
import { StatsModal } from './components/StatsModal.tsx'

// Calculado uma vez por carregamento — muda à meia-noite automaticamente
const dailySource = getDailyPick(sourcesData)
const featuredVideos = featuredVideosRaw as FeaturedVideoItem[]
const dailyVideo = featuredVideos[dayHash() % featuredVideos.length] ?? null

export default function App() {
  const [searchQuery, setSearchQuery] = useState('')
  const [favoritesOpen, setFavoritesOpen] = useState(false)
  const [activeLanguage, setActiveLanguage] = useState('all')
  const [onlyFavorites, setOnlyFavorites] = useState(false)
  const [activeTags, setActiveTags] = useState(new Set<string>())
  const [sortMode, setSortMode] = useState<'original' | 'alphabetic' | 'most-clicked'>('original')
  const [modalSource, setModalSource] = useState<Source | null>(null)
  const [collectionsOpen, setCollectionsOpen] = useState(false)
  const [sharedSourceIds, setSharedSourceIds] = useState(new Set<string>())
  const [sharedName, setSharedName] = useState('')
  const [statsOpen, setStatsOpen] = useState(false)

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

  // Lê ?share= na carga inicial e popula sharedSourceIds
  useEffect(() => {
    const encoded = new URLSearchParams(window.location.search).get('share')
    if (!encoded) return
    const payload = decodeShare(encoded)
    if (!payload) return
    setSharedSourceIds(new Set(payload.ids))
    setSharedName(payload.name)
  }, [])

  // Web Share API com fallback para clipboard
  const handleShare = useCallback(
    async (sourceIds, name = '') => {
      const url = buildShareUrl(sourceIds, name)
      if (navigator.share) {
        try {
          await navigator.share({ title: name ? `Hub — ${name}` : 'Hub de Entretenimento', url })
        } catch {
          /* cancelado pelo usuário */
        }
      } else {
        copyToClipboard(url)
      }
    },
    [copyToClipboard]
  )

  // Compartilha a página atual (URL do browser)
  const handleSharePage = useCallback(async () => {
    const url = window.location.href
    if (navigator.share) {
      try {
        await navigator.share({ title: 'Hub de Entretenimento', url })
      } catch {
        /* cancelado */
      }
    } else {
      copyToClipboard(url)
    }
  }, [copyToClipboard])

  const handleClearShared = useCallback(() => {
    setSharedSourceIds(new Set())
    setSharedName('')
    // Remove ?share= da URL sem recarregar a página
    const url = new URL(window.location.href)
    url.searchParams.delete('share')
    window.history.replaceState(null, '', url.toString())
  }, [])

  // Atalhos desativados quando o modal está aberto
  useKeyboardShortcuts({
    searchInputRef,
    searchQuery,
    onClearSearch: () => {
      if (!modalSource) setSearchQuery('')
    },
    onToggleFavorites: () => {
      if (!modalSource) setFavoritesOpen((o) => !o)
    },
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

  const handleImport = useCallback(
    ({ ids }) => {
      addFavorites(ids)
    },
    [addFavorites]
  )

  // Reseta estatísticas de cliques
  const handleResetStats = useCallback(() => {
    localStorage.removeItem('hub:click-stats')
    window.location.reload()
  }, [])

  // Atualiza streak de visitas diárias
  useEffect(() => {
    try {
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86_400_000).toDateString()
      const raw = localStorage.getItem('hub:visit-streak')
      const prev = raw ? JSON.parse(raw) : { days: 0, lastVisit: '' }
      if (prev.lastVisit === today) return
      const days = prev.lastVisit === yesterday ? prev.days + 1 : 1
      localStorage.setItem('hub:visit-streak', JSON.stringify({ days, lastVisit: today }))
    } catch {
      /* quota */
    }
  }, [])

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

  const hasActiveFilters =
    isSearching || onlyFavorites || activeLanguage !== 'all' || activeTags.size > 0

  return (
    <div className="flex min-h-screen flex-col">
      {/* Skip-to-content para leitores de tela e navegação por teclado */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Pular para o conteúdo
      </a>

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
        onShare={handleSharePage}
        onStatsToggle={() => setStatsOpen((o) => !o)}
      />

      <NavBar />

      <main id="main-content" className="container-x flex-1 py-6 sm:py-8" tabIndex={-1}>
        <div className="space-y-6">
          {/* Destaque diário */}
          <DailyPick source={dailySource} onOpenModal={setModalSource} />

          {/* Vídeo em destaque */}
          <FeaturedVideo video={dailyVideo} />

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

          {/* Banner de URL compartilhada */}
          {sharedSourceIds.size > 0 && (
            <div
              className="flex items-center justify-between gap-4 rounded-lg border border-primary/30 bg-primary/10 px-4 py-3 text-sm"
              aria-live="polite"
            >
              <span className="text-gray-700 dark:text-text">
                Visualizando <strong className="text-primary">{sharedSourceIds.size}</strong> fonte
                {sharedSourceIds.size !== 1 ? 's' : ''} compartilhada
                {sharedSourceIds.size !== 1 ? 's' : ''}
                {sharedName && (
                  <>
                    {' '}
                    — <em className="font-semibold not-italic">{sharedName}</em>
                  </>
                )}
              </span>
              <button
                type="button"
                onClick={handleClearShared}
                className="flex-shrink-0 text-xs text-gray-500 underline transition-colors hover:text-gray-900 dark:text-muted dark:hover:text-text"
              >
                Limpar
              </button>
            </div>
          )}

          {/* Banner de busca */}
          {isSearching && filteredResults.length > 0 && (
            <div
              className="rounded-lg border border-primary/20 bg-primary/10 px-4 py-3 text-sm"
              aria-live="polite"
            >
              <strong className="text-primary">{filteredResults.length}</strong>{' '}
              <span className="text-gray-700 dark:text-text">
                resultado{filteredResults.length !== 1 ? 's' : ''} para &ldquo;{debouncedQuery}
                &rdquo;
              </span>
            </div>
          )}

          {/* Empty state */}
          {hasActiveFilters && filteredResults.length === 0 && (
            <div className="space-y-3 rounded-xl border border-dashed border-gray-300 px-6 py-10 text-center dark:border-border">
              <p className="text-2xl">🔍</p>
              <p className="font-semibold text-gray-800 dark:text-text">Nenhuma fonte encontrada</p>
              <p className="text-sm text-gray-500 dark:text-muted">
                {isSearching && (
                  <>
                    Nenhum resultado para{' '}
                    <strong className="text-primary">&ldquo;{debouncedQuery}&rdquo;</strong>.
                  </>
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
                sharedIds={sharedSourceIds.size > 0 ? sharedSourceIds : null}
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
        onShareCollection={handleShare}
      />

      {/* ARIA live region: anuncia contagem de resultados a leitores de tela */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {isSearching &&
          `${filteredResults.length} resultado${filteredResults.length !== 1 ? 's' : ''} encontrado${filteredResults.length !== 1 ? 's' : ''}`}
      </div>

      <Toast message={toastMessage} onDismiss={clearToast} />
      <UpdatePrompt />
      <BackToTop />
      <SourceModal
        source={modalSource}
        onClose={() => setModalSource(null)}
        note={notes[modalSource?.id ?? ''] ?? ''}
        onNoteChange={(text) => setNote(modalSource!.id, text)}
      />

      <StatsModal
        isOpen={statsOpen}
        onClose={() => setStatsOpen(false)}
        clickStats={clickStats}
        favorites={favorites}
        collections={collections}
        allSources={sourcesData}
        onResetStats={handleResetStats}
      />
    </div>
  )
}
