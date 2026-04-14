import fs from 'fs';
import path from 'path';

import { expect, Page, test } from '@playwright/test';

const SUITE_DIR = __dirname;
const MANIFEST_PATH = path.join(SUITE_DIR, 'execution-manifest.jsonl');
const SUMMARY_HTML_PATH = path.join(SUITE_DIR, 'bao-cao-thuc-thi.html');

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

function buildSummaryHtml(entries: ManifestEntry[]) {
  const passedCount = entries.filter((entry) => entry.status === 'passed').length;
  const cards = entries
    .map((entry) => {
      const screenshot = relativePath(entry.screenshot);
      const video = relativePath(entry.video);
      const trace = relativePath(entry.trace);
      const errorBlock = entry.error
        ? `<pre class="error">${escapeHtml(entry.error)}</pre>`
        : '<p class="muted">Không có lỗi ghi nhận.</p>';

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
            ${screenshot ? `<img src="${escapeHtml(screenshot)}" alt="${escapeHtml(entry.title)}" />` : '<div class="empty">Chưa có ảnh chụp.</div>'}
          </div>

          <div class="links">
            ${video ? `<a href="${escapeHtml(video)}">Xem video</a>` : '<span>Không có video</span>'}
            ${trace ? `<a href="${escapeHtml(trace)}">Mở trace</a>` : '<span>Không có trace</span>'}
          </div>

          <div class="error-wrap">
            <h3>Ghi chú thực thi</h3>
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
    <title>Báo cáo thực thi - Bảng quyết định đăng nhập</title>
    <style>
      :root {
        color-scheme: light;
        --bg: #f6f8fb;
        --surface: #ffffff;
        --border: #d9e2f2;
        --text: #12324a;
        --muted: #5f7285;
        --pass: #0f9d58;
        --fail: #d93025;
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

      .hero {
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 22px;
        padding: 28px;
        box-shadow: var(--shadow);
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
        background: var(--surface);
        border: 1px solid var(--border);
        border-radius: 20px;
        padding: 22px;
        box-shadow: var(--shadow);
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

      .notes {
        margin-top: 20px;
        padding-top: 18px;
        border-top: 1px dashed var(--border);
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
        <h1>Báo cáo thực thi Playwright - Bảng quyết định đăng nhập</h1>
        <p>Môi trường kiểm thử: https://qlkh-tkhttt.vercel.app/auth/signin</p>
        <p>Bộ ca kiểm thử tự động cho chức năng đăng nhập theo bảng quyết định, bám hành vi thực tế của môi trường deploy hiện tại.</p>
        <div class="summary">
          <span>Tổng số ca: ${entries.length}</span>
          <span>Số ca đạt: ${passedCount}</span>
          <span>Số ca không đạt: ${entries.length - passedCount}</span>
          <span><a href="./playwright-report/index.html">Mở report Playwright gốc</a></span>
        </div>
        <div class="notes">
          <p class="muted">Ghi chú: Ca R6 được thực hiện trên tài khoản đang ở trạng thái <code>locked</code> sẵn của môi trường deploy. Ca R7 ghi nhận hành vi thực tế hiện tại của hệ thống với tài khoản <code>inactive</code>, trong đó giao diện vẫn hiển thị lỗi chung thay vì thông báo chuyên biệt.</p>
        </div>
      </section>

      <section class="cards">
        ${cards}
      </section>
    </main>
  </body>
</html>`;
}

function extractCaseId(title: string) {
  const match = title.match(/\bR\d+\b/);
  return match?.[0] ?? title;
}

async function gotoSigninPage(page: Page) {
  await page.goto('/auth/signin', { waitUntil: 'domcontentloaded' });
  await expect(page.getByRole('heading', { name: 'Đăng nhập' })).toBeVisible({
    timeout: 20_000,
  });
}

async function submitSignin(page: Page, email: string, password: string) {
  await page.fill('#email', email);
  await page.fill('#password', password);
  await page.getByRole('button', { name: 'Đăng nhập' }).click();
}

async function waitForSigninOutcome(page: Page) {
  return Promise.any([
    page.waitForURL('**/dashboard**', { timeout: 20_000 }).then(() => 'success'),
    page
      .getByRole('heading', { name: 'Tài khoản đã bị khóa' })
      .waitFor({ state: 'visible', timeout: 20_000 })
      .then(() => 'locked'),
    page
      .getByText('Lỗi đăng nhập')
      .waitFor({ state: 'visible', timeout: 20_000 })
      .then(() => 'error'),
  ]) as Promise<'success' | 'locked' | 'error'>;
}

async function loginAndExpectSuccess(page: Page, email: string, password: string) {
  await gotoSigninPage(page);
  await submitSignin(page, email, password);

  await expect(await waitForSigninOutcome(page)).toBe('success');
  await expect(page).toHaveURL(/\/dashboard/);
}

test.describe('Đăng nhập - kiểm thử bảng quyết định', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(90_000);

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

  test('R1 - Đăng nhập thành công với tài khoản admin và truy cập được trang danh mục sản phẩm', async ({
    page,
  }) => {
    await loginAndExpectSuccess(page, 'qminh203.fw@gmail.com', '123456');

    await expect(page.getByText('Admin Minh Nè')).toBeVisible({ timeout: 20_000 });

    await page.goto('/dashboard/products/categories', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Quản lý Danh mục Sản phẩm')).toBeVisible({
      timeout: 20_000,
    });
  });

  test('R2 - Đăng nhập thành công với tài khoản NVBH nhưng bị từ chối ở chức năng thêm sản phẩm', async ({
    page,
  }) => {
    await loginAndExpectSuccess(page, 'user1@gmail.com', 'user1@gmail.com');

    await expect(page.getByText('user1@gmail.com').first()).toBeVisible({ timeout: 20_000 });

    await page.goto('/dashboard/products/add', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByRole('heading', { name: 'Truy cập bị từ chối' }),
    ).toBeVisible({ timeout: 20_000 });
    await expect(
      page.getByText(
        'Truy cập bị từ chối. Bạn không có quyền truy cập chức năng thêm sản phẩm. Chỉ có admin hoặc nhân viên kho mới truy cập được.',
      ),
    ).toBeVisible();
  });

  test('R3 - Đăng nhập thành công với tài khoản NVK và truy cập được chức năng thêm sản phẩm', async ({
    page,
  }) => {
    await loginAndExpectSuccess(page, 'user2@gmail.com', 'user2@gmail.com');

    await expect(page.getByText('user2@gmail.com').first()).toBeVisible({ timeout: 20_000 });

    await page.goto('/dashboard/products/add', { waitUntil: 'domcontentloaded' });
    await expect(page.getByText('Thêm sản phẩm mới')).toBeVisible({ timeout: 20_000 });

    await page.goto('/dashboard/products/categories', { waitUntil: 'domcontentloaded' });
    await expect(
      page.getByRole('heading', { name: 'Truy cập bị từ chối' }),
    ).toBeVisible({ timeout: 20_000 });
  });

  test('R4 - Username không tồn tại thì hệ thống từ chối đăng nhập', async ({ page }) => {
    await gotoSigninPage(page);
    await submitSignin(page, 'abcxyz@gmail.com', '123456');

    await expect(await waitForSigninOutcome(page)).toBe('error');
    await expect(page.getByText('Email hoặc mật khẩu không chính xác.')).toBeVisible({
      timeout: 20_000,
    });
  });

  test('R5 - Sai mật khẩu thì hệ thống từ chối đăng nhập', async ({ page }) => {
    await gotoSigninPage(page);
    await submitSignin(page, 'user1@gmail.com', 'user2@');

    await expect(await waitForSigninOutcome(page)).toBe('error');
    await expect(page.getByText('Email hoặc mật khẩu không chính xác.')).toBeVisible({
      timeout: 20_000,
    });
  });

  test('R6 - Tài khoản đã bị khóa thì hiển thị popup khóa tài khoản', async ({ page }) => {
    await gotoSigninPage(page);
    await submitSignin(page, 'user5@gmail.com', 'user5@gmail.com');

    await expect(await waitForSigninOutcome(page)).toBe('locked');
    await expect(page.getByText('Tài khoản user5@gmail.com đã bị khóa vì lý do bảo mật.')).toBeVisible({
      timeout: 20_000,
    });
    await expect(page.getByRole('link', { name: 'Lấy lại mật khẩu' })).toBeVisible();
  });

  test('R7 - Tài khoản inactive bị từ chối đăng nhập theo hành vi hiện tại của môi trường deploy', async ({
    page,
  }) => {
    await gotoSigninPage(page);
    await submitSignin(page, 'vandinh822005@gmail.com', '123456');

    await expect(await waitForSigninOutcome(page)).toBe('error');
    await expect(page.getByText('Email hoặc mật khẩu không chính xác.')).toBeVisible({
      timeout: 20_000,
    });
  });
});
