import type { ReactNode } from 'react'

export function highlight(text: string, term: string): ReactNode {
  if (!term || !text) return text

  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)

  if (parts.length === 1) return text

  return parts.map((part, i) =>
    new RegExp(`^${escaped}$`, 'i').test(part) ? (
      <mark
        key={i}
        className="rounded bg-primary/30 px-0.5 font-medium not-italic text-primary dark:text-white"
      >
        {part}
      </mark>
    ) : (
      part
    )
  )
}
