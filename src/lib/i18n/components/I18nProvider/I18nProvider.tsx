import { type ComponentChildren, createContext } from 'preact'
import { useCallback, useContext, useEffect, useMemo, useState } from 'preact/hooks'
import { reportRecoverableError } from '@/lib/errors'
import type { TranslationKey } from '@/lib/i18n/catalog'
import { i18n } from '@/lib/i18n/i18n'
import { detectLocale, type Locale, localeStorageKey, resolveLocale } from '@/lib/i18n/locale'

type InterpolationValues = Record<string, number | string>

type I18nContextValue = Readonly<{
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey, values?: InterpolationValues) => string
}>

const I18nContext = createContext<I18nContextValue | null>(null)

const updateMetaContent = (selector: string, content: string) => {
  document.querySelector<HTMLMetaElement>(selector)?.setAttribute('content', content)
}

type I18nProviderProps = Readonly<{
  children: ComponentChildren
}>

export const I18nProvider = ({ children }: I18nProviderProps) => {
  const [locale, setLocale] = useState<Locale>(detectLocale)

  if (resolveLocale(i18n.language) !== locale) {
    const languageChange = i18n.changeLanguage(locale)
    void languageChange.catch((error: unknown) => {
      reportRecoverableError('Unable to synchronize the detected language.', error)
    })
  }

  const changeLocale = useCallback((selectedLocale: Locale) => {
    const languageChange = i18n.changeLanguage(selectedLocale)
    setLocale(selectedLocale)

    void languageChange.catch((error: unknown) => {
      reportRecoverableError('Unable to change the interface language.', error)
    })

    try {
      window.localStorage.setItem(localeStorageKey, selectedLocale)
    } catch (error) {
      reportRecoverableError('Unable to save the language preference.', error)
    }
  }, [])

  const value = useMemo<I18nContextValue>(
    () => ({
      locale,
      setLocale: changeLocale,
      t: (key, values) => String(i18n.t(key, values)),
    }),
    [changeLocale, locale],
  )

  useEffect(() => {
    const title = value.t('metadata.title')
    const description = value.t('metadata.description')

    document.documentElement.lang = locale
    document.title = title
    updateMetaContent('meta[name="description"]', description)
    updateMetaContent('meta[property="og:locale"]', locale === 'pt-BR' ? 'pt_BR' : 'en_US')
    updateMetaContent('meta[property="og:title"]', title)
    updateMetaContent('meta[property="og:description"]', description)
    updateMetaContent('meta[name="twitter:title"]', title)
    updateMetaContent('meta[name="twitter:description"]', description)
  }, [locale, value])

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export const useI18n = (): I18nContextValue => {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used inside I18nProvider.')
  }
  return context
}
