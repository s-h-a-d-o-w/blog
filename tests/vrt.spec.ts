import { test, expect } from '@playwright/test';
import { readdirSync } from 'node:fs';
import { join } from 'node:path';

readdirSync(join(process.cwd(), 'posts'))
  .filter(file => file.endsWith('.md'))
  .map(file => file.replace('.md', ''))
  .forEach(post => {
    test(`VRT for ${post}`, async ({ page }) => {
      await page.goto(`/blog/${post}`);
      await page.waitForSelector('article');
      await expect(page).toHaveScreenshot({
        fullPage: true,
        timeout: 10000
      });
    });
  })

test(`VRT for landing page`, async ({ page }) => {
  await page.goto(`/`);
  await page.waitForSelector('article');
  await expect(page).toHaveScreenshot({
    fullPage: true,
    timeout: 10000
  });
});
