import tailwindcss from 'tailwindcss';
import nesting from 'tailwindcss/nesting/index.js';
import autoprefixer from 'autoprefixer';

const config = {
  plugins: [
    nesting,
    tailwindcss,
    autoprefixer,
  ],
};
export default config;
