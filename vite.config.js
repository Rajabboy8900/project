import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  // root: 'public',  <- O‘chirish kerak
  build: {
    outDir: 'dist',  // root papka ichida dist hosil bo‘ladi
  },
  server: {
    port: 5173,
    host: true,
  },
});
