import { existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const distributionDirectory = join(process.cwd(), 'dist')
const indexHtml = readFileSync(join(distributionDirectory, 'index.html'), 'utf8')

const requiredFragments = [
  'id="app"',
  'Roll or Hold',
  '/roll-or-hold/favicon.ico?v=3',
  '/roll-or-hold/favicon.svg',
  '/roll-or-hold/site.webmanifest',
  '/roll-or-hold/assets/',
]
const missingFragments = requiredFragments.filter((fragment) => !indexHtml.includes(fragment))
const requiredFiles = ['favicon.ico', 'favicon.svg', 'site.webmanifest']
const missingFiles = requiredFiles.filter(
  (fileName) => !existsSync(join(distributionDirectory, fileName)),
)

if (missingFragments.length > 0) {
  throw new Error(`The static build is missing: ${missingFragments.join(', ')}`)
}

if (missingFiles.length > 0) {
  throw new Error(`The static build is missing files: ${missingFiles.join(', ')}`)
}

if (indexHtml.includes('images/back.jpg') || indexHtml.includes('images/dice-')) {
  throw new Error('The static build contains a legacy raster game asset.')
}

console.log('Static build verification passed.')
