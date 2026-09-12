import '@fontsource/sora/latin-500.css'
import '@fontsource/sora/latin-600.css'
import '@fontsource/sora/latin-700.css'
import { render } from 'preact'
import { App } from './App'
import './styles/index.css'

const appRoot = document.getElementById('app')
if (!appRoot) {
  throw new Error('Application root was not found.')
}

render(<App />, appRoot)
