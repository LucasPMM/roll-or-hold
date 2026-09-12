import { render, screen } from '@testing-library/preact'
import { beforeEach, describe, expect, it } from 'vitest'
import { localeStorageKey } from '@/lib/i18n'
import { themeStorageKey } from '@/lib/theme'
import { App } from './App'

describe('App', () => {
  beforeEach(() => {
    window.localStorage.setItem(localeStorageKey, 'en')
    window.localStorage.removeItem(themeStorageKey)
  })

  it('renders the application main landmark', () => {
    render(<App />)

    expect(screen.getByRole('main')).toBeInTheDocument()
    expect(
      screen.getByRole('heading', { level: 1, name: 'Player 1, your move.' }),
    ).toBeInTheDocument()
  })
})
