/**
 * Envolve as ocorrências de `term` em `text` com um <mark> estilizado.
 * Retorna o texto original como string se `term` for vazio.
 */
export function highlight(text, term) {
  if (!term || !text) return text

  const escaped = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  const parts = text.split(regex)

  if (parts.length === 1) return text

  return parts.map((part, i) =>
    new RegExp(`^${escaped}$`, 'i').test(part) ? (
      <mark
        key={i}
        className="bg-primary/30 text-primary dark:text-white rounded px-0.5 not-italic font-medium"
      >
        {part}
      </mark>
    ) : (
      part
    )
  )
}
