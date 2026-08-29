import { chromium } from '@playwright/test';
import fs from 'fs/promises';
import path from 'path';

const baseUrl = process.env.BASE_URL || 'http://localhost:5173';
const productPath = process.env.PRODUCT_PATH || '/product/executive-leatherette-visitor-executive-chairs-set';
const outDir = process.env.OUT_DIR || path.resolve('tmp', 'screenshots');

async function capture(name, viewport, extraOptions = {}) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport,
    deviceScaleFactor: 1,
    ...extraOptions,
  });
  const page = await context.newPage();
  await page.goto(`${baseUrl}${productPath}`, { waitUntil: 'networkidle' });
  await page.getByText('Inquire for Price & Details', { exact: false }).waitFor({ timeout: 15000 });
  await page.waitForTimeout(Number(process.env.WAIT_MS || 40000));
  await page.screenshot({ path: path.join(outDir, `${name}.png`), fullPage: true });
  await browser.close();
}

await fs.mkdir(outDir, { recursive: true });

await capture('product-trust-desktop', { width: 1440, height: 1600 });
await capture('product-trust-mobile', { width: 390, height: 844 }, { isMobile: true, hasTouch: true });
