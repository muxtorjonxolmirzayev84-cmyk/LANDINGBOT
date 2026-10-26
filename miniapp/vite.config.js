import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const API = 'http://127.0.0.1:4000';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    allowedHosts: true, // ngrok domenlari uchun
    proxy: {
      '/api': API,
      '/images': API,
      '/uploads': API,
    },
  },
});
