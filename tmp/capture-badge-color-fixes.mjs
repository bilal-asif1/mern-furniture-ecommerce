import { chromium } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
const productPath = process.env.PRODUCT_PATH || '/product/executive-leatherette-visitor-executive-chairs-set';
const outDir = process.env.OUT_DIR || path.resolve('tmp', 'screenshots');

async function captureProductDetail(page) {
  await page.goto(`${baseUrl}${productPath}`, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(Number(process.env.WAIT_MS || 40000));
  await page.screenshot({ path: path.join(outDir, 'product-detail-badges-dark.png'), fullPage: true });
}

async function captureSearchDropdown(page) {
  await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(Number(process.env.WAIT_MS || 40000));
  await page.getByRole('button', { name: 'Search products' }).click();
  await page.getByRole('searchbox', { name: 'Search products' }).fill('chair');
  await page.locator('a[href="/product/executive-leatherette-visitor-executive-chairs-set"]').first().waitFor({ timeout: 15000 });
  await page.screenshot({ path: path.join(outDir, 'search-dropdown-badges-dark.png'), fullPage: true });
}

await fs.mkdir(outDir, { recursive: true });

const browser = await chromium.launch({ headless: true });

{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1600 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await captureProductDetail(page);
  await context.close();
}

{
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1200 },
    deviceScaleFactor: 1,
  });
  const page = await context.newPage();
  await captureSearchDropdown(page);
  await context.close();
}

await browser.close();
