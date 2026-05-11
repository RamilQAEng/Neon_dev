import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  publicDir: 'public',
  optimizeDeps: {
    entries: ['index.html'],
    exclude: ['/assets/index-8EiOxp41.js']
  },
  build: {
    modulePreload: false,
    outDir: 'dist',
    emptyOutDir: true
  }
});
