import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X, FolderOpen, Plus, Pencil, Trash2, Check } from 'lucide-react'
import clsx from 'clsx'
import { Card } from './Card.jsx'

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
}) {
  const [activeId, setActiveId] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [newName, setNewName] = useState('')
  const [showNewInput, setShowNewInput] = useState(false)
  const newInputRef = useRef(null)
  const editInputRef = useRef(null)

  // Fecha com Escape
  useEffect(() => {
    if (!isOpen) return
    const handler = (e) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  // Seleciona a primeira coleção por padrão
  useEffect(() => {
    if (collections.length > 0 && (!activeId || !collections.find(c => c.id === activeId))) {
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
        className="fixed top-0 right-0 bottom-0 z-50 w-full sm:w-[440px] max-w-full bg-white dark:bg-surface border-l border-gray-200 dark:border-border shadow-2xl flex flex-col"
      >
        {/* Header */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-border flex-shrink-0">
          <h2 className="flex items-center gap-2 text-base font-bold text-gray-900 dark:text-text">
            <FolderOpen size={18} className="text-primary" aria-hidden="true" />
            Coleções ({collections.length})
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar painel de coleções"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 dark:text-muted hover:bg-gray-100 dark:hover:bg-background hover:text-gray-900 dark:hover:text-text transition-colors"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </header>

        {/* Tabs de coleções */}
        <div className="flex-shrink-0 flex items-center gap-1.5 px-4 py-2 border-b border-gray-200 dark:border-border overflow-x-auto scrollbar-none">
          {collections.map((col) => (
            <button
              key={col.id}
              type="button"
              onClick={() => setActiveId(col.id)}
              className={clsx(
                'flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors whitespace-nowrap',
                activeId === col.id
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-background text-gray-700 dark:text-muted hover:bg-primary/10 hover:text-primary'
              )}
            >
              {col.name}
              <span className="ml-1 opacity-60">({col.sourceIds.length})</span>
            </button>
          ))}

          {showNewInput ? (
            <div className="flex items-center gap-1 flex-shrink-0">
              <input
                ref={newInputRef}
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreate()
                  if (e.key === 'Escape') { setShowNewInput(false); setNewName('') }
                }}
                placeholder="Nome da coleção"
                className="w-36 h-7 px-2 text-xs rounded-full border border-primary bg-transparent text-gray-900 dark:text-text placeholder-gray-400 dark:placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
              <button
                type="button"
                onClick={handleCreate}
                className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
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
              className="flex-shrink-0 w-7 h-7 rounded-full border border-dashed border-gray-300 dark:border-border text-gray-500 dark:text-muted hover:border-primary hover:text-primary flex items-center justify-center transition-colors"
            >
              <Plus size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 overflow-y-auto p-4">
          {collections.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-500 dark:text-muted gap-3 py-12">
              <FolderOpen size={48} className="opacity-30" aria-hidden="true" />
              <strong className="text-gray-700 dark:text-text">Nenhuma coleção ainda</strong>
              <p className="text-sm">Clique em "+" para criar sua primeira coleção.</p>
            </div>
          ) : activeCollection ? (
            <div className="space-y-4">
              {/* Nome da coleção + ações */}
              <div className="flex items-center gap-2">
                {editingId === activeCollection.id ? (
                  <div className="flex items-center gap-1 flex-1">
                    <input
                      ref={editInputRef}
                      type="text"
                      value={editingName}
                      onChange={(e) => setEditingName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleRename(activeCollection.id)
                        if (e.key === 'Escape') setEditingId(null)
                      }}
                      className="flex-1 h-8 px-2 text-sm rounded-lg border border-primary bg-transparent text-gray-900 dark:text-text focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={() => handleRename(activeCollection.id)}
                      className="w-8 h-8 rounded-lg bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
                    >
                      <Check size={14} aria-hidden="true" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="flex-1 text-sm font-semibold text-gray-900 dark:text-text truncate">
                      {activeCollection.name}
                    </h3>
                    <button
                      type="button"
                      onClick={() => handleStartEdit(activeCollection)}
                      aria-label="Renomear coleção"
                      title="Renomear"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 dark:text-muted hover:text-primary hover:bg-primary/10 transition-colors"
                    >
                      <Pencil size={13} aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDeleteCollection(activeCollection.id)}
                      aria-label="Deletar coleção"
                      title="Deletar coleção"
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-400 dark:text-muted hover:text-red-500 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 size={13} aria-hidden="true" />
                    </button>
                  </>
                )}
              </div>

              {activeSources.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-muted text-center py-8">
                  Esta coleção está vazia. Adicione fontes usando o botão "Coleção" nos cards.
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
                      className="absolute top-2 right-2 w-6 h-6 rounded flex items-center justify-center bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors z-10"
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
