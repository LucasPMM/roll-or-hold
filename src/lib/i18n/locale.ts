export const supportedLocales = ['en', 'pt-BR'] as const

export type Locale = (typeof supportedLocales)[number]

export const fallbackLocale: Locale = 'en'
export const localeStorageKey = 'roll-or-hold.locale'

export const resolveLocale = (candidate: string | null | undefined): Locale | null => {
  if (!candidate) return null

  const normalizedLocale = candidate.toLowerCase()
  if (normalizedLocale === 'pt' || normalizedLocale.startsWith('pt-')) return 'pt-BR'
  if (normalizedLocale === 'en' || normalizedLocale.startsWith('en-')) return 'en'

  return null
}

export const detectLocale = (): Locale => {
  if (typeof window === 'undefined') return fallbackLocale

  try {
    const storedLocale = resolveLocale(window.localStorage.getItem(localeStorageKey))
    if (storedLocale) return storedLocale
  } catch {
    // Storage can be unavailable for privacy or security reasons.
  }

  for (const browserLocale of window.navigator.languages) {
    const locale = resolveLocale(browserLocale)
    if (locale) return locale
  }

  return resolveLocale(window.navigator.language) ?? fallbackLocale
}
