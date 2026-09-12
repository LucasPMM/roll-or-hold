import { fireEvent, render, screen, waitFor } from '@testing-library/preact'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { I18nProvider, localeStorageKey } from '@/lib/i18n'
import { themeStorageKey } from '@/lib/theme'
import { GamePage } from './GamePage'

describe('GamePage', () => {
  beforeEach(() => {
    window.localStorage.setItem(localeStorageKey, 'en')
    window.localStorage.removeItem(themeStorageKey)
    document.documentElement.dataset.theme = 'light'
  })

  it('announces the winner and disables gameplay actions', () => {
    render(
      <I18nProvider>
        <GamePage randomSource={() => 0.7} />
      </I18nProvider>,
    )

    const winningScoreInput = screen.getByRole('spinbutton', { name: 'Winning score' })
    fireEvent.input(winningScoreInput, { target: { value: '10' } })
    fireEvent.click(screen.getByRole('button', { name: 'New game' }))

    const rollButton = screen.getByRole('button', { name: 'Roll dice' })
    const holdButton = screen.getByRole('button', { name: 'Hold points' })
    expect(holdButton).toBeEnabled()

    fireEvent.click(rollButton)
    expect(holdButton).toBeEnabled()
    for (const die of screen.getAllByRole('img', { name: 'Die showing 5' })) {
      expect(die).toHaveClass('animate-dice-roll')
    }
    expect(screen.getByRole('status')).toHaveTextContent(
      'Player 1 rolled 10 and now has 10 this turn.',
    )

    fireEvent.click(holdButton)

    expect(screen.getByRole('heading', { level: 1, name: 'Player 1 wins!' })).toBeInTheDocument()
    expect(screen.getByRole('status')).toHaveTextContent(
      'Player 1 banked 10 points and won with 10!',
    )
    expect(screen.getByRole('article', { name: 'Player 1' })).toHaveClass('animate-player-win')
    expect(rollButton).toBeDisabled()
    expect(holdButton).toBeDisabled()
  })

  it('switches the interface language', async () => {
    render(
      <I18nProvider>
        <GamePage />
      </I18nProvider>,
    )

    fireEvent.change(screen.getByRole('combobox', { name: 'Language' }), {
      target: { value: 'pt-BR' },
    })

    expect(
      await screen.findByRole('heading', { level: 1, name: 'Jogador 1, é a sua vez.' }),
    ).toBeInTheDocument()
    expect(document.documentElement.lang).toBe('pt-BR')
    expect(window.localStorage.getItem(localeStorageKey)).toBe('pt-BR')
  })

  it('reports a double six and removes the active player banked score', () => {
    const randomSource = vi
      .fn()
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.99)
      .mockReturnValueOnce(0.99)

    render(
      <I18nProvider>
        <GamePage randomSource={randomSource} />
      </I18nProvider>,
    )

    const rollButton = screen.getByRole('button', { name: 'Roll dice' })
    const holdButton = screen.getByRole('button', { name: 'Hold points' })

    fireEvent.click(rollButton)
    fireEvent.click(holdButton)
    fireEvent.click(rollButton)
    fireEvent.click(holdButton)
    fireEvent.click(rollButton)

    expect(screen.getByRole('status')).toHaveTextContent(
      'Player 1 rolled two 6s and lost 8 banked points plus 0 turn points.',
    )
    expect(screen.getByRole('article', { name: 'Player 1' })).toHaveClass('animate-player-loss')
    expect(
      screen.getByRole('heading', { level: 1, name: 'Player 2, your move.' }),
    ).toBeInTheDocument()
  })

  it('applies and persists a theme preference', async () => {
    render(
      <I18nProvider>
        <GamePage />
      </I18nProvider>,
    )

    expect(screen.queryByRole('option', { name: 'System' })).not.toBeInTheDocument()
    fireEvent.change(screen.getByRole('combobox', { name: 'Theme' }), {
      target: { value: 'dark' },
    })

    await waitFor(() => expect(document.documentElement.dataset.theme).toBe('dark'))
    expect(window.localStorage.getItem(themeStorageKey)).toBe('dark')
  })
})
