import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // This 'base' path is crucial for GitHub Pages to correctly load assets
  // when your project is hosted at a subpath like 'https://yourusername.github.io/vision-builder-brief/'
  base: '/vision-builder-brief/',
  plugins: [react()],
});