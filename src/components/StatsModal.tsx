import { useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import { X, BarChart2, Heart, FolderOpen, MousePointerClick, Flame, Trash2 } from 'lucide-react'
import type { Source, Collection } from '../types.ts'

interface StatsModalProps {
  isOpen: boolean
  onClose: () => void
  clickStats: Record<string, number>
  favorites: Set<string>
  collections: Collection[]
  allSources: Source[]
  onResetStats: () => void
}

const CATEGORY_LABEL: Record<string, string> = {
  filmes: '🎬 Filmes',
  musica: '🎵 Música',
  podcasts: '🎙️ Podcasts',
  jogos: '🎮 Jogos',
  documentarios: '📚 Documentários',
}

export function StatsModal({
  isOpen,
  onClose,
  clickStats,
  favorites,
  collections,
  allSources,
  onResetStats,
}: StatsModalProps) {
  // Fechar com Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  const totalClicks = useMemo(
    () => Object.values(clickStats).reduce((a, b) => a + b, 0),
    [clickStats]
  )

  const topSources = useMemo(() => {
    return Object.entries(clickStats)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([id, count]) => ({
        source: allSources.find((s) => s.id === id),
        count,
      }))
      .filter((item) => item.source)
  }, [clickStats, allSources])

  const maxClicks = topSources[0]?.count ?? 1

  const favoriteCategory = useMemo(() => {
    const catClicks: Record<string, number> = {}
    for (const [id, count] of Object.entries(clickStats)) {
      const source = allSources.find((s) => s.id === id)
      if (source) {
        catClicks[source.category] = (catClicks[source.category] ?? 0) + count
      }
    }
    const entries = Object.entries(catClicks)
    if (!entries.length) return null
    return entries.sort(([, a], [, b]) => b - a)[0][0]
  }, [clickStats, allSources])

  // Streak de visitas
  const streak = useMemo(() => {
    try {
      const raw = localStorage.getItem('hub:visit-streak')
      if (!raw) return 1
      const { days, lastVisit } = JSON.parse(raw)
      const today = new Date().toDateString()
      const yesterday = new Date(Date.now() - 86_400_000).toDateString()
      if (lastVisit === today) return days
      if (lastVisit === yesterday) return days
      return 1
    } catch {
      return 1
    }
  }, [])

  if (!isOpen) return null

  return createPortal(
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Suas estatísticas"
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
      >
        <div className="flex max-h-[90vh] w-full max-w-md flex-col rounded-2xl border border-gray-200 bg-white shadow-2xl dark:border-border dark:bg-surface">
          {/* Header */}
          <div className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-5 dark:border-border">
            <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-text">
              <BarChart2 size={18} className="text-primary" aria-hidden="true" />
              Suas Estatísticas
            </h2>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar estatísticas"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-muted dark:hover:bg-background dark:hover:text-text"
            >
              <X size={18} />
            </button>
          </div>

          <div className="space-y-6 overflow-y-auto p-5">
            {/* Cards de números */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-center">
                <MousePointerClick size={20} className="mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold text-primary">{totalClicks}</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-muted">cliques totais</p>
              </div>
              <div className="rounded-xl border border-red-500/10 bg-red-500/5 p-4 text-center">
                <Heart size={20} className="mx-auto mb-1 text-red-500" />
                <p className="text-2xl font-bold text-red-500">{favorites.size}</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-muted">favoritos</p>
              </div>
              <div className="rounded-xl border border-primary/10 bg-primary/5 p-4 text-center">
                <FolderOpen size={20} className="mx-auto mb-1 text-primary" />
                <p className="text-2xl font-bold text-primary">{collections.length}</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-muted">coleções</p>
              </div>
              <div className="rounded-xl border border-orange-500/10 bg-orange-500/5 p-4 text-center">
                <Flame size={20} className="mx-auto mb-1 text-orange-500" />
                <p className="text-2xl font-bold text-orange-500">{streak}</p>
                <p className="mt-0.5 text-xs text-gray-500 dark:text-muted">dias seguidos</p>
              </div>
            </div>

            {/* Categoria favorita */}
            {favoriteCategory && (
              <div>
                <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-muted">
                  Categoria mais acessada
                </p>
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-800 dark:border-border dark:bg-background dark:text-text">
                  {CATEGORY_LABEL[favoriteCategory] ?? favoriteCategory}
                </div>
              </div>
            )}

            {/* Top fontes */}
            {topSources.length > 0 && (
              <div>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-gray-500 dark:text-muted">
                  Fontes mais acessadas
                </p>
                <ul className="space-y-2">
                  {topSources.map(({ source, count }) => (
                    <li key={source!.id} className="flex items-center gap-2">
                      <span className="flex-1 truncate text-xs font-medium text-gray-700 dark:text-text">
                        {source!.name}
                      </span>
                      <div className="flex flex-shrink-0 items-center gap-2">
                        {/* Mini barra de progresso */}
                        <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-200 dark:bg-background">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${Math.round((count / maxClicks) * 100)}%` }}
                          />
                        </div>
                        <span className="w-6 text-right text-xs text-gray-500 dark:text-muted">
                          {count}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {totalClicks === 0 && (
              <p className="py-4 text-center text-sm text-gray-500 dark:text-muted">
                Nenhum clique registrado ainda. Explore o catálogo para ver suas stats aqui!
              </p>
            )}

            {/* Botão resetar */}
            {totalClicks > 0 && (
              <button
                type="button"
                onClick={onResetStats}
                className="flex w-full items-center justify-center gap-2 rounded-lg border border-red-500/20 px-3 py-2 text-xs text-red-500 transition-colors hover:bg-red-500/10"
              >
                <Trash2 size={13} />
                Resetar estatísticas de cliques
              </button>
            )}
          </div>
        </div>
      </div>
    </>,
    document.body
  )
}
