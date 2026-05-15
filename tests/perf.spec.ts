import { test, expect } from '@playwright/test';

test.describe('Image optimization', () => {
  test('blog post hero uses AVIF with srcset and is eager-loaded', async ({ page }) => {
    await page.goto('/blog/chores-for-cash');
    const hero = page.locator('.blog-post__hero img').first();
    await expect(hero).toBeVisible();

    const src = await hero.getAttribute('src');
    expect(src, 'src should point to AVIF asset').toMatch(/\.avif$/);

    const srcset = await hero.getAttribute('srcset');
    expect(srcset, 'srcset present').toBeTruthy();
    expect(srcset).toMatch(/\.avif/);

    const loading = await hero.getAttribute('loading');
    expect(loading).toBe('eager');
  });

  test('blog index post-card images are lazy-loaded AVIF', async ({ page }) => {
    await page.goto('/blog');
    const cardImg = page.locator('a.post-card img').first();
    await expect(cardImg).toBeVisible();
    const src = await cardImg.getAttribute('src');
    expect(src).toMatch(/\.avif$/);
    const loading = await cardImg.getAttribute('loading');
    expect(loading).toBe('lazy');
  });

  test('related posts images are lazy-loaded AVIF', async ({ page }) => {
    await page.goto('/blog/chores-for-cash');
    const rel = page.locator('aside.related img').first();
    await expect(rel).toBeVisible();
    const src = await rel.getAttribute('src');
    expect(src).toMatch(/\.avif$/);
    expect(await rel.getAttribute('loading')).toBe('lazy');
  });

  test('homepage feature images are optimized AVIF', async ({ page }) => {
    await page.goto('/');
    const featureImg = page.locator('.feature__image img').first();
    await expect(featureImg).toBeVisible();
    const src = await featureImg.getAttribute('src');
    expect(src).toMatch(/\.avif$/);
  });

  test('hero AVIF response served with correct content-type', async ({ page, request }) => {
    await page.goto('/blog/chores-for-cash');
    const src = await page.locator('.blog-post__hero img').first().getAttribute('src');
    expect(src).toBeTruthy();
    const res = await request.get(src!);
    expect(res.status()).toBe(200);
    expect(res.headers()['content-type']).toMatch(/image\/avif/);
  });
});

test.describe('Font delivery', () => {
  test('no Google Fonts requests are made on homepage', async ({ page }) => {
    const googleFontRequests: string[] = [];
    page.on('request', (req) => {
      const url = req.url();
      if (url.includes('fonts.googleapis.com') || url.includes('fonts.gstatic.com')) {
        googleFontRequests.push(url);
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(googleFontRequests).toEqual([]);
  });

  test('self-hosted fonts are served from the same origin', async ({ page }) => {
    const fontRequests: { url: string; status: number }[] = [];
    page.on('response', (res) => {
      const ct = res.headers()['content-type'] ?? '';
      if (ct.startsWith('font/') || res.url().match(/\.(woff2?|ttf|otf)(\?|$)/)) {
        fontRequests.push({ url: res.url(), status: res.status() });
      }
    });
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    expect(fontRequests.length, 'at least one font loaded').toBeGreaterThan(0);
    for (const f of fontRequests) {
      expect(new URL(f.url).host).toBe('localhost:4321');
      expect(f.status).toBe(200);
    }
  });
});
