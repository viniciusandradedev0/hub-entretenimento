import { useState, useEffect, useCallback } from 'react'
import { ChevronUp, ChevronDown, Play, X, Youtube, Archive, Maximize2 } from 'lucide-react'
import type { FeaturedVideoItem } from '../types.ts'

interface FeaturedVideoProps {
  video: FeaturedVideoItem | null
}

const PLATFORM_LABEL: Record<string, string> = {
  youtube: 'YouTube',
  archive: 'Internet Archive',
}

const CATEGORY_LABEL: Record<string, string> = {
  filmes: '🎬 Filmes',
  musica: '🎵 Música',
  podcasts: '🎙️ Podcasts',
  jogos: '🎮 Jogos',
  documentarios: '📚 Documentários',
}

export function FeaturedVideo({ video }: FeaturedVideoProps) {
  const [collapsed, setCollapsed] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [theaterMode, setTheaterMode] = useState(false)

  // Reseta o estado quando o vídeo muda (virada de dia)
  useEffect(() => {
    setPlaying(false)
    setTheaterMode(false)
  }, [video?.id])

  const handleTheaterClose = useCallback(() => setTheaterMode(false), [])

  // Atalho 't' para modo teatro (só quando já estiver tocando)
  useEffect(() => {
    if (!playing) return
    const handler = (e: KeyboardEvent) => {
      const tag = (document.activeElement?.tagName ?? '').toLowerCase()
      const isTyping =
        tag === 'input' ||
        tag === 'textarea' ||
        (document.activeElement as HTMLElement)?.isContentEditable
      if (isTyping) return
      if (e.key === 't' || e.key === 'T') {
        e.preventDefault()
        setTheaterMode((v) => !v)
      }
      if (e.key === 'Escape' && theaterMode) {
        handleTheaterClose()
      }
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [playing, theaterMode, handleTheaterClose])

  if (!video) return null

  const PlatformIcon = video.platform === 'youtube' ? Youtube : Archive

  const iframe = (
    <iframe
      src={video.embedUrl}
      title={video.title}
      allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
      allowFullScreen
      loading="lazy"
      className="h-full w-full rounded-lg border-0"
    />
  )

  return (
    <>
      {/* Teatro: overlay fullscreen */}
      {theaterMode && playing && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={handleTheaterClose}
        >
          <div
            className="relative aspect-video w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            {iframe}
            <button
              type="button"
              onClick={handleTheaterClose}
              aria-label="Fechar modo teatro (Esc)"
              title="Fechar (Esc)"
              className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-lg text-white/70 transition-colors hover:bg-white/10 hover:text-white"
            >
              <X size={18} />
            </button>
          </div>
        </div>
      )}

      <section
        aria-labelledby="featured-video-heading"
        className="relative overflow-hidden rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/15 via-blue-500/5 to-transparent p-4 dark:from-cyan-500/20 dark:via-blue-500/10 dark:to-transparent sm:p-5"
      >
        {/* Botão colapsar */}
        <button
          type="button"
          onClick={() => setCollapsed((c) => !c)}
          aria-label={collapsed ? 'Expandir vídeo em destaque' : 'Recolher vídeo em destaque'}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-white/40 dark:text-muted dark:hover:bg-surface/50"
        >
          {collapsed ? <ChevronDown size={16} /> : <ChevronUp size={16} />}
        </button>

        {/* Cabeçalho */}
        <div className="mb-3 flex items-center gap-2">
          <PlatformIcon size={15} className="text-cyan-500" aria-hidden="true" />
          <h2
            id="featured-video-heading"
            className="text-xs font-bold uppercase tracking-wider text-cyan-500"
          >
            Vídeo em destaque
          </h2>
          <span className="ml-1 text-[10px] text-gray-500 dark:text-muted">{video.duration}</span>
        </div>

        {!collapsed && (
          <div className="space-y-3">
            {/* Info do vídeo */}
            <div>
              <h3 className="text-base font-bold leading-snug text-gray-900 dark:text-text sm:text-lg">
                {video.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-sm text-gray-600 dark:text-muted">
                {video.description}
              </p>
            </div>

            {/* Área do player */}
            <div className="relative aspect-video w-full overflow-hidden rounded-xl bg-black/80 shadow-lg">
              {playing ? (
                <>
                  {iframe}
                  {/* Botão modo teatro */}
                  <button
                    type="button"
                    onClick={() => setTheaterMode(true)}
                    aria-label="Ativar modo teatro (t)"
                    title="Modo teatro (t)"
                    className="absolute bottom-2 right-2 z-10 flex h-7 w-7 items-center justify-center rounded bg-black/60 text-white/70 transition-colors hover:bg-black/80 hover:text-white"
                  >
                    <Maximize2 size={13} />
                  </button>
                </>
              ) : (
                /* Thumbnail com overlay de play */
                <button
                  type="button"
                  onClick={() => setPlaying(true)}
                  aria-label={`Reproduzir ${video.title}`}
                  className="group absolute inset-0 h-full w-full"
                >
                  <img
                    src={video.thumbnailUrl}
                    alt={video.title}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      ;(e.currentTarget as HTMLImageElement).style.display = 'none'
                    }}
                  />
                  {/* Overlay escuro no hover */}
                  <div className="absolute inset-0 bg-black/30 transition-colors group-hover:bg-black/20" />
                  {/* Botão play */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 shadow-xl transition-transform group-hover:scale-110 dark:bg-white">
                      <Play size={28} className="ml-1 text-gray-900" fill="currentColor" />
                    </div>
                  </div>
                </button>
              )}
            </div>

            {/* Rodapé */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-muted">
              <div className="flex items-center gap-2">
                <span className="rounded-full border border-cyan-500/20 bg-cyan-500/10 px-2 py-0.5 font-medium text-cyan-600 dark:text-cyan-400">
                  {PLATFORM_LABEL[video.platform] ?? video.platform}
                </span>
                <span className="rounded-full border border-gray-200 bg-gray-100 px-2 py-0.5 dark:border-border dark:bg-background">
                  {CATEGORY_LABEL[video.category] ?? video.category}
                </span>
              </div>
              <a
                href={`#${video.category}`}
                className="transition-colors hover:text-cyan-500"
                aria-label={`Ver mais conteúdo de ${CATEGORY_LABEL[video.category]}`}
              >
                Ver mais →
              </a>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
