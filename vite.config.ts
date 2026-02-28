import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/letter-drop/',
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
