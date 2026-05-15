import { test, expect, type Page } from '@playwright/test';

async function getJsonLdBlocks(page: Page): Promise<unknown[]> {
  const raw = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  return raw.map((t) => JSON.parse(t));
}

function findByType(blocks: unknown[], type: string): Record<string, unknown> | undefined {
  return blocks.find(
    (b): b is Record<string, unknown> =>
      typeof b === 'object' && b !== null && (b as { '@type'?: string })['@type'] === type
  );
}

const pages = [
  { path: '/pricing', headingMatch: /one price/i, schemaType: 'Product' as const },
  { path: '/features', headingMatch: /everything you need/i, schemaType: null },
  { path: '/vs/allowance-apps', headingMatch: /allowance apps compared/i, schemaType: 'BreadcrumbList' as const },
];

for (const p of pages) {
  test.describe(`Landing page ${p.path}`, () => {
    test('renders with single H1 and valid canonical', async ({ page }) => {
      const res = await page.goto(p.path);
      expect(res?.status()).toBe(200);
      expect(await page.locator('h1').count()).toBe(1);
      await expect(page.locator('h1')).toHaveText(p.headingMatch);

      const canon = await page.locator('link[rel="canonical"]').getAttribute('href');
      expect(canon).toContain(p.path);

      const title = await page.title();
      expect(title.length).toBeLessThanOrEqual(70);
      expect(title.length).toBeGreaterThan(10);
    });

    if (p.schemaType) {
      test(`has ${p.schemaType} JSON-LD`, async ({ page }) => {
        await page.goto(p.path);
        const blocks = await getJsonLdBlocks(page);
        const schema = findByType(blocks, p.schemaType);
        expect(schema, `${p.schemaType} schema missing on ${p.path}`).toBeDefined();
      });
    }

    test('no unexpected console errors / failed requests', async ({ page }) => {
      const failed: string[] = [];
      const errs: string[] = [];
      page.on('pageerror', (e) => errs.push(e.message));
      page.on('response', (res) => {
        if (res.status() < 400) return;
        const url = res.url();
        if (url.includes('_vercel/insights') || url.includes('va.vercel-scripts.com')) return;
        failed.push(`${res.status()} ${url}`);
      });
      await page.goto(p.path);
      await page.waitForLoadState('networkidle');
      expect(errs).toEqual([]);
      expect(failed).toEqual([]);
    });
  });
}

test.describe('Pricing page specifics', () => {
  test('Product schema has both monthly and annual offers', async ({ page }) => {
    await page.goto('/pricing');
    const blocks = await getJsonLdBlocks(page);
    const product = findByType(blocks, 'Product');
    expect(product).toBeDefined();
    const offers = product!.offers as { price: string; priceCurrency: string }[];
    expect(offers.length).toBe(2);
    const prices = offers.map((o) => o.price).sort();
    expect(prices).toEqual(['1.00', '7.99']);
  });
});

test.describe('Comparison page specifics', () => {
  test('table renders with five competitor columns and feature rows', async ({ page }) => {
    await page.goto('/vs/allowance-apps');
    const headers = page.locator('table thead th');
    // 1 empty + 5 product cols = 6
    expect(await headers.count()).toBe(6);

    const rows = page.locator('table tbody tr');
    const rowCount = await rows.count();
    expect(rowCount).toBeGreaterThanOrEqual(8);
  });

  test('Digital Piggy Bank column is highlighted', async ({ page }) => {
    await page.goto('/vs/allowance-apps');
    const dpbHeader = page.locator('table thead th.is-highlight');
    expect(await dpbHeader.count()).toBe(1);
    await expect(dpbHeader).toContainText('Digital Piggy Bank');
  });
});

test.describe('Header navigation', () => {
  test('header exposes Features, Pricing, Compare links', async ({ page }) => {
    await page.goto('/');
    await expect(page.locator('header a[href="/features"]')).toHaveCount(1);
    await expect(page.locator('header a[href="/pricing"]')).toHaveCount(1);
    await expect(page.locator('header a[href="/vs/allowance-apps"]')).toHaveCount(1);
  });
});

test.describe('Sitemap includes new pages', () => {
  test('sitemap contains /pricing, /features, /vs/allowance-apps', async ({ request }) => {
    const idxRes = await request.get('/sitemap-index.xml');
    const idx = await idxRes.text();
    const m = idx.match(/<loc>([^<]+sitemap[^<]+)<\/loc>/);
    expect(m).toBeTruthy();
    // Astro sitemap places URLs inside sitemap-0.xml referenced by the index
    const subRes = await request.get('/sitemap-0.xml');
    expect(subRes.status()).toBe(200);
    const sub = await subRes.text();
    for (const path of ['/pricing', '/features', '/vs/allowance-apps']) {
      expect(sub, `sitemap missing ${path}`).toContain(path);
    }
  });
});
