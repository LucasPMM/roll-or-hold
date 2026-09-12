import { type Locale, useI18n } from '@/lib/i18n'
import { type Theme, useThemePreference } from '@/lib/theme'
import { type PreferenceOption, PreferenceSelect } from './components'

export const AppHeader = () => {
  const { locale, setLocale, t } = useI18n()
  const { theme, setTheme } = useThemePreference()

  const localeOptions: readonly [PreferenceOption<Locale>, PreferenceOption<Locale>] = [
    { label: t('preferences.languageEnglish'), value: 'en' },
    { label: t('preferences.languagePortuguese'), value: 'pt-BR' },
  ]
  const themeOptions: readonly [PreferenceOption<Theme>, PreferenceOption<Theme>] = [
    { label: t('preferences.themeLight'), value: 'light' },
    { label: t('preferences.themeDark'), value: 'dark' },
  ]

  return (
    <header class="sticky top-0 z-40 border-b border-border bg-canvas/95 shadow-subtle backdrop-blur-md">
      <div class="mx-auto flex max-w-page flex-col gap-2 px-3 py-2.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-3 lg:px-8">
        <div class="flex items-center gap-3">
          <img
            alt=""
            aria-hidden="true"
            class="size-10 rounded-xl shadow-subtle sm:size-11 sm:rounded-2xl"
            height="44"
            src={`${import.meta.env.BASE_URL}favicon.svg?v=3`}
            width="44"
          />
          <div>
            <p class="font-display text-lg font-bold leading-tight sm:text-xl">{t('brand.name')}</p>
            <p class="hidden text-xs font-medium text-muted-foreground sm:block lg:text-sm">
              {t('brand.tagline')}
            </p>
          </div>
        </div>

        <div class="grid w-full grid-cols-2 gap-1.5 rounded-2xl border border-border bg-surface-muted p-1.5 sm:w-auto sm:min-w-80 sm:gap-2 sm:rounded-card sm:p-2">
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
