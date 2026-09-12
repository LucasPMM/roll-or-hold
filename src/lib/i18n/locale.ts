import { reportRecoverableError } from '@/lib/errors'

export const supportedLocales = ['en', 'pt-BR'] as const

export type Locale = (typeof supportedLocales)[number]

export const fallbackLocale: Locale = 'en'
export const localeStorageKey = 'roll-or-hold.locale'

export const resolveLocale = (candidate: string | null | undefined): Locale | null => {
  if (!candidate) {
    return null
  }

  const normalizedLocale = candidate.toLowerCase()
  if (normalizedLocale === 'pt' || normalizedLocale.startsWith('pt-')) {
    return 'pt-BR'
  }
  if (normalizedLocale === 'en' || normalizedLocale.startsWith('en-')) {
    return 'en'
  }

  return null
}

export const selectLocale = (
  storedLocale: string | null,
  browserLocales: readonly string[],
): Locale => {
  const resolvedStoredLocale = resolveLocale(storedLocale)
  if (resolvedStoredLocale) {
    return resolvedStoredLocale
  }

  for (const browserLocale of browserLocales) {
    const resolvedBrowserLocale = resolveLocale(browserLocale)
    if (resolvedBrowserLocale) {
      return resolvedBrowserLocale
    }
  }

  return fallbackLocale
}

const getStoredLocale = (): string | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    return window.localStorage.getItem(localeStorageKey)
  } catch (error) {
    reportRecoverableError('Unable to read the saved language preference.', error)
    return null
  }
}

export const detectLocale = (): Locale => {
  if (typeof window === 'undefined') {
    return fallbackLocale
  }

  const storedLocale = getStoredLocale()
  const browserLocales = [...window.navigator.languages, window.navigator.language]
  return selectLocale(storedLocale, browserLocales)
}
