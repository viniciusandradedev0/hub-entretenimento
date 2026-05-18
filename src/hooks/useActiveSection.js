import { useState, useEffect } from 'react'

/**
 * Retorna o slug da seção de categoria atualmente visível no viewport.
 * Usa IntersectionObserver com rootMargin para detecção precisa.
 * @param {string[]} slugs - array de IDs das seções, na ordem do DOM
 */
export function useActiveSection(slugs) {
  const [activeSlug, setActiveSlug] = useState(slugs[0] ?? '')

  useEffect(() => {
    if (!slugs.length) return

    const intersecting = new Set()

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            intersecting.add(entry.target.id)
          } else {
            intersecting.delete(entry.target.id)
          }
        }
        // Mantém a ordem original dos slugs para escolher o primeiro visível
        const first = slugs.find((s) => intersecting.has(s))
        if (first) setActiveSlug(first)
      },
      {
        rootMargin: '-10% 0px -75% 0px',
        threshold: 0,
      }
    )

    for (const slug of slugs) {
      const el = document.getElementById(slug)
      if (el) observer.observe(el)
    }

    return () => observer.disconnect()
  }, [slugs])

  return activeSlug
}
