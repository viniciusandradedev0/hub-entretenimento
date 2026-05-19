import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import type { Source } from '../types.ts'
import { Card } from './Card.tsx'

const mockSource: Source = {
  id: 'pluto-tv',
  category: 'filmes',
  name: 'Pluto TV',
  url: 'https://pluto.tv',
  description: 'Filmes e séries gratuitos com anúncios.',
  bestFor: ['Filmes', 'Séries'],
  language: 'pt-BR',
  searchTerms: ['pluto filmes', 'pluto séries'],
  icon: 'Film',
  free: true,
  legal: true,
  lastVerified: '2026-05-18',
}

describe('Card', () => {
  it('renderiza o nome da fonte', () => {
    render(
      <Card
        source={mockSource}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onCopyTerms={() => {}}
      />
    )
    expect(screen.getByText('Pluto TV')).toBeInTheDocument()
  })

  it('renderiza a descrição', () => {
    render(
      <Card
        source={mockSource}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onCopyTerms={() => {}}
      />
    )
    expect(screen.getByText(/filmes e séries gratuitos/i)).toBeInTheDocument()
  })

  it('chama onToggleFavorite ao clicar no coração', async () => {
    const handleToggle = vi.fn()
    render(
      <Card
        source={mockSource}
        isFavorite={false}
        onToggleFavorite={handleToggle}
        onCopyTerms={() => {}}
      />
    )
    await userEvent.click(screen.getByRole('button', { name: /favoritar/i }))
    expect(handleToggle).toHaveBeenCalledWith('pluto-tv')
  })

  it('mostra destaque ring quando isShared=true', () => {
    const { container } = render(
      <Card
        source={mockSource}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onCopyTerms={() => {}}
        isShared
      />
    )
    const article = container.querySelector('article')
    expect(article?.className).toContain('ring-2')
  })

  it('não mostra ring quando isShared=false', () => {
    const { container } = render(
      <Card
        source={mockSource}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onCopyTerms={() => {}}
      />
    )
    const article = container.querySelector('article')
    expect(article?.className).not.toContain('ring-2')
  })

  it('mostra badge PT-BR', () => {
    render(
      <Card
        source={mockSource}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onCopyTerms={() => {}}
      />
    )
    expect(screen.getByText('PT-BR')).toBeInTheDocument()
  })

  it('exibe até 2 termos de busca na lista', () => {
    render(
      <Card
        source={mockSource}
        isFavorite={false}
        onToggleFavorite={() => {}}
        onCopyTerms={() => {}}
      />
    )
    expect(screen.getByText(/pluto filmes/i)).toBeInTheDocument()
  })
})
