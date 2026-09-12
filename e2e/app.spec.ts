import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'

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

test('persists theme and language preferences', async ({ page }) => {
  await page.goto('./')

  await page.getByRole('combobox', { name: 'Theme' }).selectOption('dark')
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')

  await page.getByRole('combobox', { name: 'Language' }).selectOption('pt-BR')
  await expect(
    page.getByRole('heading', { level: 1, name: 'Jogador 1, é a sua vez.' }),
  ).toBeVisible()

  await page.reload()
  await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  await expect(page.getByRole('combobox', { name: 'Tema' })).toHaveValue('dark')
  await expect(page.getByRole('combobox', { name: 'Idioma' })).toHaveValue('pt-BR')
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
