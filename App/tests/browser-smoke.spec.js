import { expect, test } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

const viewports = [
  ['phone-320', 320, 700],
  ['phone-375', 375, 812],
  ['phone-390', 390, 844],
  ['phone-landscape', 844, 390],
  ['zoom-200-equivalent', 640, 720],
  ['zoom-400-equivalent', 320, 700],
  ['tablet-768', 768, 1024],
  ['short-desktop', 1024, 600],
  ['desktop-1024', 1024, 768],
  ['desktop-1440', 1440, 900],
]

for (const [name, width, height] of viewports) {
  test(`${name} reflows without page-level clipping`, async ({ page }) => {
    const errors = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.setViewportSize({ width, height })
    await page.goto('/')
    await page.locator('#hero-date').waitFor({ state: 'visible' })

    expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
    for (const selector of ['#hero-date', '#hero-bahrain-hijri']) {
      const fits = await page.locator(selector).evaluate((element) => element.scrollWidth <= element.clientWidth + 1)
      expect(fits, `${selector} should not be clipped`).toBe(true)
    }

    for (const tab of ['calendars', 'chronology', 'sky', 'traditions', 'fiction', 'overview']) {
      await page.locator(`#tab-${tab}`).click()
      const panelId = await page.locator(`#tab-${tab}`).getAttribute('aria-controls')
      await expect(page.locator(`#${panelId}`)).toBeVisible()
      expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth + 1)).toBe(true)
    }
    expect(errors).toEqual([])
  })
}

test('historical input, coordinate validation and RTL tabs work from the keyboard', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await page.locator('#year-input').fill('1')
  await page.locator('#month-input').selectOption('1')
  await page.locator('#day-input').selectOption('1')
  await page.locator('#date-form button[type="submit"]').click()
  await expect(page.locator('#hero-date')).toContainText('1')
  await expect(page.locator('#hero-weekday')).toHaveText('Monday')

  await page.locator('#location-input').fill('Manama')
  await page.locator('#date-form button[type="submit"]').click()
  await expect(page.locator('#location-input')).toHaveAttribute('aria-invalid', 'true')
  await expect(page.locator('#location-error')).toContainText('latitude, longitude')

  await page.locator('[data-language-value="ar"]').click()
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl')
  await page.locator('#tab-overview').focus()
  await page.keyboard.press('ArrowLeft')
  await expect(page.locator('#tab-calendars')).toHaveAttribute('aria-selected', 'true')
})

for (const [theme, language] of [['dark', 'en'], ['light', 'en'], ['dark', 'ar']]) {
  test(`axe WCAG audit: ${theme} ${language}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 })
    await page.goto('/')
    if (theme === 'light') await page.locator('[data-theme-value="light"]').click()
    if (language === 'ar') await page.locator('[data-language-value="ar"]').click()

    for (const tab of ['overview', 'calendars', 'chronology', 'sky', 'traditions', 'fiction']) {
      await page.locator(`#tab-${tab}`).click()
      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'])
        .analyze()
      expect(results.violations, `${tab}: ${results.violations.map(({ id }) => id).join(', ')}`).toEqual([])
    }
  })
}
