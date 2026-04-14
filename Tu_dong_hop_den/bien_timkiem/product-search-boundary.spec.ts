import { expect, Page, test } from '@playwright/test';

const SEARCH_PAGE_URL = '/dashboard/products/search';

async function waitForSearchPageReady(page: Page) {
  await page.goto(SEARCH_PAGE_URL);

  await page.getByText('Đang tải...').waitFor({ state: 'hidden', timeout: 60_000 }).catch(() => {});

  await expect(
    page.getByRole('heading', { name: 'Tìm kiếm sản phẩm' }),
  ).toBeVisible({ timeout: 60_000 });

  await expect(page.getByText(/Hiển thị\s+\d+\s+kết quả/)).toBeVisible({
    timeout: 60_000,
  });
}

async function getResultCount(page: Page) {
  const summaryText = await page
    .getByText(/Hiển thị\s+\d+\s+kết quả/)
    .innerText();

  const match = summaryText.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

async function getLongestVisibleProductName(page: Page) {
  const productNames = (await page.locator('div.cursor-pointer h3').allInnerTexts())
    .map((name) => name.replace(/\s+/g, ' ').trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length);

  expect(productNames.length).toBeGreaterThan(0);
  return productNames[0];
}

async function buildKeyword(page: Page, length: number) {
  const longestProductName = await getLongestVisibleProductName(page);

  if (longestProductName.length >= length) {
    return {
      keyword: longestProductName.slice(0, length),
      productName: longestProductName,
      shouldHaveResults: true,
    };
  }

  return {
    keyword: 'a'.repeat(length),
    productName: null,
    shouldHaveResults: false,
  };
}

async function submitSearch(page: Page, keyword: string) {
  const searchInput = page.locator('#search');
  await searchInput.fill(keyword);
  await page.getByRole('button', { name: 'Tìm' }).click();
}

async function expectSearchHandled(page: Page, keyword: string) {
  const searchInput = page.locator('#search');

  await submitSearch(page, keyword);

  const currentUrl = new URL(page.url());
  expect(currentUrl.pathname).toBe('/dashboard/products/search');
  expect(currentUrl.searchParams.get('q') ?? '').toBe(keyword);
  await expect(searchInput).toHaveValue(keyword);

  const resultCount = await getResultCount(page);
  expect(resultCount).toBeGreaterThanOrEqual(0);

  if (resultCount === 0) {
    await expect(page.getByText('Không tìm thấy sản phẩm nào phù hợp.')).toBeVisible();
  } else {
    await expect(page.locator('div.cursor-pointer h3').first()).toBeVisible();
  }

  return resultCount;
}

test.describe('Tìm kiếm sản phẩm - kiểm thử giá trị biên', () => {
  test.describe.configure({ mode: 'serial' });
  test.setTimeout(90_000);

  test('TC_Search_001 - Từ khóa 1 ký tự vẫn trả về kết quả phù hợp', async ({
    page,
  }) => {
    await waitForSearchPageReady(page);

    const initialCount = await getResultCount(page);
    expect(initialCount).toBeGreaterThan(0);

    const { keyword, productName } = await buildKeyword(page, 1);
    const resultCount = await expectSearchHandled(page, keyword);

    expect(resultCount).toBeGreaterThan(0);
    await expect(page.getByText(productName!, { exact: true }).first()).toBeVisible();
  });

  test('TC_Search_002 - Từ khóa 2 ký tự vẫn trả về kết quả phù hợp', async ({
    page,
  }) => {
    await waitForSearchPageReady(page);

    const initialCount = await getResultCount(page);
    expect(initialCount).toBeGreaterThan(0);

    const { keyword, productName } = await buildKeyword(page, 2);
    const resultCount = await expectSearchHandled(page, keyword);

    expect(resultCount).toBeGreaterThan(0);
    await expect(page.getByText(productName!, { exact: true }).first()).toBeVisible();
  });

  test('TC_Search_003 - Từ khóa 25 ký tự được hệ thống xử lý ổn định', async ({
    page,
  }) => {
    await waitForSearchPageReady(page);

    const { keyword, productName, shouldHaveResults } = await buildKeyword(page, 25);
    const resultCount = await expectSearchHandled(page, keyword);

    if (shouldHaveResults) {
      expect(resultCount).toBeGreaterThan(0);
      await expect(page.getByText(productName!, { exact: true }).first()).toBeVisible();
    }
  });

  test('TC_Search_004 - Từ khóa 254 ký tự được hệ thống xử lý ổn định', async ({
    page,
  }) => {
    await waitForSearchPageReady(page);

    await expectSearchHandled(page, 'a'.repeat(254));
  });

  test('TC_Search_005 - Từ khóa 255 ký tự được hệ thống xử lý ổn định', async ({
    page,
  }) => {
    await waitForSearchPageReady(page);

    await expectSearchHandled(page, 'a'.repeat(255));
  });

  test('TC_Search_006 - Từ khóa 256 ký tự vẫn được hệ thống tiếp nhận theo hành vi hiện tại', async ({
    page,
  }) => {
    await waitForSearchPageReady(page);

    await expectSearchHandled(page, 'a'.repeat(256));
  });

  test('TC_Search_007 - Để trống từ khóa thì hiển thị toàn bộ kết quả', async ({
    page,
  }) => {
    await waitForSearchPageReady(page);

    const initialCount = await getResultCount(page);
    expect(initialCount).toBeGreaterThan(0);

    await submitSearch(page, '');

    const currentUrl = new URL(page.url());
    expect(currentUrl.pathname).toBe('/dashboard/products/search');
    expect(currentUrl.searchParams.get('q') ?? '').toBe('');
    await expect(page.locator('#search')).toHaveValue('');
    await expect(page.getByText(/Hiển thị\s+\d+\s+kết quả/)).toBeVisible();
    await expect(await getResultCount(page)).toBe(initialCount);
  });
});
