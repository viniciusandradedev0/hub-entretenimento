import clsx from 'clsx'
import { Tag } from 'lucide-react'

/**
 * Recebe a lista completa de fontes e exibe as N tags mais frequentes
 * como chips clicáveis. activeTags é um Set de tags selecionadas (filtro OR).
 *
 * Props:
 *  - sources: Source[]  // catálogo completo
 *  - activeTags: Set<string>
 *  - onToggleTag: (tag) => void
 *  - limit?: number  // quantas tags exibir (padrão 12)
 */
export function TagFilter({ sources, activeTags, onToggleTag, limit = 12 }) {
  const counts = new Map()
  for (const s of sources) {
    for (const t of s.bestFor || []) {
      counts.set(t, (counts.get(t) || 0) + 1)
    }
  }

  const sorted = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)

  if (!sorted.length) return null

  return (
    <div className="flex flex-wrap items-center gap-1.5 py-2">
      <Tag size={12} className="flex-shrink-0 text-gray-400 dark:text-muted" aria-hidden="true" />
      {sorted.map(([tag, count]) => {
        const isActive = activeTags.has(tag)
        return (
          <button
            key={tag}
            type="button"
            onClick={() => onToggleTag(tag)}
            aria-pressed={isActive}
            className={clsx(
              'rounded-full border px-2.5 py-1 text-xs transition-colors',
              isActive
                ? 'border-primary bg-primary text-white'
                : 'border-gray-200 bg-transparent text-gray-600 hover:border-primary/50 hover:text-primary dark:border-border dark:text-muted'
            )}
          >
            {tag} <span className="opacity-60">({count})</span>
          </button>
        )
      })}
    </div>
  )
}
