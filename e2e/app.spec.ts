import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'

const choosePreference = async (page: Page, controlName: string, optionName: string) => {
  await page.getByRole('button', { name: controlName }).click()
  await page.getByRole('option', { name: optionName }).click()
}

test('renders the application shell without accessibility violations', async ({ page }) => {
  await page.goto('./')

  await expect(page.getByRole('main')).toBeVisible()
  const results = await new AxeBuilder({ page }).analyze()
  expect(results.violations).toEqual([])
})

test('keeps the application free of horizontal overflow', async ({ page }) => {
  await page.goto('./')

  for (const width of [320, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 })
    const hasOverflow = await page.evaluate(
      () => document.documentElement.scrollWidth > document.documentElement.clientWidth,
    )
    expect(hasOverflow).toBe(false)
  }
})

test('keeps both scorecards and primary actions side by side on small screens', async ({
  page,
}) => {
  await page.setViewportSize({ width: 320, height: 900 })
  await page.goto('./')

  const [firstPlayer, secondPlayer, rollButton, holdButton] = await Promise.all([
    page.getByRole('article', { name: 'Player 1' }).boundingBox(),
    page.getByRole('article', { name: 'Player 2' }).boundingBox(),
    page.getByRole('button', { name: 'Roll dice' }).boundingBox(),
    page.getByRole('button', { name: 'Hold points' }).boundingBox(),
  ])

  expect(firstPlayer).not.toBeNull()
  expect(secondPlayer).not.toBeNull()
  expect(rollButton).not.toBeNull()
  expect(holdButton).not.toBeNull()
  expect(firstPlayer?.y).toBeCloseTo(secondPlayer?.y ?? 0, 0)
  expect(firstPlayer?.x).toBeLessThan(secondPlayer?.x ?? 0)
  expect(rollButton?.y).toBeCloseTo(holdButton?.y ?? 0, 0)
  expect(rollButton?.x).toBeLessThan(holdButton?.x ?? 0)
})

test('keeps the header visible while the page scrolls', async ({ page }) => {
  await page.goto('./')

  await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight }))
  await expect(page.getByRole('banner')).toBeInViewport()
  expect((await page.getByRole('banner').boundingBox())?.y).toBe(0)
})

test('serves a browser-compatible favicon from the Pages base path', async ({ page }) => {
  await page.goto('./')

  const faviconHref = await page
    .locator('link[rel="icon"][href*="favicon.ico"]')
    .first()
    .getAttribute('href')
  expect(faviconHref).toBe('/roll-or-hold/favicon.ico?v=3')

  const faviconResponse = await page.request.get(new URL(faviconHref ?? '', page.url()).href)
  expect(faviconResponse.ok()).toBe(true)
  expect(faviconResponse.headers()['content-type']).toContain('image')
})

test('supports keyboard navigation in preference menus', async ({ page }) => {
  await page.goto('./')

  const languageButton = page.getByRole('button', { name: 'Language' })
  await languageButton.focus()
  await languageButton.press('ArrowDown')
  await expect(page.getByRole('option', { name: 'English' })).toBeFocused()
  const openMenuResults = await new AxeBuilder({ page }).analyze()
  expect(openMenuResults.violations).toEqual([])

  await page.keyboard.press('ArrowDown')
  await expect(page.getByRole('option', { name: 'Português' })).toBeFocused()
  await page.keyboard.press('Enter')

  await expect(page.getByRole('button', { name: 'Idioma' })).toContainText('Português')
  await expect(page.getByRole('option')).toHaveCount(0)
})

test('uses the supported browser language without persisting an implicit choice', async ({
  page,
}) => {
  await page.addInitScript(() => {
    Object.defineProperty(window.navigator, 'languages', { value: ['pt-BR'] })
    Object.defineProperty(window.navigator, 'language', { value: 'pt-BR' })
  })
  await page.goto('./')

  await expect(
    page.getByRole('heading', { level: 1, name: 'Jogador 1, é a sua vez.' }),
  ).toBeVisible()
  expect(await page.evaluate(() => localStorage.getItem('roll-or-hold.locale'))).toBeNull()
})

test('persists theme and language preferences', async ({ page }) => {
  await page.emulateMedia({ colorScheme: 'dark' })
  await page.goto('./')

  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  expect(await page.evaluate(() => localStorage.getItem('roll-or-hold.theme'))).toBeNull()

  await page.emulateMedia({ colorScheme: 'light' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await page.emulateMedia({ colorScheme: 'dark' })
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  await choosePreference(page, 'Theme', 'Light')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')

  await choosePreference(page, 'Language', 'Português')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Jogador 1, é a sua vez.' }),
  ).toBeVisible()

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'light')
  await expect(page.getByRole('button', { name: 'Tema' })).toContainText('Claro')
  await expect(page.getByRole('button', { name: 'Idioma' })).toContainText('Português')
})

test('announces a winner and locks gameplay actions', async ({ page }) => {
  await page.addInitScript(() => {
    Math.random = () => 0.25
  })
  await page.goto('./')

  await page.getByRole('spinbutton', { name: 'Winning score' }).fill('4')
  await page.getByRole('button', { name: 'New game' }).click()
  await page.getByRole('button', { name: 'Roll dice' }).click()
  await page.getByRole('button', { name: 'Hold points' }).click()

  await expect(page.getByRole('heading', { level: 1, name: 'Player 1 wins!' })).toBeVisible()
  await expect(page.getByRole('status')).toContainText('won with 4')
  await expect(page.getByRole('button', { name: 'Roll dice' })).toBeDisabled()
  await expect(page.getByRole('button', { name: 'Hold points' })).toBeDisabled()
})
