import type { Source } from '../types.ts'

export function dayHash(date = new Date()): number {
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

export function getDailyPick(sources: Source[], date = new Date()): Source | null {
  const eligible = sources.filter((s) => s.free && s.legal)
  if (!eligible.length) return null
  return eligible[dayHash(date) % eligible.length]
}
