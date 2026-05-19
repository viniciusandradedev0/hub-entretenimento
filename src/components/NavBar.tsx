import clsx from 'clsx'
import { useActiveSection } from '../hooks/useActiveSection.ts'
import { CATEGORIES } from '../lib/categories.ts'

const SLUGS = CATEGORIES.map((c) => c.slug)

export function NavBar() {
  const activeSlug = useActiveSection(SLUGS)

  return (
    <nav
      aria-label="Navegação por categoria"
      className="sticky top-16 z-20 border-b border-gray-200 bg-white/95 backdrop-blur dark:border-border dark:bg-background/95"
    >
      <div className="container-x scrollbar-none overflow-x-auto">
        <ul className="flex h-10 items-center gap-1" role="list">
          {CATEGORIES.map((cat) => {
            const isActive = activeSlug === cat.slug
            return (
              <li key={cat.slug}>
                <a
                  href={`#${cat.slug}`}
                  className={clsx(
                    'inline-flex h-full items-center gap-1.5 whitespace-nowrap px-3 text-sm font-medium transition-colors',
                    '-mb-px border-b-2',
                    isActive
                      ? 'border-primary text-primary'
                      : 'border-transparent text-gray-600 hover:border-gray-300 hover:text-gray-900 dark:text-muted dark:hover:border-border dark:hover:text-text'
                  )}
                >
                  <span aria-hidden="true" className="hidden sm:inline">
                    {cat.emoji} {cat.label}
                  </span>
                  <span aria-hidden="true" className="sm:hidden">
                    {cat.emoji}
                  </span>
                </a>
              </li>
            )
          })}
        </ul>
      </div>
    </nav>
  )
}
