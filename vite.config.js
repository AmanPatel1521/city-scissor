import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          animations: ['gsap', '@gsap/react', 'animejs'],
          vendor: ['react', 'react-dom', 'lucide-react', 'canvas-confetti'],
        }
      }
    }
  }
});
