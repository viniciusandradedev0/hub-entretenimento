import { useState, useEffect } from 'react'
import { Heart, Copy, ExternalLink, FolderPlus } from 'lucide-react'
import clsx from 'clsx'
import { resolveIcon } from '../lib/icons.ts'
import { highlight } from '../lib/highlight.tsx'
import type { Source, Collection } from '../types.ts'

interface CardProps {
  source: Source
  isFavorite: boolean
  onToggleFavorite: (id: string) => void
  onCopyTerms: (text: string) => void
  searchTerm?: string
  onOpenModal?: (source: Source) => void
  onTrackClick?: (id: string) => void
  onAddToCollection?: (sourceId: string, collectionId: string) => void
  collections?: Collection[]
  isShared?: boolean
}

export function Card({
  source,
  isFavorite,
  onToggleFavorite,
  onCopyTerms,
  searchTerm = '',
  onOpenModal,
  onTrackClick,
  onAddToCollection,
  collections = [],
  isShared = false,
}: CardProps) {
  const [imgError, setImgError] = useState(false)
  const [collectionMenuOpen, setCollectionMenuOpen] = useState(false)
  const Icon = resolveIcon(source.icon)

  // Fecha o menu de coleções ao clicar fora
  useEffect(() => {
    if (!collectionMenuOpen) return
    const close = () => setCollectionMenuOpen(false)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [collectionMenuOpen])

  let faviconUrl = ''
  try {
    faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(source.url).hostname}&sz=64`
  } catch {
    /* faviconUrl fica vazio → onError do <img> dispara fallback do Icon */
  }

  const langLabel =
    {
      'pt-BR': 'PT-BR',
      en: 'EN',
      multi: 'Multi',
    }[source.language] || source.language

  const langTitle =
    {
      'pt-BR': 'Conteúdo em português brasileiro',
      en: 'Conteúdo em inglês',
      multi: 'Conteúdo disponível em múltiplos idiomas',
    }[source.language] || `Idioma: ${source.language}`

  // Badges de temporalidade da fonte
  const daysSinceVerified = source.lastVerified
    ? Math.floor((Date.now() - new Date(source.lastVerified).getTime()) / 86_400_000)
    : null
  const isStale = daysSinceVerified !== null && daysSinceVerified > 180
  const isNew = daysSinceVerified !== null && daysSinceVerified <= 30

  const handleCopy = (e) => {
    e.preventDefault()
    onCopyTerms(source.searchTerms.join('\n'))
  }

  const handleCardClick = (e) => {
    if (e.target.closest('a, button')) return
    onOpenModal?.(source)
  }

  return (
    <article
      onClick={handleCardClick}
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onOpenModal?.(source)
        }
      }}
      title={onOpenModal ? 'Clique para ver detalhes' : undefined}
      className={clsx(
        'group flex flex-col gap-3 rounded-xl p-4',
        'bg-white dark:bg-surface',
        'border hover:-translate-y-0.5 hover:border-primary/50',
        'shadow-sm hover:shadow-lg dark:shadow-none dark:hover:shadow-primary/10',
        'transition-all duration-200',
        onOpenModal && 'cursor-pointer',
        isShared
          ? 'border-primary/60 shadow-md shadow-primary/10 ring-2 ring-primary/30'
          : 'border-gray-200 dark:border-border'
      )}
    >
      {/* ─── Header: ícone/favicon + título + favoritar ─── */}
      <header className="flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100 dark:bg-background">
          {imgError ? (
            <Icon size={20} className="text-primary" aria-hidden="true" />
          ) : (
            <img
              src={faviconUrl}
              alt=""
              loading="lazy"
              onError={() => setImgError(true)}
              className="h-10 w-10 object-contain"
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => onTrackClick?.(source.id)}
            className="inline-flex items-center gap-1 font-semibold text-gray-900 transition-colors hover:text-primary dark:text-text dark:hover:text-primary"
          >
            <span className="truncate">{highlight(source.name, searchTerm)}</span>
            <ExternalLink size={13} className="flex-shrink-0 opacity-50" aria-hidden="true" />
          </a>

          <div className="mt-1 flex flex-wrap gap-1">
            <span
              title={langTitle}
              className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary dark:bg-primary/20"
            >
              {langLabel}
            </span>
            {source.bestFor.slice(0, 3).map((tag) => (
              <span
                key={tag}
                title={`Ideal para: ${tag}`}
                className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-700 dark:bg-background dark:text-muted"
              >
                {tag}
              </span>
            ))}
            {isNew && (
              <span
                title="Fonte adicionada ou verificada recentemente"
                className="rounded border border-emerald-500/20 bg-emerald-500/15 px-1.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"
              >
                ✦ Novo
              </span>
            )}
            {isStale && (
              <span
                title={`Última verificação há ${daysSinceVerified} dias — link pode estar desatualizado`}
                className="rounded border border-amber-500/20 bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400"
              >
                ⚠️ {daysSinceVerified}d
              </span>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite(source.id)}
          aria-label={
            isFavorite ? `Remover ${source.name} dos favoritos` : `Favoritar ${source.name}`
          }
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className={clsx(
            'flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg',
            'transition-colors',
            isFavorite
              ? 'text-red-500 hover:bg-red-500/10'
              : 'text-gray-400 hover:bg-red-500/10 hover:text-red-500 dark:text-muted'
          )}
        >
          <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </header>

      {/* ─── Descrição ─── */}
      <p className="flex-1 text-sm leading-relaxed text-gray-600 dark:text-muted">
        {highlight(source.description, searchTerm)}
      </p>

      {/* ─── Footer: termos + coleção + copiar ─── */}
      <footer className="border-t border-gray-200 pt-3 dark:border-border">
        <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-muted">
          Termos de busca
        </p>
        <ul className="mb-2 space-y-0.5">
          {source.searchTerms.slice(0, 2).map((term) => (
            <li key={term} className="truncate font-mono text-xs text-gray-600 dark:text-muted">
              <span className="mr-1 text-primary">›</span>
              {term}
            </li>
          ))}
        </ul>

        <div className="flex gap-1.5">
          {/* Dropdown de coleções */}
          {collections.length > 0 && (
            <div className="relative flex-shrink-0">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  setCollectionMenuOpen((o) => !o)
                }}
                aria-label={`Adicionar ${source.name} a uma coleção`}
                title="Adicionar à coleção"
                className={clsx(
                  'inline-flex h-[30px] items-center gap-1 rounded-md px-2 text-xs font-medium',
                  'border border-gray-200 bg-gray-100 dark:border-border dark:bg-background',
                  'text-gray-700 hover:border-primary/50 hover:bg-primary/10 hover:text-primary dark:text-muted',
                  'transition-colors'
                )}
              >
                <FolderPlus size={12} aria-hidden="true" />
              </button>
              {collectionMenuOpen && (
                <div
                  className="absolute bottom-full left-0 z-20 mb-1 min-w-36 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg dark:border-border dark:bg-surface"
                  onClick={(e) => e.stopPropagation()}
                >
                  {collections.map((col) => (
                    <button
                      key={col.id}
                      type="button"
                      onClick={() => {
                        onAddToCollection?.(source.id, col.id)
                        setCollectionMenuOpen(false)
                      }}
                      className="w-full truncate px-3 py-2 text-left text-xs text-gray-700 transition-colors hover:bg-primary/10 hover:text-primary dark:text-muted"
                    >
                      {col.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Copiar termos */}
          <button
            type="button"
            onClick={handleCopy}
            className={clsx(
              'inline-flex flex-1 items-center justify-center gap-1.5',
              'rounded-md px-3 py-1.5 text-xs font-medium',
              'bg-gray-100 dark:bg-background',
              'border border-gray-200 dark:border-border',
              'text-gray-700 dark:text-muted',
              'hover:border-primary/50 hover:bg-primary/10 hover:text-primary',
              'transition-colors'
            )}
            aria-label={`Copiar ${source.searchTerms.length} termos de busca de ${source.name}`}
          >
            <Copy size={13} aria-hidden="true" />
            Copiar termos ({source.searchTerms.length})
          </button>
        </div>
      </footer>
    </article>
  )
}
