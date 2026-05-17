import {
  Film, Music, Mic, Headphones, BookOpen, Gamepad2, GraduationCap,
  Youtube, Archive, Search,
} from 'lucide-react'

/**
 * Mapa de nomes (string vinda do sources.json) para componentes Lucide.
 * Para adicionar um novo ícone, importe-o acima e adicione-o aqui.
 */
export const ICONS = {
  Film,
  Music,
  Mic,
  Headphones,
  BookOpen,
  Gamepad2,
  GraduationCap,
  Youtube,
  Archive,
  Search,
}

/** Resolve uma string como "Film" para o componente. Fallback: Film. */
export function resolveIcon(name) {
  return ICONS[name] || Film
}
