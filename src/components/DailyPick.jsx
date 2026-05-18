import { useState } from 'react'
import { Sparkles, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react'
import clsx from 'clsx'
import { resolveIcon } from '../lib/icons.js'

export function DailyPick({ source, onOpenModal }) {
  const [collapsed, setCollapsed] = useState(false)
  const [imgError, setImgError] = useState(false)

  if (!source) return null

  const Icon = resolveIcon(source.icon)
  let faviconUrl = ''
  try {
    faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(source.url).hostname}&sz=64`
  } catch { /* fallback */ }

  return (
    <section
      aria-labelledby="daily-pick-heading"
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent dark:from-primary/20 dark:via-primary/10 dark:to-transparent p-4 sm:p-5"
    >
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expandir fonte do dia' : 'Recolher fonte do dia'}
        className="absolute top-3 right-3 w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-muted hover:bg-white/40 dark:hover:bg-surface/50 transition-colors"
      >
        {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      <div className="flex items-center gap-2 mb-3">
        <Sparkles size={16} className="text-primary" aria-hidden="true" />
        <h2 id="daily-pick-heading" className="text-xs font-bold uppercase tracking-wider text-primary">
          Fonte do dia
        </h2>
      </div>

      {!collapsed && (
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden bg-white dark:bg-surface flex items-center justify-center shadow-sm">
            {imgError ? (
              <Icon size={26} className="text-primary" aria-hidden="true" />
            ) : (
              <img
                src={faviconUrl}
                alt=""
                loading="lazy"
                onError={() => setImgError(true)}
                className="w-12 h-12 sm:w-14 sm:h-14 object-contain"
              />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-text truncate">{source.name}</h3>
            <p className="text-sm text-gray-600 dark:text-muted mt-1 line-clamp-2">{source.description}</p>
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <ExternalLink size={13} aria-hidden="true" />
                Abrir site
              </a>
              {onOpenModal && (
                <button
                  type="button"
                  onClick={() => onOpenModal(source)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-300 dark:border-border text-gray-700 dark:text-muted hover:border-primary hover:text-primary transition-colors"
                >
                  Ver detalhes
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
