import { GamePage } from '@/components'
import { I18nProvider } from '@/lib/i18n'

export const App = () => (
  <I18nProvider>
    <GamePage />
  </I18nProvider>
)
