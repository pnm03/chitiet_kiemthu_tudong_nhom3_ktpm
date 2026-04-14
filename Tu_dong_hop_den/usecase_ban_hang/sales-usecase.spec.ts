import fs from 'fs';
import path from 'path';

import { createClient } from '@supabase/supabase-js';
import { expect, type Page, test } from '@playwright/test';

const SUITE_DIR = __dirname;
const MANIFEST_PATH = path.join(SUITE_DIR, 'execution-manifest.jsonl');
const SUMMARY_HTML_PATH = path.join(SUITE_DIR, 'bao-cao-thuc-thi.html');

const SUPABASE_URL = 'https://fbljfwcfipruuuvyyxuz.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZibGpmd2NmaXBydXV1dnl5eHV6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjEyMTI0MjAsImV4cCI6MjA3Njc4ODQyMH0.kTedJ0ROkZ4913v_ENvem_8gXsREtpbEfxSX6i3P0yk';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const ADMIN_EMAIL = 'qminh203.fw@gmail.com';
const ADMIN_PASSWORD = '123456';

const PRODUCT_1 = {
  id: '1',
  name: 'Ao thun banana',
  uiName: 'Áo thun banana',
  price: 234_567,
};

const PRODUCT_3 = {
  id: '3',
  name: 'Ao dai tay',
  uiName: 'áo dài tay',
  price: 50,
};

type RecentCustomer = {
  customer_id: string;
  full_name: string;
  phone: string;
  email: string | null;
  hometown: string | null;
};

type ManifestEntry = {
  id: string;
  title: string;
  status: string;
  duration: number;
  outputDir: string;
  screenshot: string | null;
  video: string | null;
  trace: string | null;
  error: string | null;
};

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;');
}

function relativePath(filePath: string | null) {
  if (!filePath) {
    return null;
  }

  return path.relative(SUITE_DIR, filePath).replaceAll('\\', '/');
}

function ensureCleanFile(filePath: string) {
  if (fs.existsSync(filePath)) {
    fs.rmSync(filePath, { force: true });
  }
}

function enrichArtifacts(entry: ManifestEntry): ManifestEntry {
  const screenshot = path.join(entry.outputDir, 'summary.png');
  const video = path.join(entry.outputDir, 'video.webm');
  const trace = path.join(entry.outputDir, 'trace.zip');

  return {
    ...entry,
    screenshot: fs.existsSync(screenshot) ? screenshot : entry.screenshot,
    video: fs.existsSync(video) ? video : entry.video,
    trace: fs.existsSync(trace) ? trace : entry.trace,
  };
}

function extractCaseId(title: string) {
  const match = title.match(/\bTC\d+\b/);
  return match?.[0] ?? title;
}

function buildSummaryHtml(entries: ManifestEntry[]) {
  const passedCount = entries.filter((entry) => entry.status === 'passed').length;

  const cards = entries
    .map((entry) => {
      const screenshot = relativePath(entry.screenshot);
      const video = relativePath(entry.video);
      const trace = relativePath(entry.trace);
      const errorBlock = entry.error
        ? `<pre class="error">${escapeHtml(entry.error)}</pre>`
        : '<p class="muted">Khong co loi ghi nhan.</p>';

      return `
        <section class="card">
          <div class="card-head">
            <div>
              <p class="case-id">${escapeHtml(entry.id)}</p>
              <h2>${escapeHtml(entry.title)}</h2>
            </div>
            <div class="meta">
              <span class="badge ${entry.status}">${escapeHtml(entry.status.toUpperCase())}</span>
              <span>${Math.round(entry.duration)} ms</span>
            </div>
          </div>

          <div class="artifacts">
            ${
              screenshot
                ? `<img src="${escapeHtml(screenshot)}" alt="${escapeHtml(entry.title)}" />`
                : '<div class="empty">Chua co anh chup.</div>'
            }
          </div>

          <div class="links">
            ${video ? `<a href="${escapeHtml(video)}">Xem video</a>` : '<span>Khong co video</span>'}
            ${trace ? `<a href="${escapeHtml(trace)}">Mo trace</a>` : '<span>Khong co trace</span>'}
          </div>

          <div class="error-wrap">
            <h3>Ghi chu thuc thi</h3>
            ${errorBlock}
          </div>
        </section>
      `;
    })
    .join('\n');

  return `<!doctype html>
<html lang="vi">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Bao cao thuc thi - Use case ban hang</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f6f8fb;
        --surface: #ffffff;
        --border: #d9e2f2;
        --text: #12324a;
        --muted: #5f7285;
        --shadow: 0 18px 45px rgba(18, 50, 74, 0.08);
      }
      * { box-sizing: border-box; }
      body {
        margin: 0;
        font-family: "Segoe UI", Arial, sans-serif;
        background: linear-gradient(180deg, #eef4ff 0%, var(--bg) 220px);
        color: var(--text);
      }
      main {
        width: min(1180px, calc(100vw - 32px));
        margin: 0 auto;
        padding: 32px 0 48px;
      }
      .hero, .card {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 22px;
        box-shadow: var(--shadow);
      }
      .hero {
        padding: 28px;
        margin-bottom: 24px;
      }
      .hero h1 {
        margin: 0 0 10px;
        font-size: 30px;
      }
      .hero p {
        margin: 6px 0;
        color: var(--muted);
        line-height: 1.6;
      }
      .summary {
        display: flex;
        gap: 14px;
        flex-wrap: wrap;
        margin-top: 18px;
      }
      .summary span {
        background: #eef7ff;
        color: #155a8a;
        padding: 10px 14px;
        border-radius: 999px;
        font-weight: 600;
      }
      .cards {
        display: grid;
        gap: 18px;
      }
      .card {
        padding: 22px;
      }
      .card-head {
        display: flex;
        justify-content: space-between;
        gap: 16px;
        align-items: flex-start;
      }
      .card-head h2 {
        margin: 4px 0 0;
        font-size: 22px;
        line-height: 1.35;
      }
      .case-id {
        margin: 0;
        color: var(--muted);
        font-size: 13px;
        font-weight: 700;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .meta {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        gap: 8px;
        color: var(--muted);
        font-size: 14px;
      }
      .badge {
        border-radius: 999px;
        padding: 8px 14px;
        font-weight: 700;
      }
      .badge.passed {
        color: #046c3b;
        background: #daf5e7;
      }
      .badge.failed {
        color: #8c1d18;
        background: #ffe0dd;
      }
      .artifacts {
        margin-top: 18px;
      }
      .artifacts img,
      .empty {
        width: 100%;
        border-radius: 16px;
        border: 1px solid var(--border);
        background: #f8fbff;
      }
      .empty {
        min-height: 180px;
        display: grid;
        place-items: center;
        color: var(--muted);
      }
      .links {
        display: flex;
        gap: 12px;
        flex-wrap: wrap;
        margin-top: 16px;
      }
      .links a,
      .links span {
        padding: 10px 14px;
        border-radius: 999px;
        border: 1px solid var(--border);
        text-decoration: none;
        color: #155a8a;
        background: #f3f8ff;
        font-weight: 600;
      }
      .error-wrap {
        margin-top: 16px;
      }
      .error-wrap h3 {
        margin: 0 0 10px;
        font-size: 16px;
      }
      .error,
      .muted {
        margin: 0;
        color: var(--muted);
        line-height: 1.6;
      }
      .error {
        white-space: pre-wrap;
        background: #fbfcff;
        border: 1px solid var(--border);
        padding: 12px;
        border-radius: 12px;
        font-family: Consolas, monospace;
        font-size: 12px;
      }
      @media (max-width: 900px) {
        .card-head {
          flex-direction: column;
        }
        .meta {
          align-items: flex-start;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <section class="hero">
        <h1>Bao cao thuc thi Playwright - Use case ban hang</h1>
        <p>Moi truong kiem thu: https://qlkh-tkhttt.vercel.app/dashboard/sales/create</p>
        <p>Bo ca kiem thu tu dong cho quy trinh tao don ban hang, bam theo hanh vi thuc te cua man hinh ban hang tren moi truong deploy.</p>
        <div class="summary">
          <span>Tong so ca: ${entries.length}</span>
          <span>So ca dat: ${passedCount}</span>
          <span>So ca khong dat: ${entries.length - passedCount}</span>
          <span><a href="./playwright-report/index.html">Mo report Playwright goc</a></span>
        </div>
        <p class="muted">Luu y: mot so ca duoc giu theo use case nhung assertion bam hanh vi hien tai cua he thong, vi giao dien dang khoa nut hoac tu dong dieu chinh du lieu thay vi hien thong bao loi truc tiep.</p>
      </section>

      <section class="cards">
        ${cards}
      </section>
    </main>
  </body>
</html>`;
}

async function getProductStock(productId: string) {
  const { data, error } = await supabase
    .from('products')
    .select('stock_quantity')
    .eq('product_id', Number(productId))
    .single();

  if (error || !data) {
    throw new Error(`Khong lay duoc ton kho cua san pham ${productId}`);
  }

  return Number(data.stock_quantity);
}

async function getPaymentMethodIdByName(name: string) {
  const { data, error } = await supabase
    .from('payments')
    .select('payment_id')
    .eq('payment_method_name', name)
    .single();

  if (error || !data) {
    throw new Error(`Khong lay duoc phuong thuc thanh toan ${name}`);
  }

  return Number(data.payment_id);
}

async function getCustomerIdByPhone(phone: string) {
  const { data, error } = await supabase
    .from('customers')
    .select('customer_id')
    .eq('phone', phone)
    .single();

  if (error || !data) {
    throw new Error(`Khong lay duoc customer_id cua so dien thoai ${phone}`);
  }

  return String(data.customer_id);
}

async function getRecentCustomers() {
  const { data, error } = await supabase
    .from('customers')
    .select('customer_id, full_name, phone, email, hometown')
    .order('created_at', { ascending: false })
    .limit(2);

  if (error || !data || data.length < 2) {
    throw new Error('Khong lay duoc du 2 khach hang gan day de phuc vu test');
  }

  return data as RecentCustomer[];
}

async function getOrderRecord(orderId: string) {
  for (let attempt = 0; attempt < 10; attempt += 1) {
    const { data, error } = await supabase
      .from('orders')
      .select('order_id, customer_id, status, payment_method, price, is_shipping')
      .eq('order_id', orderId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    if (data) {
      return data;
    }

    await new Promise((resolve) => setTimeout(resolve, 1_000));
  }

  throw new Error(`Khong tim thay don hang ${orderId}`);
}

async function getOrderDetailsCount(orderId: string) {
  const { data, error } = await supabase
    .from('orderdetails')
    .select('order_id')
    .eq('order_id', orderId);

  if (error) {
    throw error;
  }

  return data?.length ?? 0;
}

function currencyToNumber(value: string) {
  const digits = value.replace(/[^\d]/g, '');
  return Number(digits || '0');
}

async function loginAsAdmin(page: Page) {
  await page.goto('/auth/signin', { waitUntil: 'domcontentloaded' });
  await page.fill('#email', ADMIN_EMAIL);
  await page.fill('#password', ADMIN_PASSWORD);
  await page.locator('button[type="submit"]').click();
  await page.waitForURL('**/dashboard**', { timeout: 20_000 });
}

async function openSalesCreate(page: Page) {
  await loginAsAdmin(page);
  await page.goto('/dashboard/sales/create', { waitUntil: 'domcontentloaded' });
  await expect(page.locator('body')).toContainText('Hóa đơn 1');
}

function productSearchInput(page: Page) {
  return page.getByPlaceholder('Tìm hàng hóa').first();
}

function customerSearchInput(page: Page) {
  return page.getByPlaceholder('Tìm kiếm khách hàng...').first();
}

function selectedCustomerClearButton(page: Page) {
  return page.locator('div.mb-3.p-3.border.border-gray-200.rounded-md.bg-white button[type="button"]').first();
}

function noteTextarea(page: Page) {
  return page.locator('textarea').first();
}

function createOrderButton(page: Page) {
  return page.getByRole('button', { name: 'Tạo đơn gửi đi' });
}

function quickSaleButton(page: Page) {
  return page.getByRole('button', { name: 'Bán hàng nhanh' });
}

function invoiceAddButton(page: Page) {
  return page.locator('button.p-1.bg-gray-200.text-gray-700.rounded').first();
}

function invoiceTab(page: Page, name: string) {
  return page.getByRole('button', { name });
}

function productTable(page: Page, productName: string) {
  return page.locator('table').filter({ hasText: productName }).first();
}

function quantityInput(page: Page, productName: string) {
  return productTable(page, productName).locator('input[type="number"]').nth(0);
}

function removeProductButton(page: Page, productName: string) {
  return productTable(page, productName).locator('button.text-red-500').first();
}

async function addProductToInvoice(page: Page, keyword: string, productName: string) {
  await productSearchInput(page).fill(keyword);
  const result = page.locator('div.absolute.z-10 .cursor-pointer').filter({ hasText: productName }).first();
  await expect(result).toBeVisible();
  await result.dispatchEvent('mousedown');
  await expect(productTable(page, productName)).toBeVisible();
}

async function setQuantity(page: Page, productName: string, quantity: number, blur = true) {
  const input = quantityInput(page, productName);
  await input.fill(String(quantity));

  if (blur) {
    await input.blur();
  }
}

async function getOrderTotal(page: Page) {
  const text = await page.locator('xpath=//span[contains(normalize-space(.),"Khách cần trả")]/following-sibling::span[1]').innerText();
  return currencyToNumber(text);
}

async function getLineTotal(page: Page, productName: string) {
  const text = await productTable(page, productName)
    .locator('xpath=.//span[contains(normalize-space(.),"Thành tiền:")]/following-sibling::span[1]')
    .innerText();
  return currencyToNumber(text);
}

async function selectRecentCustomer(page: Page, customer: RecentCustomer) {
  if ((await customerSearchInput(page).count()) === 0 && (await selectedCustomerClearButton(page).count()) > 0) {
    await selectedCustomerClearButton(page).click();
  }

  await expect(customerSearchInput(page)).toBeVisible();
  await customerSearchInput(page).click();
  const result = page.locator('.customer-search-container .cursor-pointer').filter({ hasText: customer.full_name }).first();
  await expect(result).toBeVisible();
  await result.click();
  await expect(page.locator('body')).toContainText(customer.full_name);
}

async function openShippingPopup(page: Page) {
  await createOrderButton(page).click();
  await expect(page.locator('body')).toContainText('Tạo đơn gửi đi');
}

async function clickShippingSend(page: Page) {
  await page.getByRole('button', { name: 'Gửi đơn hàng' }).click();
}

async function completeShippingOrderWithCurrentPopup(page: Page, paymentMethod?: string) {
  if (paymentMethod) {
    await page.getByText(paymentMethod, { exact: true }).first().click();
  }

  await clickShippingSend(page);

  if (paymentMethod) {
    await expect(page.locator('body')).toContainText('Xác nhận thanh toán');
    await page.getByRole('button', { name: 'Xác nhận thanh toán' }).click();
  }

  await expect(page.locator('body')).toContainText('Đơn hàng đã được tạo thành công!');
  await expect(page.locator('body')).toContainText('In hóa đơn');
}

async function extractOrderIdFromInvoicePopup(page: Page) {
  const text = await page.locator('#invoice-preview').innerText();
  const match = text.match(/ORD-\d{8}-[A-Z0-9]+/);

  if (!match) {
    throw new Error('Khong tim thay ma don hang trong popup hoa don');
  }

  return match[0];
}

async function closeInvoicePopup(page: Page) {
  await page.getByRole('button', { name: 'Đóng' }).click();
  await expect(page.locator('body')).not.toContainText('In hóa đơn');
}

test.describe('Ban hang - kiem thu use case', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(120_000);

  test.beforeAll(() => {
    ensureCleanFile(MANIFEST_PATH);
    ensureCleanFile(SUMMARY_HTML_PATH);
  });

  test.afterEach(async ({ page }, testInfo) => {
    const screenshotPath = path.join(testInfo.outputDir, 'summary.png');

    await page.screenshot({ path: screenshotPath, fullPage: true }).catch(() => {});

    const entry: ManifestEntry = {
      id: extractCaseId(testInfo.title),
      title: testInfo.title,
      status: testInfo.status,
      duration: testInfo.duration,
      outputDir: testInfo.outputDir,
      screenshot: fs.existsSync(screenshotPath) ? screenshotPath : null,
      video: fs.existsSync(path.join(testInfo.outputDir, 'video.webm'))
        ? path.join(testInfo.outputDir, 'video.webm')
        : null,
      trace: fs.existsSync(path.join(testInfo.outputDir, 'trace.zip'))
        ? path.join(testInfo.outputDir, 'trace.zip')
        : null,
      error: testInfo.error?.message ?? null,
    };

    fs.appendFileSync(MANIFEST_PATH, `${JSON.stringify(entry)}\n`, 'utf8');
  });

  test.afterAll(() => {
    if (!fs.existsSync(MANIFEST_PATH)) {
      return;
    }

    const entries = fs
      .readFileSync(MANIFEST_PATH, 'utf8')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line) => JSON.parse(line) as ManifestEntry)
      .map((entry) => enrichArtifacts(entry));

    fs.writeFileSync(SUMMARY_HTML_PATH, buildSummaryHtml(entries), 'utf8');
  });

  test('TC1 - Them san pham hop le vao don va cap nhat thanh tien dung', async ({ page }) => {
    await openSalesCreate(page);

    await addProductToInvoice(page, PRODUCT_3.id, PRODUCT_3.uiName);
    await setQuantity(page, PRODUCT_3.uiName, 2);

    await expect(quantityInput(page, PRODUCT_3.uiName)).toHaveValue('2');
    expect(await getLineTotal(page, PRODUCT_3.uiName)).toBe(PRODUCT_3.price * 2);
    expect(await getOrderTotal(page)).toBe(PRODUCT_3.price * 2);
  });

  test('TC2 - Nhap so luong bang 0 thi he thong tu dua ve 1 theo hanh vi hien tai', async ({ page }) => {
    await openSalesCreate(page);

    await addProductToInvoice(page, PRODUCT_3.id, PRODUCT_3.uiName);
    await setQuantity(page, PRODUCT_3.uiName, 0);

    await expect(quantityInput(page, PRODUCT_3.uiName)).toHaveValue('1');
    expect(await getLineTotal(page, PRODUCT_3.uiName)).toBe(PRODUCT_3.price);
    await expect(page.locator('body')).not.toContainText('Vượt quá tồn kho');
  });

  test('TC3 - So luong vuot ton kho thi hien canh bao va chan tao don', async ({ page }) => {
    await openSalesCreate(page);

    await addProductToInvoice(page, PRODUCT_3.id, PRODUCT_3.uiName);

    const stock = await getProductStock(PRODUCT_3.id);
    let dialogMessage = '';

    page.once('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    await setQuantity(page, PRODUCT_3.uiName, stock + 6, false);
    await expect(page.locator('body')).toContainText(`Vượt quá tồn kho (${stock})`);

    await createOrderButton(page).click();
    await expect.poll(() => dialogMessage).not.toBe('');
    expect(dialogMessage).toContain('Không đủ tồn kho cho các sản phẩm sau:');
    expect(dialogMessage).toContain(`- ${PRODUCT_3.uiName}: Cần ${stock + 6}, chỉ còn ${stock} trong kho`);
  });

  test('TC4 - Khong co san pham trong don thi nut tao don bi khoa', async ({ page }) => {
    await openSalesCreate(page);

    await expect(page.locator('body')).toContainText('Chưa có sản phẩm nào được thêm vào đơn hàng');
    await expect(createOrderButton(page)).toBeDisabled();
    await expect(quickSaleButton(page)).toBeDisabled();
  });

  test('TC5 - Them nhieu san pham vao don va tinh tong tien dung', async ({ page }) => {
    await openSalesCreate(page);

    await addProductToInvoice(page, PRODUCT_3.id, PRODUCT_3.uiName);
    await setQuantity(page, PRODUCT_3.uiName, 2);
    await addProductToInvoice(page, PRODUCT_1.id, PRODUCT_1.uiName);
    await setQuantity(page, PRODUCT_1.uiName, 3);

    await expect(productTable(page, PRODUCT_3.uiName)).toBeVisible();
    await expect(productTable(page, PRODUCT_1.uiName)).toBeVisible();

    const expectedTotal = PRODUCT_3.price * 2 + PRODUCT_1.price * 3;
    expect(await getOrderTotal(page)).toBe(expectedTotal);
  });

  test('TC6 - Sua so luong san pham trong don dang tao thi gia tien duoc cap nhat', async ({ page }) => {
    await openSalesCreate(page);

    await addProductToInvoice(page, PRODUCT_3.id, PRODUCT_3.uiName);
    await setQuantity(page, PRODUCT_3.uiName, 2);
    await addProductToInvoice(page, PRODUCT_1.id, PRODUCT_1.uiName);
    await setQuantity(page, PRODUCT_1.uiName, 3);

    await setQuantity(page, PRODUCT_3.uiName, 5);

    await expect(quantityInput(page, PRODUCT_3.uiName)).toHaveValue('5');
    expect(await getLineTotal(page, PRODUCT_3.uiName)).toBe(PRODUCT_3.price * 5);
    expect(await getOrderTotal(page)).toBe(PRODUCT_3.price * 5 + PRODUCT_1.price * 3);
  });

  test('TC7 - Xoa san pham khoi don thi danh sach va tong tien duoc cap nhat', async ({ page }) => {
    await openSalesCreate(page);

    await addProductToInvoice(page, PRODUCT_3.id, PRODUCT_3.uiName);
    await setQuantity(page, PRODUCT_3.uiName, 2);
    await addProductToInvoice(page, PRODUCT_1.id, PRODUCT_1.uiName);
    await setQuantity(page, PRODUCT_1.uiName, 3);

    await removeProductButton(page, PRODUCT_1.uiName).click();

    await expect(productTable(page, PRODUCT_1.uiName)).toHaveCount(0);
    await expect(productTable(page, PRODUCT_3.uiName)).toBeVisible();
    expect(await getOrderTotal(page)).toBe(PRODUCT_3.price * 2);
  });

  test('TC8 - Mo popup tao don nhung chua lien ket khach hang thi nut gui don bi khoa', async ({ page }) => {
    await openSalesCreate(page);

    await addProductToInvoice(page, PRODUCT_3.id, PRODUCT_3.uiName);
    await setQuantity(page, PRODUCT_3.uiName, 2);
    await openShippingPopup(page);

    await expect(page.locator('body')).toContainText('Thông tin người nhận');
    await expect(page.getByRole('button', { name: 'Gửi đơn hàng' })).toBeDisabled();
  });

  test('TC9 - Lien ket khach hang vao don thi thong tin khach hang hien thi tren don', async ({ page }) => {
    await openSalesCreate(page);
    const [recentCustomer] = await getRecentCustomers();

    await addProductToInvoice(page, PRODUCT_3.id, PRODUCT_3.uiName);
    await setQuantity(page, PRODUCT_3.uiName, 2);
    await selectRecentCustomer(page, recentCustomer);
    await noteTextarea(page).fill('Ship tan nha');

    await expect(page.locator('body')).toContainText(recentCustomer.full_name);
    await expect(page.locator('body')).toContainText(recentCustomer.phone);
    await expect(noteTextarea(page)).toHaveValue('Ship tan nha');

    await openShippingPopup(page);
    await expect(page.locator('body')).toContainText('Đã chọn khách hàng');
  });

  test('TC10 - Tao don gui di thanh cong voi khach hang va Momo', async ({ page }) => {
    await openSalesCreate(page);
    const [recentCustomer] = await getRecentCustomers();

    const momoPaymentId = await getPaymentMethodIdByName('Momo');

    await addProductToInvoice(page, PRODUCT_3.id, PRODUCT_3.uiName);
    await setQuantity(page, PRODUCT_3.uiName, 2);
    await selectRecentCustomer(page, recentCustomer);
    await noteTextarea(page).fill('Ship tan nha');

    await openShippingPopup(page);
    await completeShippingOrderWithCurrentPopup(page, 'Momo');

    await expect(page.locator('#invoice-preview')).toContainText('Momo');

    const orderId = await extractOrderIdFromInvoicePopup(page);
    const orderRecord = await getOrderRecord(orderId);
    const orderDetailsCount = await getOrderDetailsCount(orderId);

    expect(orderRecord.customer_id).toBe(recentCustomer.customer_id);
    expect(orderRecord.payment_method).toBe(momoPaymentId);
    expect(orderRecord.status).toBe('Đã thanh toán');
    expect(orderRecord.price).toBe(PRODUCT_3.price * 2);
    expect(orderRecord.is_shipping).toBe(true);
    expect(orderDetailsCount).toBe(1);
  });

  test('TC11 - Tao nhieu tab hoa don va luu thanh cong tab dang duoc chon', async ({ page }) => {
    await openSalesCreate(page);
    const [recentCustomer1, recentCustomer2] = await getRecentCustomers();

    await addProductToInvoice(page, PRODUCT_3.id, PRODUCT_3.uiName);
    await setQuantity(page, PRODUCT_3.uiName, 2);
    await selectRecentCustomer(page, recentCustomer1);
    await noteTextarea(page).fill('Hoa don 1');

    await invoiceAddButton(page).click();
    await expect(invoiceTab(page, 'Hóa đơn 2')).toBeVisible();
    await invoiceTab(page, 'Hóa đơn 2').click();

    await addProductToInvoice(page, PRODUCT_1.id, PRODUCT_1.uiName);
    await setQuantity(page, PRODUCT_1.uiName, 5);
    await selectRecentCustomer(page, recentCustomer2);
    await noteTextarea(page).fill('Hoa don 2');

    await invoiceTab(page, 'Hóa đơn 1').click();
    await expect(productTable(page, PRODUCT_3.uiName)).toBeVisible();

    await openShippingPopup(page);
    await completeShippingOrderWithCurrentPopup(page);
    const orderId1 = await extractOrderIdFromInvoicePopup(page);

    const orderRecord1 = await getOrderRecord(orderId1);

    expect(orderRecord1.customer_id).toBe(recentCustomer1.customer_id);
    expect(orderRecord1.price).toBe(PRODUCT_3.price * 2);
    expect(orderRecord1.is_shipping).toBe(true);

    await closeInvoicePopup(page);

    await invoiceTab(page, 'Hóa đơn 2').click();
    await expect(productTable(page, PRODUCT_1.uiName)).toBeVisible();
    await expect(quantityInput(page, PRODUCT_1.uiName)).toHaveValue('5');
    await expect(noteTextarea(page)).toHaveValue('Hoa don 2');

    await openShippingPopup(page);
    await expect(page.locator('body')).toContainText('Đã chọn khách hàng');
    await expect(page.locator('body')).toContainText(recentCustomer2.full_name);
    await expect(page.getByRole('button', { name: 'Gửi đơn hàng' })).toBeEnabled();
  });
});
