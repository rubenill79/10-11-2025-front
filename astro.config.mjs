// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import vercel from '@astrojs/vercel';

// https://astro.build/config
export default defineConfig({
  output: "server",
  site: 'https://10-11-2025-front.vercel.app',
  adapter: vercel({
    // Astro 5 detectará automáticamente el servicio de imágenes de Vercel
    // si el adaptador está presente.
    imagesConfig: {
      domains: [],
      sizes: [640, 750, 828, 1080, 1200, 1920, 2048],
    },
  }),
  vite: {
    plugins: [tailwindcss()]
  },
  i18n: {
    defaultLocale: "en",
    locales: ["es", "en"],
    routing: {
      prefixDefaultLocale: true
    }
  }
});