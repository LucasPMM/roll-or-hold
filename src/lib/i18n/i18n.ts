import { createInstance } from 'i18next'
import { reportRecoverableError } from '@/lib/errors'
import { englishCatalog, portugueseCatalog } from './catalog'
import { detectLocale, fallbackLocale, supportedLocales } from './locale'

export const i18n = createInstance()

const initialization = i18n.init({
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

void initialization.catch((error: unknown) => {
  reportRecoverableError('Unable to initialize translations.', error)
})
