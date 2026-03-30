import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import cloudflare from '@astrojs/cloudflare';

export default defineConfig({
  integrations: [react()],
  adapter: cloudflare({
    mode: 'pages',
    platformProxy: {
      enabled: true
    }
  }),
  output: 'hybrid',
  site: 'https://vaughnsterling.com'
});
