import { useMemo } from 'react'
import { Card } from './Card.jsx'
import { resolveIcon } from '../lib/icons.js'

/**
 * Seção de uma categoria. Mostra ícone, nome, contagem e grid de cards.
 * Se sources estiver vazio, retorna null (oculta a seção).
 */
export function CategorySection({
  category,
  sources,
  favorites,
  onToggleFavorite,
  onCopyTerms,
  searchTerm = '',
  onOpenModal = undefined,
  sortMode = 'original',
  clickStats = {},
  onTrackClick = undefined,
}) {
  if (!sources.length) return null

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

  return (
    <section id={category.slug} className="scroll-mt-32" aria-labelledby={`heading-${category.slug}`}>
      <header className="flex items-center gap-3 mb-4">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-primary/15 text-primary">
          <Icon size={20} aria-hidden="true" />
        </span>
        <h2
          id={`heading-${category.slug}`}
          className="text-lg sm:text-xl font-bold text-gray-900 dark:text-text"
        >
          {category.emoji} {category.label}
        </h2>
        <span className="text-sm text-gray-500 dark:text-muted">
          ({sources.length})
        </span>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
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
          />
        ))}
      </div>
    </section>
  )
}
