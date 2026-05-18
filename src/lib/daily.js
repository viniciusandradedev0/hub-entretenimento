/**
 * Retorna o índice da fonte do dia, determinístico por data local.
 * Mesmo dia → mesma fonte; muda à meia-noite.
 */
function dayHash(date = new Date()) {
  // YYYY-MM-DD da data local
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  const key = `${y}-${m}-${d}`
  let h = 0
  for (let i = 0; i < key.length; i++) {
    h = (h * 31 + key.charCodeAt(i)) | 0
  }
  return Math.abs(h)
}

/**
 * Retorna a fonte do dia, dada uma lista de fontes.
 * Filtra apenas fontes free && legal antes de selecionar.
 */
export function getDailyPick(sources, date = new Date()) {
  const eligible = sources.filter((s) => s.free && s.legal)
  if (!eligible.length) return null
  return eligible[dayHash(date) % eligible.length]
}
