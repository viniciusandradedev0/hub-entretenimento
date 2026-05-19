import {
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
  Library,
  Code,
  Theater,
  Landmark,
  Tv,
  type LucideIcon,
} from 'lucide-react'

export const ICONS: Record<string, LucideIcon> = {
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
  Library,
  Code,
  Theater,
  Landmark,
  Tv,
}

export function resolveIcon(name: string): LucideIcon {
  return ICONS[name] ?? Film
}
