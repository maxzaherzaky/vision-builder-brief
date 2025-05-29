import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  // This 'base' path is crucial for GitHub Pages to correctly load assets
  // when your project is hosted at a subpath like 'https://yourusername.github.io/your-repo-name/'
  base: '/vision-builder-brief/', // <--- THIS LINE IS ADDED/UPDATED
  plugins: [react()],
});