/**
 * Utilitários para compartilhamento de coleções via URL (?share=<base64>).
 * Usa TextEncoder/TextDecoder para suporte correto a Unicode (nomes em PT-BR).
 */

export function encodeShare(sourceIds: string[], name = ''): string {
  const payload = JSON.stringify({ ids: sourceIds, name })
  const bytes = new TextEncoder().encode(payload)
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('')
  return btoa(binary)
}

export function decodeShare(encoded: string): { ids: string[]; name: string } | null {
  try {
    const binary = atob(encoded)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    const payload = JSON.parse(new TextDecoder().decode(bytes))
    if (!Array.isArray(payload.ids)) return null
    return { ids: payload.ids as string[], name: (payload.name as string) || '' }
  } catch {
    return null
  }
}

export function buildShareUrl(sourceIds: string[], name = ''): string {
  const encoded = encodeShare(sourceIds, name)
  const url = new URL(window.location.href)
  url.search = ''
  url.searchParams.set('share', encoded)
  return url.toString()
}
