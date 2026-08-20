import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://franlegacy.netlify.app',
  integrations: [sitemap()],
});
