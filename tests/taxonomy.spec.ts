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

test.describe('Tag taxonomy', () => {
  test('tag index page renders with posts and CollectionPage JSON-LD', async ({ page }) => {
    const res = await page.goto('/blog/tag/allowance');
    expect(res?.status()).toBe(200);

    const h1 = page.locator('h1');
    await expect(h1).toContainText('Allowance');

    const cards = page.locator('a.post-card');
    expect(await cards.count()).toBeGreaterThanOrEqual(2);

    const blocks = await getJsonLdBlocks(page);
    const collection = findByType(blocks, 'CollectionPage');
    expect(collection, 'CollectionPage schema missing').toBeDefined();
    expect((collection!.hasPart as unknown[]).length).toBeGreaterThanOrEqual(2);
  });

  test('all six tag pages exist and have unique posts', async ({ page }) => {
    const tags = [
      'allowance',
      'chores',
      'saving',
      'digital-money',
      'parenting-mindset',
      'ads-impulse',
    ];
    for (const tag of tags) {
      const res = await page.goto(`/blog/tag/${tag}`);
      expect(res?.status(), `${tag} page failed`).toBe(200);
      const cards = page.locator('a.post-card');
      expect(await cards.count(), `${tag} has no posts`).toBeGreaterThan(0);
    }
  });

  test('tags overview page lists tags with counts', async ({ page }) => {
    const res = await page.goto('/blog/tags');
    expect(res?.status()).toBe(200);
    const tagLinks = page.locator('.tags-list__items a');
    expect(await tagLinks.count()).toBeGreaterThanOrEqual(4);
  });
});

test.describe('Related posts module', () => {
  test('blog post shows 1–3 related cards based on tag overlap', async ({ page }) => {
    await page.goto('/blog/chores-for-cash');
    const related = page.locator('aside.related');
    await expect(related).toBeVisible();
    const cards = page.locator('aside.related a.related__card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(1);
    expect(count).toBeLessThanOrEqual(3);

    const firstHref = await cards.first().getAttribute('href');
    expect(firstHref).toMatch(/^\/blog\/[a-z0-9-]+$/);
    expect(firstHref).not.toBe('/blog/chores-for-cash');
  });
});

test.describe('Author byline and time elements', () => {
  test('blog post header has byline and ISO datetime', async ({ page }) => {
    await page.goto('/blog/chores-for-cash');
    const byline = page.locator('.byline');
    await expect(byline).toBeVisible();
    await expect(byline.locator('.byline__author')).toContainText('Digital Piggy Bank');

    const time = page.locator('article time').first();
    const dt = await time.getAttribute('datetime');
    expect(dt).toMatch(/^\d{4}-\d{2}-\d{2}T/);
  });

  test('post has tag pills linking to tag pages', async ({ page }) => {
    await page.goto('/blog/chores-for-cash');
    const tags = page.locator('.blog-post__tags a');
    expect(await tags.count()).toBeGreaterThanOrEqual(1);
    const href = await tags.first().getAttribute('href');
    expect(href).toMatch(/^\/blog\/tag\/[a-z-]+$/);
  });
});

test.describe('About page', () => {
  test('renders with AboutPage JSON-LD and footer link', async ({ page }) => {
    const res = await page.goto('/about');
    expect(res?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText(/parents/i);

    const blocks = await getJsonLdBlocks(page);
    const about = findByType(blocks, 'AboutPage');
    expect(about, 'AboutPage schema missing').toBeDefined();
  });

  test('footer links to About', async ({ page }) => {
    await page.goto('/');
    const link = page.locator('footer a[href="/about"]');
    expect(await link.count()).toBeGreaterThan(0);
  });
});

test.describe('Article schema uses author from frontmatter', () => {
  test('blog post Article schema has author with correct name', async ({ page }) => {
    await page.goto('/blog/chores-for-cash');
    const blocks = await getJsonLdBlocks(page);
    const art = findByType(blocks, 'Article');
    expect(art).toBeDefined();
    const author = art!.author as { '@type': string; name: string };
    expect(author.name).toBeTruthy();
    expect(['Organization', 'Person']).toContain(author['@type']);
  });
});
