import test, { expect } from "@playwright/test";

test(`navigate to blog posts from landing page`, async ({ page }) => {
  await page.goto(`/`);
  await page.getByRole('article').first().click()

  await page.waitForURL(/blog\/[0-9]+/g)
  await page.getByRole('article').waitFor()
});

test(`navigate to blog from landing page`, async ({ page }) => {
  await page.goto(`/`);
  expect(await page.getByRole('article').count()).toBe(3)
  await page.getByText('All posts').click()

  await page.waitForURL(/blog$/g)
  expect(await page.getByRole('article').count()).toBeGreaterThan(3)
});
