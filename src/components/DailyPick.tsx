import { useState } from 'react'
import { Sparkles, ExternalLink, ChevronUp, ChevronDown } from 'lucide-react'
import { resolveIcon } from '../lib/icons.ts'

export function DailyPick({ source, onOpenModal }) {
  const [collapsed, setCollapsed] = useState(false)
  const [imgError, setImgError] = useState(false)

  if (!source) return null

  const Icon = resolveIcon(source.icon)
  let faviconUrl = ''
  try {
    faviconUrl = `https://www.google.com/s2/favicons?domain=${new URL(source.url).hostname}&sz=64`
  } catch {
    /* fallback */
  }

  return (
    <section
      aria-labelledby="daily-pick-heading"
      className="relative overflow-hidden rounded-2xl border border-primary/30 bg-gradient-to-br from-primary/15 via-primary/5 to-transparent p-4 dark:from-primary/20 dark:via-primary/10 dark:to-transparent sm:p-5"
    >
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        aria-label={collapsed ? 'Expandir fonte do dia' : 'Recolher fonte do dia'}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white/40 dark:text-muted dark:hover:bg-surface/50"
      >
        {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
      </button>

      <div className="mb-3 flex items-center gap-2">
        <Sparkles size={16} className="text-primary" aria-hidden="true" />
        <h2
          id="daily-pick-heading"
          className="text-xs font-bold uppercase tracking-wider text-primary"
        >
          Fonte do dia
        </h2>
      </div>

      {!collapsed && (
        <div className="flex items-start gap-3 sm:gap-4">
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white shadow-sm dark:bg-surface sm:h-14 sm:w-14">
            {imgError ? (
              <Icon size={26} className="text-primary" aria-hidden="true" />
            ) : (
              <img
                src={faviconUrl}
                alt=""
                loading="lazy"
                onError={() => setImgError(true)}
                className="h-12 w-12 object-contain sm:h-14 sm:w-14"
              />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-bold text-gray-900 dark:text-text sm:text-lg">
              {source.name}
            </h3>
            <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-muted">
              {source.description}
            </p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <a
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary/90"
              >
                <ExternalLink size={13} aria-hidden="true" />
                Abrir site
              </a>
              {onOpenModal && (
                <button
                  type="button"
                  onClick={() => onOpenModal(source)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary dark:border-border dark:text-muted"
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
