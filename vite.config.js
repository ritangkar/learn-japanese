import { defineConfig } from 'vite';

// base './' keeps every URL relative so the app works under /<repo>/ on GitHub Pages (R004 / AC01).
export default defineConfig({
  base: './',
  build: { target: 'es2022', outDir: 'dist', emptyOutDir: true, cssCodeSplit: false, assetsInlineLimit: 0, modulePreload: { polyfill: false }, sourcemap: false },
  server: { port: 5173 },
});
