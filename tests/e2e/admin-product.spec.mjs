import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';

const adminEmail = 'admin@junaidfurniture.com';
const adminPassword = 'Admin@12345';

test.describe('Admin product management E2E', () => {
  test.beforeEach(async ({ page }) => {
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        const text = `[console:${msg.type()}] ${msg.text()}`;
        fs.appendFileSync('tests/e2e/logs/console.log', text + '\n');
      }
    });
    page.on('requestfailed', (req) => {
      const text = `[requestfailed] ${req.method()} ${req.url()} ${req.failure().errorText}`;
      fs.appendFileSync('tests/e2e/logs/network.log', text + '\n');
    });
  });

  test('Admin login, create/edit/delete product, verify shop and details', async ({ page }, testInfo) => {
    // ensure logs dir
    fs.mkdirSync('tests/e2e/logs', { recursive: true });

    // Login
    await page.goto('/login');
    await page.getByLabel('Email').fill(adminEmail);
    await page.getByLabel('Password').fill(adminPassword);
    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle' }),
      page.getByRole('button', { name: /Sign In/i }).click(),
    ]);
    await expect(page).toHaveURL(/dashboard|admin/);

    // Navigate to admin products
    await page.goto('/admin/products');

    // Create product
    const productName = 'E2E Product ' + Date.now();
    await page.getByLabel('Product Name').fill(productName);
    await page.getByLabel('Category').selectOption({ index: 1 }).catch(() => {});
    await page.getByLabel('Short Description').fill('E2E short');
    await page.getByLabel('Description').fill('E2E long description');
    await page.getByLabel('Price (PKR)').fill('1999');
    await page.getByLabel('Stock Qty').fill('5');

    const img1 = path.resolve('server/public/uploads/products/1783415890584-564617541.jpeg');
    const img2 = path.resolve('server/public/uploads/products/1783415891846-735165537.jpeg');
    await page.locator('label:has-text("Upload Images") input[type=file]').setInputFiles([img1, img2]);

    await Promise.all([
      page.waitForResponse((r) => r.url().endsWith('/api/products') && (r.status() === 200 || r.status() === 201)),
      page.getByRole('button', { name: /Create Product/i }).click(),
    ]).catch(async (e) => {
      await page.screenshot({ path: `tests/e2e/logs/create-failure-${Date.now()}.png` });
      throw e;
    });

    // Verify in admin table
    await expect(page.locator(`table tr:has-text("${productName}")`)).toHaveCount(1);

    // Verify on shop
    await page.goto('/shop');
    await page.waitForTimeout(1000);
    const foundInShop = await page.locator(`text=${productName}`).count();
    expect(foundInShop).toBeGreaterThan(0);

    // Open product details
    await page.locator(`text=${productName}`).first().click();
    await page.waitForTimeout(1000);
    const imgs = await page.locator('img').all();
    let ok = false;
    for (const img of imgs) {
      const src = await img.getAttribute('src');
      if (src && src.includes('/uploads/products/')) { ok = true; break; }
    }
    expect(ok).toBeTruthy();

    // Edit product from admin
    await page.goto('/admin/products');
    await page.locator(`table tr:has-text("${productName}") button:has-text("Edit")`).first().click();
    const newName = productName + ' (edited)';
    await page.getByLabel('Product Name').fill(newName);
    await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/products') && r.status() === 200),
      page.getByRole('button', { name: /Update Product/i }).click(),
    ]);
    await expect(page.locator(`table tr:has-text("${newName}")`)).toHaveCount(1);

    // Delete product
    page.once('dialog', async (d) => await d.accept());
    await Promise.all([
      page.waitForResponse((r) => r.url().includes('/api/products') && (r.status() === 200 || r.status() === 204)),
      page.locator(`table tr:has-text("${newName}") button:has-text("Trash")`).first().click(),
    ]);

    // Additional flows: search, filters, wishlist, add to cart, checkout, logout
    // Search
    await page.goto('/shop');
    await page.getByPlaceholder('Search furniture...').fill('E2E');
    await page.waitForTimeout(500);
    // Filters - try selecting first category
    await page.getByRole('combobox', { name: /Categories/i }).selectOption({ index: 1 }).catch(() => {});
    await page.waitForTimeout(500);

    // Wishlist
    const firstProduct = page.locator('.ProductCard, .product-card').first();
    if (await firstProduct.count()) {
      await firstProduct.locator('text=Wishlist, text=Add to Wishlist').first().click().catch(() => {});
    }

    // Add to cart
    const card = page.locator('.ProductCard, .product-card').first();
    if (await card.count()) {
      await card.locator('text=Add to cart, text=Add').first().click().catch(() => {});
    }

    // Checkout (navigate to cart and attempt checkout)
    await page.goto('/cart');
    await page.waitForTimeout(500);
    await page.locator('button:has-text("Checkout")').first().click().catch(() => {});

    // Logout
    await page.goto('/');
    await page.locator('a:has-text("Sign in")').first().click().catch(() => {});
    // If logged in, click logout
    await page.locator('a:has-text("Sign out"), button:has-text("Logout")').first().click().catch(() => {});
  });
});
