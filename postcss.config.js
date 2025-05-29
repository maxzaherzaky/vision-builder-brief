import tailwindcss from '@tailwindcss/postcss'; // Corrected import for Vite
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    tailwindcss(),
    autoprefixer(),
  ],
};