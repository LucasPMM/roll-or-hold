import { type Locale, useI18n } from '@/lib/i18n'
import { type Theme, useThemePreference } from '@/lib/theme'
import { type PreferenceOption, PreferenceSelect } from './components'

export const AppHeader = () => {
  const { locale, setLocale, t } = useI18n()
  const { theme, setTheme } = useThemePreference()

  const localeOptions: readonly PreferenceOption<Locale>[] = [
    { label: t('preferences.languageEnglish'), value: 'en' },
    { label: t('preferences.languagePortuguese'), value: 'pt-BR' },
  ]
  const themeOptions: readonly PreferenceOption<Theme>[] = [
    { label: t('preferences.themeLight'), value: 'light' },
    { label: t('preferences.themeDark'), value: 'dark' },
  ]

  return (
    <header class="border-b border-border bg-canvas">
      <div class="mx-auto flex max-w-page flex-col gap-5 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div class="flex items-center gap-3">
          <img
            alt=""
            aria-hidden="true"
            class="size-12 rounded-2xl shadow-subtle"
            height="48"
            src={`${import.meta.env.BASE_URL}favicon.svg`}
            width="48"
          />
          <div>
            <p class="font-display text-xl font-bold leading-tight">{t('brand.name')}</p>
            <p class="text-sm font-medium text-muted-foreground">{t('brand.tagline')}</p>
          </div>
        </div>

        <div class="grid w-full grid-cols-2 gap-2 rounded-card border border-border bg-surface-muted p-2 sm:w-auto sm:min-w-80">
          <PreferenceSelect
            icon="language"
            label={t('preferences.language')}
            onChange={setLocale}
            options={localeOptions}
            value={locale}
          />
          <PreferenceSelect
            icon="theme"
            label={t('preferences.theme')}
            onChange={setTheme}
            options={themeOptions}
            value={theme}
          />
        </div>
      </div>
    </header>
  )
}
