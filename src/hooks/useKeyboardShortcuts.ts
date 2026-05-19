import { useEffect } from 'react'

/**
 * Registra atalhos globais de teclado para o hub.
 * @param {Object} params
 * @param {React.RefObject} params.searchInputRef - ref do <input> de busca
 * @param {string} params.searchQuery - valor atual da busca
 * @param {Function} params.onClearSearch - limpa a busca
 * @param {Function} params.onToggleFavorites - abre/fecha favoritos
 */
export function useKeyboardShortcuts({
  searchInputRef,
  searchQuery,
  onClearSearch,
  onToggleFavorites,
}) {
  useEffect(() => {
    function handleKeyDown(e) {
      const tag = document.activeElement?.tagName?.toLowerCase()
      const isTyping =
        tag === 'input' ||
        tag === 'textarea' ||
        tag === 'select' ||
        (document.activeElement as HTMLElement)?.isContentEditable

      if (e.key === '/' && !isTyping) {
        e.preventDefault()
        searchInputRef.current?.focus()
        return
      }

      if (e.key === 'Escape' && searchQuery) {
        e.preventDefault()
        onClearSearch()
        return
      }

      if ((e.key === 'f' || e.key === 'F') && !isTyping) {
        e.preventDefault()
        onToggleFavorites()
        return
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [searchInputRef, searchQuery, onClearSearch, onToggleFavorites])
}
