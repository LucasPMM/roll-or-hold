import { createInstance } from 'i18next'
import { englishCatalog, portugueseCatalog } from './catalog'
import { detectLocale, fallbackLocale, supportedLocales } from './locale'

export const i18n = createInstance()

void i18n.init({
  lng: detectLocale(),
  fallbackLng: fallbackLocale,
  supportedLngs: supportedLocales,
  load: 'currentOnly',
  initAsync: false,
  showSupportNotice: false,
  keySeparator: false,
  interpolation: {
    escapeValue: false,
  },
  resources: {
    en: { translation: englishCatalog },
    'pt-BR': { translation: portugueseCatalog },
  },
})
