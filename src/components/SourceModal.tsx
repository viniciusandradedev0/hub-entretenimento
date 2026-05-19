import React, { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ExternalLink } from 'lucide-react'
import { resolveIcon } from '../lib/icons.ts'
import { useFocusTrap } from '../hooks/useFocusTrap.ts'

export function SourceModal({ source, onClose, note, onNoteChange }) {
  const [imgError, setImgError] = useState(false)
  const trapRef = useFocusTrap(!!source)

  // Reset imgError quando a fonte mudar
  useEffect(() => {
    setImgError(false)
  }, [source?.id])

  // Fechar com Escape
  useEffect(() => {
    if (!source) return
    const handle = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [source, onClose])

  if (!source) return null

  const Icon = resolveIcon(source.icon)
  let faviconUrl = ''
  try {
    faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(source.url).hostname}&sz=128`
  } catch {
    /* fallback para ícone */
  }

  const langLabel =
    { 'pt-BR': 'PT-BR', en: 'EN', multi: 'Multi' }[source.language] || source.language

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        ref={trapRef as React.RefObject<HTMLDivElement>}
        role="dialog"
        aria-modal="true"
        aria-label={source?.name}
        className="relative flex max-h-[90vh] w-full max-w-lg flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-border dark:bg-surface"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 border-b border-gray-200 p-5 dark:border-border">
          {/* Favicon / ícone */}
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gray-100 dark:bg-background">
            {imgError ? (
              <Icon size={24} className="text-primary" aria-hidden="true" />
            ) : (
              <img
                src={faviconUrl}
                alt=""
                loading="lazy"
                onError={() => setImgError(true)}
                className="h-12 w-12 object-contain"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="truncate text-lg font-bold text-gray-900 dark:text-text">
              {source.name}
            </h2>
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                {langLabel}
              </span>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-1">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/90"
            >
              <ExternalLink size={13} aria-hidden="true" />
              Abrir site
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 dark:text-muted dark:hover:bg-background"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-5 overflow-y-auto p-5">
          {/* Descrição */}
          <p className="text-sm leading-relaxed text-gray-600 dark:text-muted">
            {source.description}
          </p>

          {/* Tags bestFor (todas) */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-muted">
              Ideal para
            </p>
            <div className="flex flex-wrap gap-1.5">
              {source.bestFor.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-gray-200 bg-gray-100 px-2.5 py-1 text-xs text-gray-700 dark:border-border dark:bg-background dark:text-muted"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Todos os searchTerms */}
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-muted">
              Termos de busca
            </p>
            <ul className="space-y-1">
              {source.searchTerms.map((term) => (
                <li key={term} className="font-mono text-xs text-gray-600 dark:text-muted">
                  <span className="mr-1 text-primary">›</span>
                  {term}
                </li>
              ))}
            </ul>
          </div>

          {/* Notas pessoais */}
          <div>
            <label
              htmlFor={`note-${source.id}`}
              className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-muted"
            >
              Notas pessoais
            </label>
            <textarea
              id={`note-${source.id}`}
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Anote aqui algo sobre esta fonte..."
              rows={3}
              className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 placeholder-gray-400 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-border dark:bg-background dark:text-text dark:placeholder-muted"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
