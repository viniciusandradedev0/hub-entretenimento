import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SearchBar } from './SearchBar.tsx'

describe('SearchBar', () => {
  it('renderiza o input com aria-label correto', () => {
    render(<SearchBar value="" onChange={() => {}} inputRef={null} />)
    expect(screen.getByRole('searchbox')).toBeInTheDocument()
  })

  it('exibe kbd hint "/" quando value está vazio', () => {
    render(<SearchBar value="" onChange={() => {}} inputRef={null} />)
    expect(screen.getByText('/')).toBeInTheDocument()
  })

  it('exibe botão limpar quando value não está vazio', () => {
    render(<SearchBar value="teste" onChange={() => {}} inputRef={null} />)
    expect(screen.getByRole('button', { name: /limpar/i })).toBeInTheDocument()
  })

  it('chama onChange ao digitar', async () => {
    const handleChange = vi.fn()
    render(<SearchBar value="" onChange={handleChange} inputRef={null} />)
    await userEvent.type(screen.getByRole('searchbox'), 'abc')
    expect(handleChange).toHaveBeenCalled()
  })

  it('chama onChange com string vazia ao clicar em limpar', async () => {
    const handleChange = vi.fn()
    render(<SearchBar value="teste" onChange={handleChange} inputRef={null} />)
    await userEvent.click(screen.getByRole('button', { name: /limpar/i }))
    expect(handleChange).toHaveBeenCalledWith('')
  })
})
