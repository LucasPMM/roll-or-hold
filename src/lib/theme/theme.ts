import { useCallback, useEffect, useState } from 'preact/hooks'
import { reportRecoverableError } from '@/lib/errors'

export const themeStorageKey = 'roll-or-hold.theme'
export const themes = ['light', 'dark'] as const

export type Theme = (typeof themes)[number]

const isTheme = (value: string | null): value is Theme =>
  value !== null && themes.some((theme) => theme === value)

const getStoredTheme = (): Theme | null => {
  if (typeof window === 'undefined') {
    return null
  }

  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey)
    if (isTheme(storedTheme)) {
      return storedTheme
    }
    if (storedTheme !== null) {
      window.localStorage.removeItem(themeStorageKey)
    }
    return null
  } catch (error) {
    reportRecoverableError('Unable to read the saved theme preference.', error)
    return null
  }
}

export const getSystemTheme = (): Theme =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

const applyTheme = (theme: Theme) => {
  document.documentElement.dataset.theme = theme
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', theme === 'dark' ? '#151617' : '#ffffff')
}

export const useThemePreference = () => {
  const [initialTheme] = useState(getStoredTheme)
  const [theme, setThemeState] = useState<Theme>(initialTheme ?? getSystemTheme)
  const [followsSystem, setFollowsSystem] = useState(initialTheme === null)

  const setTheme = useCallback((selectedTheme: Theme) => {
    setThemeState(selectedTheme)
    setFollowsSystem(false)

    try {
      window.localStorage.setItem(themeStorageKey, selectedTheme)
    } catch (error) {
      reportRecoverableError('Unable to save the theme preference.', error)
    }
  }, [])

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  useEffect(() => {
    if (!followsSystem || typeof window.matchMedia !== 'function') {
      return undefined
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => setThemeState(getSystemTheme())
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [followsSystem])

  return { theme, setTheme } as const
}
