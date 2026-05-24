import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.digitalpiggybank.com',
  adapter: vercel(),
  integrations: [sitemap()],
});
