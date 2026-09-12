import { describe, expect, it } from 'vitest'
import { selectLocale } from './locale'

describe('selectLocale', () => {
  it('prefers an explicit supported locale', () => {
    expect(selectLocale('en', ['pt-BR'])).toBe('en')
  })

  it('uses the first supported browser locale', () => {
    expect(selectLocale(null, ['fr-FR', 'pt-PT', 'en-US'])).toBe('pt-BR')
  })

  it('falls back to English for unsupported browser locales', () => {
    expect(selectLocale(null, ['fr-FR', 'de-DE'])).toBe('en')
  })
})
