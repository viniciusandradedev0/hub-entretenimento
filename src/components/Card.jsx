import { useState } from 'react'
import { Heart, Copy, ExternalLink } from 'lucide-react'
import clsx from 'clsx'
import { resolveIcon } from '../lib/icons.js'
import { highlight } from '../lib/highlight.jsx'

/**
 * Card de uma fonte. Mostra ícone, nome, descrição, tags (bestFor),
 * idioma, botões de favoritar e copiar termos de busca.
 */
export function Card({ source, isFavorite, onToggleFavorite, onCopyTerms, searchTerm = '', onOpenModal = undefined }) {
  const [imgError, setImgError] = useState(false)
  const Icon = resolveIcon(source.icon)

  // URL pode estar malformada em sources.json; protege com try/catch
  let faviconUrl = ''
  try {
    faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(source.url).hostname}&sz=64`
  } catch {
    /* faviconUrl fica vazio → onError do <img> dispara fallback do Icon */
  }

  const langLabel = {
    'pt-BR': 'PT-BR',
    en: 'EN',
    multi: 'Multi',
  }[source.language] || source.language

  const langTitle = {
    'pt-BR': 'Conteúdo em português brasileiro',
    en: 'Conteúdo em inglês',
    multi: 'Conteúdo disponível em múltiplos idiomas',
  }[source.language] || `Idioma: ${source.language}`

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
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onOpenModal?.(source) } }}
      title={onOpenModal ? 'Clique para ver detalhes' : undefined}
      className={clsx(
        'group flex flex-col gap-3 rounded-xl p-4',
        'bg-white dark:bg-surface',
        'border border-gray-200 dark:border-border',
        'shadow-sm hover:shadow-lg dark:shadow-none dark:hover:shadow-primary/10',
        'hover:border-primary/50 hover:-translate-y-0.5',
        'transition-all duration-200',
        onOpenModal && 'cursor-pointer'
      )}
    >
      {/* ─── Header: ícone/favicon + título + favoritar ─── */}
      <header className="flex items-start gap-3">
        <div className="flex-shrink-0 w-10 h-10 rounded-lg overflow-hidden bg-gray-100 dark:bg-background flex items-center justify-center">
          {imgError ? (
            <Icon size={20} className="text-primary" aria-hidden="true" />
          ) : (
            <img
              src={faviconUrl}
              alt=""
              loading="lazy"
              onError={() => setImgError(true)}
              className="w-10 h-10 object-contain"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <a
            href={source.url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-semibold text-gray-900 dark:text-text hover:text-primary dark:hover:text-primary transition-colors"
          >
            <span className="truncate">{highlight(source.name, searchTerm)}</span>
            <ExternalLink size={13} className="opacity-50 flex-shrink-0" aria-hidden="true" />
          </a>

          <div className="flex flex-wrap gap-1 mt-1">
            <span
              title={langTitle}
              className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary/10 text-primary dark:bg-primary/20"
            >
              {langLabel}
            </span>
            {source.bestFor.slice(0, 3).map((tag) => (
              <span
                key={tag}
                title={`Ideal para: ${tag}`}
                className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-gray-100 dark:bg-background text-gray-700 dark:text-muted"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite(source.id)}
          aria-label={isFavorite ? `Remover ${source.name} dos favoritos` : `Favoritar ${source.name}`}
          title={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          className={clsx(
            'flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center',
            'transition-colors',
            isFavorite
              ? 'text-red-500 hover:bg-red-500/10'
              : 'text-gray-400 dark:text-muted hover:text-red-500 hover:bg-red-500/10'
          )}
        >
          <Heart size={17} fill={isFavorite ? 'currentColor' : 'none'} aria-hidden="true" />
        </button>
      </header>

      {/* ─── Descrição ─── */}
      <p className="text-sm text-gray-600 dark:text-muted leading-relaxed flex-1">
        {highlight(source.description, searchTerm)}
      </p>

      {/* ─── Footer: termos + botão copiar ─── */}
      <footer className="pt-3 border-t border-gray-200 dark:border-border">
        <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-muted mb-1.5">
          Termos de busca
        </p>
        <ul className="mb-2 space-y-0.5">
          {source.searchTerms.slice(0, 2).map((term) => (
            <li
              key={term}
              className="text-xs font-mono text-gray-600 dark:text-muted truncate"
            >
              <span className="text-primary mr-1">›</span>
              {term}
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={handleCopy}
          className={clsx(
            'w-full inline-flex items-center justify-center gap-1.5',
            'px-3 py-1.5 rounded-md text-xs font-medium',
            'bg-gray-100 dark:bg-background',
            'border border-gray-200 dark:border-border',
            'text-gray-700 dark:text-muted',
            'hover:bg-primary/10 hover:text-primary hover:border-primary/50',
            'transition-colors'
          )}
          aria-label={`Copiar ${source.searchTerms.length} termos de busca de ${source.name}`}
        >
          <Copy size={13} aria-hidden="true" />
          Copiar termos ({source.searchTerms.length})
        </button>
      </footer>
    </article>
  )
}
