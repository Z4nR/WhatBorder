import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    // For Development Only
    // allowedHosts: ['childrens-lit-idea-promo.trycloudflare.com'],
  },
  plugins: [react()],
});
