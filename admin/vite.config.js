import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const API = 'http://127.0.0.1:4000';

export default defineConfig(({ command }) => ({
  // Serverda admin panel /admin/ manzilida ochiladi
  base: command === 'build' ? '/admin/' : '/',
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5174,
    strictPort: true,
    open: true,
    proxy: {
      '/api': API,
      '/images': API,
      '/uploads': API,
    },
  },
}));
