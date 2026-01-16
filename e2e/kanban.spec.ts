import { expect, test } from '@playwright/test'

test('create a task from the board', async ({ page }) => {
  await page.goto('/')
  await page.evaluate(() => localStorage.clear())
  await page.reload()

  await page.getByRole('button', { name: /new task/i }).click()
  await page.getByLabel('Title').fill('Launch onboarding flow')
  await page.getByLabel('Description').fill('Ship the first run experience for new users.')
  await page.getByLabel('Priority').selectOption('high')
  await page.getByLabel('Tags').fill('launch, ux')
  await page.getByRole('button', { name: /create task/i }).click()

  await expect(page.getByText('Launch onboarding flow')).toBeVisible()
  await expect(page.getByText('launch')).toBeVisible()
})
