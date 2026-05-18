import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, ExternalLink } from 'lucide-react'
import clsx from 'clsx'
import { resolveIcon } from '../lib/icons.js'

export function SourceModal({ source, onClose, note, onNoteChange }) {
  const [imgError, setImgError] = useState(false)

  // Reset imgError quando a fonte mudar
  useEffect(() => { setImgError(false) }, [source?.id])

  // Fechar com Escape
  useEffect(() => {
    if (!source) return
    const handle = (e) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [source, onClose])

  if (!source) return null

  const Icon = resolveIcon(source.icon)
  let faviconUrl = ''
  try {
    faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(source.url).hostname}&sz=128`
  } catch { /* fallback para ícone */ }

  const langLabel = { 'pt-BR': 'PT-BR', en: 'EN', multi: 'Multi' }[source.language] || source.language

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-2xl bg-white dark:bg-surface border border-gray-200 dark:border-border shadow-2xl flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-5 border-b border-gray-200 dark:border-border">
          {/* Favicon / ícone */}
          <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden bg-gray-100 dark:bg-background flex items-center justify-center">
            {imgError ? (
              <Icon size={24} className="text-primary" aria-hidden="true" />
            ) : (
              <img
                src={faviconUrl}
                alt=""
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-12 h-12 object-contain"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-bold text-gray-900 dark:text-text truncate">{source.name}</h2>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <span className="text-[10px] font-semibold uppercase tracking-wide px-1.5 py-0.5 rounded bg-primary/10 text-primary">
                {langLabel}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 flex-shrink-0">
            <a
              href={source.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
            >
              <ExternalLink size={13} aria-hidden="true" />
              Abrir site
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-muted hover:bg-gray-100 dark:hover:bg-background transition-colors"
            >
              <X size={16} aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="overflow-y-auto p-5 space-y-5">
          {/* Descrição */}
          <p className="text-sm text-gray-600 dark:text-muted leading-relaxed">{source.description}</p>

          {/* Tags bestFor (todas) */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-muted mb-2">Ideal para</p>
            <div className="flex flex-wrap gap-1.5">
              {source.bestFor.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2.5 py-1 rounded-full bg-gray-100 dark:bg-background text-gray-700 dark:text-muted border border-gray-200 dark:border-border"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Todos os searchTerms */}
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-muted mb-2">Termos de busca</p>
            <ul className="space-y-1">
              {source.searchTerms.map((term) => (
                <li key={term} className="text-xs font-mono text-gray-600 dark:text-muted">
                  <span className="text-primary mr-1">›</span>{term}
                </li>
              ))}
            </ul>
          </div>

          {/* Notas pessoais */}
          <div>
            <label
              htmlFor={`note-${source.id}`}
              className="text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-muted block mb-2"
            >
              Notas pessoais
            </label>
            <textarea
              id={`note-${source.id}`}
              value={note}
              onChange={(e) => onNoteChange(e.target.value)}
              placeholder="Anote aqui algo sobre esta fonte..."
              rows={3}
              className="w-full rounded-lg px-3 py-2 text-sm bg-gray-50 dark:bg-background border border-gray-200 dark:border-border text-gray-800 dark:text-text placeholder-gray-400 dark:placeholder-muted resize-none focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
            />
          </div>
        </div>
      </div>
    </div>,
    document.body
  )
}
