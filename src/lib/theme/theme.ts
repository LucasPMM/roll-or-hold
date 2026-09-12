import { useEffect, useState } from 'preact/hooks'

export const themeStorageKey = 'roll-or-hold.theme'
export const themePreferences = ['system', 'light', 'dark'] as const

export type ThemePreference = (typeof themePreferences)[number]
type ResolvedTheme = Exclude<ThemePreference, 'system'>

const isThemePreference = (value: string | null): value is ThemePreference =>
  value !== null && themePreferences.some((preference) => preference === value)

const getStoredTheme = (): ThemePreference => {
  if (typeof window === 'undefined') return 'system'

  try {
    const storedTheme = window.localStorage.getItem(themeStorageKey)
    return isThemePreference(storedTheme) ? storedTheme : 'system'
  } catch {
    return 'system'
  }
}

const getSystemTheme = (): ResolvedTheme =>
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light'

const applyTheme = (preference: ThemePreference) => {
  const resolvedTheme = preference === 'system' ? getSystemTheme() : preference
  document.documentElement.dataset.theme = resolvedTheme
  document
    .querySelector<HTMLMetaElement>('meta[name="theme-color"]')
    ?.setAttribute('content', resolvedTheme === 'dark' ? '#151617' : '#ffffff')
}

export const useThemePreference = () => {
  const [theme, setTheme] = useState<ThemePreference>(getStoredTheme)

  useEffect(() => {
    applyTheme(theme)

    try {
      window.localStorage.setItem(themeStorageKey, theme)
    } catch {
      // The selected theme still works when persistence is unavailable.
    }

    if (theme !== 'system' || typeof window.matchMedia !== 'function') return

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const handleSystemThemeChange = () => applyTheme('system')
    mediaQuery.addEventListener('change', handleSystemThemeChange)

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange)
  }, [theme])

  return { theme, setTheme } as const
}
