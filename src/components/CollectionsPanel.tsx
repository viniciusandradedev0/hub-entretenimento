import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, FolderOpen, Plus, Pencil, Trash2, Check, Share2 } from 'lucide-react'
import clsx from 'clsx'
import { Card } from './Card.tsx'

/**
 * Painel lateral (drawer) para gerenciar coleções personalizadas de fontes.
 * Renderiza via portal para escapar de qualquer overflow do layout pai.
 */
export function CollectionsPanel({
  isOpen,
  onClose,
  collections,
  allSources,
  onCreateCollection,
  onRenameCollection,
  onDeleteCollection,
  onRemoveFromCollection,
  onCopyTerms,
  onShareCollection = undefined as ((sourceIds: string[], name: string) => void) | undefined,
}) {
  const [activeId, setActiveId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [newName, setNewName] = useState('')
  const [showNewInput, setShowNewInput] = useState(false)
  const newInputRef = useRef<HTMLInputElement>(null)
  const editInputRef = useRef<HTMLInputElement>(null)

  // Fecha com Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Seleciona a primeira coleção por padrão
  useEffect(() => {
    if (collections.length > 0 && (!activeId || !collections.find((c) => c.id === activeId))) {
      setActiveId(collections[0].id)
    }
    if (collections.length === 0) setActiveId(null)
  }, [collections, activeId])

  // Foca input de nova coleção quando abre
  useEffect(() => {
    if (showNewInput) setTimeout(() => newInputRef.current?.focus(), 50)
  }, [showNewInput])

  if (!isOpen) return null

  const activeCollection = collections.find((c) => c.id === activeId)
  const activeSources = activeCollection
    ? allSources.filter((s) => activeCollection.sourceIds.includes(s.id))
    : []

  const handleCreate = () => {
    const name = newName.trim()
    if (!name) return
    onCreateCollection(name)
    setNewName('')
    setShowNewInput(false)
  }

  const handleRename = (id) => {
    onRenameCollection(id, editingName)
    setEditingId(null)
  }

  const handleStartEdit = (col) => {
    setEditingId(col.id)
    setEditingName(col.name)
    setTimeout(() => editInputRef.current?.focus(), 50)
  }

  return createPortal(
    <>
      <div className="fixed inset-0 z-40 bg-black/50" onClick={onClose} aria-hidden="true" />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Painel de coleções"
        className="fixed bottom-0 right-0 top-0 z-50 flex w-full max-w-full flex-col border-l border-gray-200 bg-white shadow-2xl dark:border-border dark:bg-surface sm:w-[440px]"
      >
        {/* Header */}
        <header className="flex flex-shrink-0 items-center justify-between border-b border-gray-200 p-4 dark:border-border">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-text">
            <FolderOpen size={18} className="text-primary" aria-hidden="true" />
            Coleções ({collections.length})
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar painel de coleções"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-muted dark:hover:bg-background dark:hover:text-text"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {/* Tabs de coleções */}
        <div className="scrollbar-none flex flex-shrink-0 items-center gap-1.5 overflow-x-auto border-b border-gray-200 px-4 py-2 dark:border-border">
          {collections.map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => setActiveId(col.id)}
              className={clsx(
                'flex-shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-xs font-medium transition-colors',
                activeId === col.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-primary/10 hover:text-primary dark:bg-background dark:text-muted'
              )}
            >
              {col.name}
              <span className="ml-1 opacity-60">({col.sourceIds.length})</span>
            </button>
          ))}

          {showNewInput ? (
            <div className="flex flex-shrink-0 items-center gap-1">
              <input
                ref={newInputRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate()
                  if (e.key === 'Escape') {
                    setShowNewInput(false)
                    setNewName('')
                  }
                }}
                placeholder="Nome da coleção"
                className="h-7 w-36 rounded-full border border-primary bg-transparent px-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-text dark:placeholder-muted"
              />
              <button
                type="button"
                onClick={handleCreate}
                className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-primary/90"
              >
                <Check size={12} aria-hidden="true" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowNewInput(true)}
              aria-label="Nova coleção"
              title="Nova coleção"
              className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full border border-dashed border-gray-300 text-gray-500 transition-colors hover:border-primary hover:text-primary dark:border-border dark:text-muted"
            >
              <Plus size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-4">
          {collections.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-3 py-12 text-center text-gray-500 dark:text-muted">
              <FolderOpen size={48} className="opacity-30" aria-hidden="true" />
              <strong className="text-gray-700 dark:text-text">Nenhuma coleção ainda</strong>
              <p className="text-sm">Clique em &ldquo;+&rdquo; para criar sua primeira coleção.</p>
            </div>
          ) : activeCollection ? (
            <div className="space-y-4">
              {/* Nome da coleção + ações */}
              <div className="flex items-center gap-2">
                {editingId === activeCollection.id ? (
                  <div className="flex flex-1 items-center gap-1">
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(activeCollection.id)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      className="h-8 flex-1 rounded-lg border border-primary bg-transparent px-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-primary/20 dark:text-text"
                    />
                    <button
                      type="button"
                      onClick={() => handleRename(activeCollection.id)}
                      className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-white transition-colors hover:bg-primary/90"
                    >
                      <Check size={14} aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="flex-1 truncate text-sm font-semibold text-gray-900 dark:text-text">
                      {activeCollection.name}
                    </h3>
                    {onShareCollection && (
                      <button
                        type="button"
                        onClick={() =>
                          onShareCollection(activeCollection.sourceIds, activeCollection.name)
                        }
                        aria-label="Compartilhar coleção via link"
                        title="Compartilhar coleção"
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-primary/10 hover:text-primary dark:text-muted"
                      >
                        <Share2 size={13} aria-hidden="true" />
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleStartEdit(activeCollection)}
                      aria-label="Renomear coleção"
                      title="Renomear"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-primary/10 hover:text-primary dark:text-muted"
                    >
                      <Pencil size={13} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCollection(activeCollection.id)}
                      aria-label="Deletar coleção"
                      title="Deletar coleção"
                      className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-500/10 hover:text-red-500 dark:text-muted"
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>

              {activeSources.length === 0 ? (
                <p className="py-8 text-center text-sm text-gray-500 dark:text-muted">
                  Esta coleção está vazia. Adicione fontes usando o botão &ldquo;Coleção&rdquo; nos
                  cards.
                </p>
              ) : (
                activeSources.map((source) => (
                  <div key={source.id} className="relative">
                    <Card
                      source={source}
                      isFavorite={false}
                      onToggleFavorite={() => {}}
                      onCopyTerms={onCopyTerms}
                    />
                    <button
                      type="button"
                      onClick={() => onRemoveFromCollection(source.id, activeCollection.id)}
                      aria-label={`Remover ${source.name} da coleção`}
                      title="Remover da coleção"
                      className="absolute right-2 top-2 z-10 flex h-6 w-6 items-center justify-center rounded bg-red-500/10 text-red-500 transition-colors hover:bg-red-500/20"
                    >
                      <X size={12} aria-hidden="true" />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : null}
        </div>
      </aside>
    </>,
    document.body
  )
}
