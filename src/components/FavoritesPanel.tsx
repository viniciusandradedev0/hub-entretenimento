import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X, Heart, Download, Upload } from 'lucide-react'
import { Card } from './Card.tsx'

/**
 * Painel lateral (drawer) com a lista de fontes favoritadas.
 * Renderiza via portal para escapar de qualquer overflow do layout pai.
 */
export function FavoritesPanel({
  isOpen,
  onClose,
  favorites,
  allSources,
  onToggleFavorite,
  onCopyTerms,
  onExport,
  onImport,
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fechar com tecla ESC
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  if (!isOpen) return null

  const favSources = allSources.filter((s) => favorites.has(s.id))

  // Lê o arquivo JSON selecionado e repassa os IDs para o handler do App
  const handleFileChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const text = await file.text()
      const data = JSON.parse(text)
      // Aceita tanto array puro de IDs quanto objeto { favorites: [...] } ou { ids: [...] }
      const ids = Array.isArray(data) ? data : data.favorites || data.ids || []
      if (typeof onImport === 'function') onImport({ ids })
    } catch {
      alert('Arquivo inválido. Esperado JSON com lista de IDs de fontes.')
    } finally {
      e.target.value = '' // reset para permitir importar o mesmo arquivo novamente
    }
  }

  return createPortal(
    <>
      <div
        className="fixed inset-0 z-40 animate-fade-in bg-black/50"
        onClick={onClose}
        aria-hidden="true"
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Painel de favoritos"
        className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-full animate-slide-in-right flex-col border-l border-gray-200 bg-white shadow-2xl dark:border-border dark:bg-surface sm:w-[400px]"
      >
        <header className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4 dark:border-border">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-text">
            <Heart size={18} fill="currentColor" className="text-red-500" aria-hidden="true" />
            Favoritos ({favorites.size})
          </h2>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={onExport}
              disabled={favorites.size === 0}
              aria-label="Exportar favoritos"
              title="Exportar favoritos (.json)"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 dark:text-muted dark:hover:bg-background"
            >
              <Download size={15} aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              aria-label="Importar favoritos"
              title="Importar favoritos (.json)"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-primary dark:text-muted dark:hover:bg-background"
            >
              <Upload size={15} aria-hidden="true" />
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json,application/json"
              onChange={handleFileChange}
              className="hidden"
              aria-hidden="true"
            />

            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar painel de favoritos"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-muted dark:hover:bg-background dark:hover:text-text"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </div>
        </header>

        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {favSources.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-2 py-12 text-center text-gray-500 dark:text-muted">
              <Heart size={48} className="opacity-30" aria-hidden="true" />
              <strong className="text-gray-700 dark:text-text">Nenhum favorito ainda</strong>
              <p className="text-sm">Clique no coração em qualquer fonte para salvar aqui.</p>
            </div>
          ) : (
            favSources.map((source) => (
              <Card
                key={source.id}
                source={source}
                isFavorite={true}
                onToggleFavorite={onToggleFavorite}
                onCopyTerms={onCopyTerms}
              />
            ))
          )}
        </div>
      </aside>
    </>,
    document.body
  )
}
