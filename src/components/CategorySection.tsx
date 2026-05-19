import { useMemo } from 'react'
import { Card } from './Card.tsx'
import { resolveIcon } from '../lib/icons.ts'
import type { Source, Collection, CategoryMeta, SortMode } from '../types.ts'

interface CategorySectionProps {
  category: CategoryMeta
  sources: Source[]
  favorites: Set<string>
  onToggleFavorite: (id: string) => void
  onCopyTerms: (text: string) => void
  searchTerm?: string
  onOpenModal?: (source: Source) => void
  sortMode?: SortMode
  clickStats?: Record<string, number>
  onTrackClick?: (id: string) => void
  collections?: Collection[]
  onAddToCollection?: (sourceId: string, collectionId: string) => void
  sharedIds?: Set<string> | null
}

export function CategorySection({
  category,
  sources,
  favorites,
  onToggleFavorite,
  onCopyTerms,
  searchTerm = '',
  onOpenModal,
  sortMode = 'original',
  clickStats = {},
  onTrackClick,
  collections = [],
  onAddToCollection,
  sharedIds = null,
}: CategorySectionProps) {
  const Icon = resolveIcon(category.icon)

  // Aplica ordenação conforme modo selecionado
  const sortedSources = useMemo(() => {
    if (sortMode === 'alphabetic') {
      return [...sources].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    }
    if (sortMode === 'most-clicked') {
      return [...sources].sort((a, b) => (clickStats[b.id] || 0) - (clickStats[a.id] || 0))
    }
    return sources
  }, [sources, sortMode, clickStats])

  if (!sources.length) return null

  return (
    <section
      id={category.slug}
      className="scroll-mt-32"
      aria-labelledby={`heading-${category.slug}`}
    >
      <header className="mb-4 flex items-center gap-3">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
          <Icon size={20} aria-hidden="true" />
        </span>
        <h2
          id={`heading-${category.slug}`}
          className="text-lg font-bold text-gray-900 dark:text-text sm:text-xl"
        >
          {category.emoji} {category.label}
        </h2>
        <span className="text-sm text-gray-500 dark:text-muted">({sources.length})</span>
      </header>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {sortedSources.map((source) => (
          <Card
            key={source.id}
            source={source}
            isFavorite={favorites.has(source.id)}
            onToggleFavorite={onToggleFavorite}
            onCopyTerms={onCopyTerms}
            searchTerm={searchTerm}
            onOpenModal={onOpenModal}
            onTrackClick={onTrackClick}
            collections={collections}
            onAddToCollection={onAddToCollection}
            isShared={sharedIds ? sharedIds.has(source.id) : false}
          />
        ))}
      </div>
    </section>
  )
}
