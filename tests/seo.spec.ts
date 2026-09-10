import { test, expect, type Page } from '@playwright/test';

// Must match `site` in astro.config.mjs and SITE_URL in src/lib/schema.ts.
const SITE_ORIGIN = 'https://www.digitalpiggybank.com';

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

test.describe('Homepage', () => {
  test('has exactly one h1', async ({ page }) => {
    await page.goto('/');
    const count = await page.locator('h1').count();
    expect(count).toBe(1);
  });

  test('title is <= 60 characters', async ({ page }) => {
    await page.goto('/');
    const title = await page.title();
    expect(title.length).toBeLessThanOrEqual(60);
    expect(title.length).toBeGreaterThan(10);
  });

  test('canonical link is present', async ({ page }) => {
    await page.goto('/');
    const href = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(href).toMatch(new RegExp(`^${SITE_ORIGIN}`));
  });

  // The FAQ (and its FAQPage schema) moved to its own /faq page in 9ac8c9f,
  // so it is asserted in the "FAQ page" block below rather than here.
  test('has Organization, WebSite, and MobileApplication JSON-LD', async ({ page }) => {
    await page.goto('/');
    const blocks = await getJsonLdBlocks(page);

    const org = findByType(blocks, 'Organization');
    const site = findByType(blocks, 'WebSite');
    const app = findByType(blocks, 'MobileApplication');

    expect(org, 'Organization schema missing').toBeDefined();
    expect(site, 'WebSite schema missing').toBeDefined();
    expect(app, 'MobileApplication schema missing').toBeDefined();

    expect(org!.name).toBe('Digital Piggy Bank');
    expect(Array.isArray(org!.sameAs)).toBe(true);
    expect(org!.url).toBe(SITE_ORIGIN);

    expect(app!.applicationCategory).toBe('FinanceApplication');
    expect(Array.isArray(app!.offers)).toBe(true);
  });

  test('no unexpected console errors on load', async ({ page }) => {
    const jsErrors: string[] = [];
    const failedRequests: string[] = [];

    page.on('pageerror', (err) => jsErrors.push(err.message));
    page.on('response', async (res) => {
      if (res.status() < 400) return;
      const url = res.url();
      // Vercel analytics endpoint is only available in deployed Vercel envs,
      // not in `astro preview` — its 404 is expected locally.
      if (url.includes('_vercel/insights')) return;
      if (url.includes('va.vercel-scripts.com')) return;
      // Clarity's collect endpoints can 4xx when called from localhost, which
      // the Clarity project does not recognize as a valid origin.
      if (url.includes('clarity.ms')) return;
      failedRequests.push(`${res.status()} ${url}`);
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    expect(jsErrors, 'unexpected JS errors').toEqual([]);
    expect(failedRequests, 'unexpected failed requests').toEqual([]);
  });
});

test.describe('FAQ page', () => {
  test('has FAQPage and BreadcrumbList JSON-LD on the canonical origin', async ({ page }) => {
    await page.goto('/faq');
    const blocks = await getJsonLdBlocks(page);

    const faq = findByType(blocks, 'FAQPage');
    const crumbs = findByType(blocks, 'BreadcrumbList');

    expect(faq, 'FAQPage schema missing').toBeDefined();
    expect(crumbs, 'BreadcrumbList schema missing').toBeDefined();

    const faqEntities = faq!.mainEntity as { '@type': string; name: string }[];
    expect(faqEntities.length).toBeGreaterThanOrEqual(3);
    expect(faqEntities[0]['@type']).toBe('Question');

    // Breadcrumb URLs must use the www canonical origin, not the bare domain.
    const items = crumbs!.itemListElement as { item: string }[];
    for (const item of items) {
      expect(item.item).toContain(SITE_ORIGIN);
    }
  });
});

test.describe('Blog index', () => {
  test('renders with valid title and canonical', async ({ page }) => {
    const response = await page.goto('/blog');
    expect(response?.status()).toBe(200);
    const title = await page.title();
    expect(title.length).toBeLessThanOrEqual(60);
    const canon = await page.locator('link[rel="canonical"]').getAttribute('href');
    expect(canon).toContain('/blog');
  });
});

test.describe('Sample blog post', () => {
  const slug = 'chores-for-cash';

  test('has exactly one h1', async ({ page }) => {
    await page.goto(`/blog/${slug}`);
    expect(await page.locator('h1').count()).toBe(1);
  });

  test('has Article and BreadcrumbList JSON-LD', async ({ page }) => {
    await page.goto(`/blog/${slug}`);
    const blocks = await getJsonLdBlocks(page);

    const article = findByType(blocks, 'Article');
    const crumbs = findByType(blocks, 'BreadcrumbList');

    expect(article, 'Article schema missing').toBeDefined();
    expect(crumbs, 'BreadcrumbList schema missing').toBeDefined();

    expect(article!.headline).toBeTruthy();
    expect(article!.datePublished).toBeTruthy();

    const items = crumbs!.itemListElement as { position: number; name: string }[];
    expect(items.length).toBe(3);
    expect(items[0].name).toBe('Home');
    expect(items[1].name).toBe('Blog');
  });

  test('OG image is set', async ({ page }) => {
    await page.goto(`/blog/${slug}`);
    const og = await page.locator('meta[property="og:image"]').getAttribute('content');
    expect(og).toBeTruthy();
    expect(og).toMatch(/^https?:/);
  });

  test('has internal "Keep reading" links to other posts', async ({ page }) => {
    await page.goto(`/blog/${slug}`);
    const links = page.locator('article a[href^="/blog/"]');
    expect(await links.count()).toBeGreaterThanOrEqual(3);
  });
});

test.describe('404 page', () => {
  test('renders custom 404 with branded header and footer', async ({ page }) => {
    const response = await page.goto('/this-does-not-exist-123', {
      waitUntil: 'domcontentloaded',
    });
    expect(response?.status()).toBe(404);
    await expect(page.locator('h1')).toContainText(/Lost your piggy/i);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
  });
});

test.describe('robots.txt and sitemap', () => {
  test('robots.txt is accessible and references sitemap', async ({ request }) => {
    const res = await request.get('/robots.txt');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toMatch(/User-agent: \*/);
    expect(body).toContain(`Sitemap: ${SITE_ORIGIN}/sitemap-index.xml`);
  });

  test('sitemap-index.xml is accessible', async ({ request }) => {
    const res = await request.get('/sitemap-index.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    expect(body).toContain('<sitemapindex');
  });
});
