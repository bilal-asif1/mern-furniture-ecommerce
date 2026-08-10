import { chromium } from 'playwright';

const baseUrl = 'http://localhost:5173';
const apiBaseUrl = 'http://127.0.0.1:5000/api';
const orderNotes = 'Please take care of my order';
const adminEmail = 'admin@junaidfurniture.com';
const adminPassword = 'Admin@12345';

const expectText = (condition, message) => {
  if (!condition) throw new Error(message);
};

const readJsonResponse = async (response) => {
  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({
  viewport: { width: 1440, height: 1200 },
});

page.on('console', (message) => {
  if (['error', 'warning'].includes(message.type())) {
    console.log(`[console:${message.type()}] ${message.text()}`);
  }
});

page.on('requestfailed', (request) => {
  console.log(`[requestfailed] ${request.method()} ${request.url()} ${request.failure()?.errorText || ''}`);
});

try {
  let capturedPayload = null;
  let createdOrder = null;
  let capturedOrderRequest = null;
  let capturedOrderResponse = null;

  page.on('request', (request) => {
    if (request.method() === 'POST' && request.url().includes('/api/orders')) {
      capturedOrderRequest = request;
      try {
        capturedPayload = request.postDataJSON();
      } catch (_error) {
        capturedPayload = null;
      }
    }
  });

  page.on('response', async (response) => {
    if (response.request().method() === 'POST' && response.url().includes('/api/orders')) {
      capturedOrderResponse = response;
    }
  });

  await page.goto(`${baseUrl}/shop`, { waitUntil: 'networkidle' });
  console.log(`shop cards: ${(await page.locator('article').count())}`);
  console.log((await page.locator('body').innerText()).slice(0, 1000));
  await page.getByRole('button', { name: /Add to Cart/i }).first().click();
  await page.goto(`${baseUrl}/cart`, { waitUntil: 'networkidle' });
  console.log(`cart page text: ${(await page.locator('body').innerText()).slice(0, 1000)}`);
  await page.getByRole('link', { name: /Proceed to Checkout/i }).click();

  await page.waitForURL(/\/checkout/);
  await page.waitForLoadState('networkidle');

  await page.getByLabel('Full Name').fill('Guest Order Tester');
  await page.getByLabel('City').fill('Karachi');
  await page.getByLabel('Email').fill('guest@example.com');
  await page.getByLabel('Phone').fill('+92 300 0000000');
  await page.getByLabel('Address').fill('123 Test Street');
  await page.getByLabel('Order Notes').fill(orderNotes);

  const notesValue = await page.getByLabel('Order Notes').inputValue();
  expectText(notesValue === orderNotes, `Checkout textarea state mismatch: ${JSON.stringify(notesValue)}`);
  const submitDisabled = await page.getByRole('button', { name: /Place Order/i }).isDisabled();
  console.log(`submit disabled: ${submitDisabled}`);

  await page.getByRole('button', { name: /Place Order/i }).click();
  await page.waitForTimeout(4000);
  console.log(`post-click url: ${page.url()}`);
  console.log(`post-click body: ${(await page.locator('body').innerText()).slice(0, 1500)}`);

  expectText(Boolean(capturedOrderRequest), 'No POST /orders request observed after clicking Place Order');
  expectText(Boolean(capturedOrderResponse), 'No POST /orders response observed after clicking Place Order');
  console.log(`captured request url: ${capturedOrderRequest.url()}`);
  console.log(`captured response url: ${capturedOrderResponse.url()}`);

  createdOrder = await readJsonResponse(capturedOrderResponse);
  console.log(`create order status: ${capturedOrderResponse.status()}`);
  console.log(`create order response: ${JSON.stringify(createdOrder).slice(0, 1000)}`);
  expectText(Boolean(createdOrder?.orderNotes), 'Create order response did not include orderNotes');
  expectText(createdOrder.orderNotes === orderNotes, `Create order response note mismatch: ${JSON.stringify(createdOrder.orderNotes)}`);
  expectText(Boolean(capturedPayload), 'Did not capture POST /orders payload');
  expectText(capturedPayload.orderNotes === orderNotes, `POST /orders payload note mismatch: ${JSON.stringify(capturedPayload?.orderNotes)}`);

  const orderId = createdOrder._id || createdOrder.id;
  expectText(Boolean(orderId), 'Created order did not return an id');

  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' });
  await page.getByLabel('Email').fill(adminEmail);
  await page.getByLabel('Password').fill(adminPassword);
  await Promise.all([
    page.waitForURL(/dashboard|admin/),
    page.getByRole('button', { name: /Sign In/i }).click(),
  ]);

  await page.goto(`${baseUrl}/admin/orders`, { waitUntil: 'networkidle' });
  console.log(`admin page text: ${(await page.locator('body').innerText()).slice(0, 1500)}`);
  const orderCard = page.locator(`.shadow-card`).filter({ hasText: orderId }).first();
  await expectText(await orderCard.count() > 0, `Could not find admin order card for ${orderId}`);

  await orderCard.getByRole('button', { name: /View Details/i }).click();
  const modal = page.locator('text=Delivery Instructions').locator('..');
  await page.getByText(orderNotes, { exact: true }).waitFor({ state: 'visible', timeout: 10000 });

  console.log('Browser verification passed');
  console.log(`Order id: ${orderId}`);
  console.log(`Order notes: ${orderNotes}`);
} finally {
  await browser.close();
}
