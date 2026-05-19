export type Language = 'pt-BR' | 'en' | 'multi'

export type Category = 'filmes' | 'musica' | 'podcasts' | 'jogos' | 'documentarios'

export interface Source {
  id: string
  category: Category
  name: string
  url: string
  description: string
  bestFor: string[]
  language: Language
  searchTerms: string[]
  icon: string
  free: boolean
  legal: boolean
  lastVerified: string
}

export interface Collection {
  id: string
  name: string
  sourceIds: string[]
}

export type SortMode = 'original' | 'alphabetic' | 'most-clicked'

export type Theme = 'dark' | 'light'

export interface CategoryMeta {
  slug: Category
  label: string
  emoji: string
  icon: string
}

export interface FeaturedVideoItem {
  id: string
  title: string
  description: string
  embedUrl: string
  thumbnailUrl: string
  platform: 'youtube' | 'archive'
  category: Category
  language: Language
  duration: string
}
