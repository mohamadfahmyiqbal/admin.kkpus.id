import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), ['VITE_', 'REACT_APP_', 'HTTPS', 'PORT']);

  const envWithProcess = {
    'process.env': '{}',
  };

  for (const [key, val] of Object.entries(env)) {
    if (/^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(key)) {
      envWithProcess[`process.env.${key}`] = JSON.stringify(val);
    }
  }

  envWithProcess['process.env.NODE_ENV'] = JSON.stringify(mode);
  envWithProcess['process.env.PUBLIC_URL'] = JSON.stringify('');

  return {
    plugins: [
      react(),
      VitePWA({
        registerType: 'prompt',
        injectRegister: 'auto',
        includeAssets: [
          'assets/icons/favicon-32x32.png',
          'assets/icons/favicon-16x16.png',
          'assets/icons/apple-touch-icon.png',
          'robots.txt',
          'push-sw.js',
        ],
        manifest: {
          id: '/?source=pwa',
          name: 'Koperasi Backoffice - Paguyuban Usaha Sukses',
          short_name: 'BO Koperasi',
          description: 'Aplikasi Manajemen Backoffice Koperasi Paguyuban Usaha Sukses Syariah',
          theme_color: '#02113d',
          background_color: '#02113d',
          display: 'standalone',
          orientation: 'any',
          start_url: '/',
          scope: '/',
          lang: 'id',
          dir: 'ltr',
          categories: ['business', 'finance'],
          icons: [
            {
              src: '/assets/icons/favicon-16x16.png',
              sizes: '16x16',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/assets/icons/favicon-32x32.png',
              sizes: '32x32',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/assets/icons/pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/assets/icons/pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'any',
            },
            {
              src: '/assets/icons/pwa-maskable-512x512.png',
              sizes: '512x512',
              type: 'image/png',
              purpose: 'maskable',
            },
          ],
          shortcuts: [
            {
              name: 'Dashboard Utama',
              short_name: 'Dashboard',
              description: 'Buka Dashboard Utama Backoffice',
              url: '/',
              icons: [{ src: '/assets/icons/pwa-192x192.png', sizes: '192x192' }],
            },
          ],
        },
        workbox: {
          importScripts: ['/push-sw.js'],
          // Precache essential code, styles, and vector fonts only
          globPatterns: ['**/*.{js,css,html,svg,woff2}'],
          globIgnores: ['**/masjid*.*'],
          cleanupOutdatedCaches: true,
          navigateFallback: '/index.html',
          runtimeCaching: [
            // 1. Backend API (Cross-Origin & Same-Origin): NetworkOnly (never cache sensitive data)
            {
              urlPattern: ({ url }) =>
                url.origin === 'https://api.kkpus.id' ||
                url.origin === 'https://localhost:3445' ||
                url.pathname.startsWith('/api/'),
              handler: 'NetworkOnly',
            },
            // 2. Images & media: StaleWhileRevalidate with cache expiration
            {
              urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|ico)$/i,
              handler: 'StaleWhileRevalidate',
              options: {
                cacheName: 'app-images-cache',
                expiration: {
                  maxEntries: 80,
                  maxAgeSeconds: 30 * 24 * 60 * 60, // 30 days
                },
              },
            },
          ],
        },
        devOptions: {
          enabled: false,
        },
      }),
    ],
    define: envWithProcess,
    resolve: {
      alias: {
        'src': path.resolve(import.meta.dirname, './src'),
      },
    },
    server: {
      port: 3001,
      open: false,
    },
    test: {
      globals: true,
      environment: "jsdom",
      setupFiles: ["./src/setupTests.js"],
      include: ["src/**/*.test.{js,jsx}"],
      pool: "threads",
      poolOptions: {
        threads: {
          singleThread: true,
        },
      },
    },
    build: {
      outDir: 'dist',
      chunkSizeWarningLimit: 2000,
    },
  };
});
