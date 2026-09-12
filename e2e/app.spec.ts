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
