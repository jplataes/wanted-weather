import { defineConfig } from 'vite';

// Relative base so the build works on GitHub Pages under /wanted-weather/.
// The style guide in /muestra is a separate page and is not part of the app build.
export default defineConfig({
  base: './',
  build: {
    target: 'es2022',
  },
});
