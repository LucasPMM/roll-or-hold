import type { JSX } from 'preact'
import { type Locale, useI18n } from '@/lib/i18n'
import { type ThemePreference, useThemePreference } from '@/lib/theme'

export const AppHeader = () => {
  const { locale, setLocale, t } = useI18n()
  const { theme, setTheme } = useThemePreference()

  const handleLocaleChange = (event: JSX.TargetedEvent<HTMLSelectElement>) => {
    setLocale(event.currentTarget.value as Locale)
  }

  const handleThemeChange = (event: JSX.TargetedEvent<HTMLSelectElement>) => {
    setTheme(event.currentTarget.value as ThemePreference)
  }

  const selectClassName =
    'min-h-11 rounded-pill border border-border bg-surface px-4 text-sm font-semibold text-foreground shadow-subtle'

  return (
    <header class="border-b border-border bg-canvas">
      <div class="mx-auto flex max-w-page flex-col gap-4 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div>
          <p class="font-display text-xl font-bold leading-tight">{t('brand.name')}</p>
          <p class="text-sm font-medium text-muted-foreground">{t('brand.tagline')}</p>
        </div>

        <div class="flex flex-wrap gap-3">
          <label class="grid gap-1 text-xs font-semibold text-muted-foreground">
            <span>{t('preferences.language')}</span>
            <select
              aria-label={t('preferences.language')}
              class={selectClassName}
              onChange={handleLocaleChange}
              value={locale}
            >
              <option value="en">{t('preferences.languageEnglish')}</option>
              <option value="pt-BR">{t('preferences.languagePortuguese')}</option>
            </select>
          </label>

          <label class="grid gap-1 text-xs font-semibold text-muted-foreground">
            <span>{t('preferences.theme')}</span>
            <select
              aria-label={t('preferences.theme')}
              class={selectClassName}
              onChange={handleThemeChange}
              value={theme}
            >
              <option value="system">{t('preferences.themeSystem')}</option>
              <option value="light">{t('preferences.themeLight')}</option>
              <option value="dark">{t('preferences.themeDark')}</option>
            </select>
          </label>
        </div>
      </div>
    </header>
  )
}
