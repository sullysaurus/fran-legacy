import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.franlegacy.com',
  integrations: [sitemap({ filter: (page) => !page.includes('/admin/') && !page.endsWith('/seo-dashboard/') })],
});
