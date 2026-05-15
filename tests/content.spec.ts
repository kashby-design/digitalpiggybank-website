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

const NEW_POSTS = [
  'save-spend-give-jars-for-kids',
  'set-up-allowance-in-7-days',
  'cash-vs-digital-vs-debit-for-kids',
  'christmas-birthday-money-for-kids',
  '30-money-terms-by-age-12',
];

test.describe('New Phase 5 blog posts', () => {
  for (const slug of NEW_POSTS) {
    test(`/blog/${slug} renders with valid frontmatter and JSON-LD`, async ({ page }) => {
      const res = await page.goto(`/blog/${slug}`);
      expect(res?.status()).toBe(200);

      expect(await page.locator('h1').count()).toBe(1);

      const title = await page.title();
      expect(title.length).toBeGreaterThan(10);

      const blocks = await getJsonLdBlocks(page);
      const article = findByType(blocks, 'Article');
      expect(article, 'Article schema missing').toBeDefined();
      expect(article!.headline).toBeTruthy();

      const tags = page.locator('.blog-post__tags a');
      expect(await tags.count(), `${slug} should have at least one tag pill`).toBeGreaterThan(0);
    });
  }

  test('all new posts appear in the sitemap', async ({ request }) => {
    const res = await request.get('/sitemap-0.xml');
    expect(res.status()).toBe(200);
    const body = await res.text();
    for (const slug of NEW_POSTS) {
      expect(body, `sitemap missing /blog/${slug}`).toContain(`/blog/${slug}`);
    }
  });

  test('expanded best-age-start-chores has age-by-age table', async ({ page }) => {
    await page.goto('/blog/best-age-start-chores');
    const tables = page.locator('article table');
    expect(await tables.count()).toBeGreaterThanOrEqual(1);
    const cells = page.locator('article table tbody td');
    expect(await cells.count()).toBeGreaterThanOrEqual(15);
  });
});

test.describe('Pillar guide', () => {
  test('/guides/allowance-and-chores-by-age renders with valid schema', async ({ page }) => {
    const res = await page.goto('/guides/allowance-and-chores-by-age');
    expect(res?.status()).toBe(200);
    expect(await page.locator('h1').count()).toBe(1);

    const blocks = await getJsonLdBlocks(page);
    const article = findByType(blocks, 'Article');
    expect(article).toBeDefined();
    const crumbs = findByType(blocks, 'BreadcrumbList');
    expect(crumbs).toBeDefined();
  });

  test('pillar has at least 5 internal links to blog posts', async ({ page }) => {
    await page.goto('/guides/allowance-and-chores-by-age');
    const blogLinks = page.locator('article a[href^="/blog/"]');
    const count = await blogLinks.count();
    expect(count, 'pillar should link to ≥5 related posts').toBeGreaterThanOrEqual(5);
  });

  test('pillar appears in sitemap', async ({ request }) => {
    const res = await request.get('/sitemap-0.xml');
    const body = await res.text();
    expect(body).toContain('/guides/allowance-and-chores-by-age');
  });
});

test.describe('Phase 1 meta description rewrites are live', () => {
  test('digital-money meta description matches Phase 1 rewrite', async ({ page }) => {
    await page.goto('/blog/digital-money');
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toContain("When money lives on a screen");
    expect(desc?.length ?? 0).toBeLessThanOrEqual(160);
  });

  test('help-your-kid-see-through-ads meta description matches Phase 1 rewrite', async ({ page }) => {
    await page.goto('/blog/help-your-kid-see-through-ads');
    const desc = await page.locator('meta[name="description"]').getAttribute('content');
    expect(desc).toContain('million ads');
    expect(desc?.length ?? 0).toBeLessThanOrEqual(160);
  });
});
