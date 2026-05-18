import clsx from 'clsx'
import { useActiveSection } from '../hooks/useActiveSection.js'
import { CATEGORIES } from '../lib/categories.js'

const SLUGS = CATEGORIES.map((c) => c.slug)

export function NavBar() {
  const activeSlug = useActiveSection(SLUGS)

  return (
    <nav
      aria-label="Navegação por categoria"
      className="sticky top-16 z-20 bg-white/95 dark:bg-background/95 backdrop-blur border-b border-gray-200 dark:border-border"
    >
      <div className="container-x overflow-x-auto scrollbar-none">
        <ul className="flex items-center gap-1 h-10" role="list">
          {CATEGORIES.map((cat) => {
            const isActive = activeSlug === cat.slug
            return (
              <li key={cat.slug}>
                <a
                  href={`#${cat.slug}`}
                  className={clsx(
                    'inline-flex items-center gap-1.5 px-3 h-full text-sm font-medium whitespace-nowrap transition-colors',
                    'border-b-2 -mb-px',
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-600 dark:text-muted hover:text-gray-900 dark:hover:text-text hover:border-gray-300 dark:hover:border-border'
                  )}
                >
                  <span aria-hidden="true" className="hidden sm:inline">{cat.emoji} {cat.label}</span>
                  <span aria-hidden="true" className="sm:hidden">{cat.emoji}</span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
