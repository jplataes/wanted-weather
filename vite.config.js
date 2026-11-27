import { defineConfig } from 'vite';

/**
 * Content Security Policy: the page may only load its own files and only talk to its own
 * server and the weather proxy (the Cloudflare Worker). Added at build time because the
 * proxy address comes from an environment variable.
 */
function contentSecurityPolicy() {
  return {
    name: 'content-security-policy',
    transformIndexHtml(html, ctx) {
      const proxy = process.env.VITE_PROXY_URL ? new URL(process.env.VITE_PROXY_URL).origin : '';
      // In development the app may call OpenWeatherMap directly, and Vite uses a websocket for live reload
      const dev = ctx.server ? 'https://api.openweathermap.org ws: wss:' : '';
      const policy = [
        "default-src 'self'",
        "script-src 'self'",
        "style-src 'self' 'unsafe-inline'",
        "img-src 'self' data: blob:",
        "font-src 'self' data:",
        `connect-src 'self' ${proxy} ${dev}`.replace(/\s+/g, ' ').trim(),
        "media-src 'self' blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; ');
      return html.replace('</title>', `</title>\n  <meta http-equiv="Content-Security-Policy" content="${policy}">`);
    },
  };
}

/**
 * Preload the two fonts the first screen uses (titles and text), so the page doesn't
 * jump when they arrive. Their file names have a hash, so they are found in the build.
 */
function preloadFonts() {
  return {
    name: 'preload-fonts',
    transformIndexHtml: {
      order: 'post',
      handler(html, ctx) {
        if (!ctx.bundle) return html;
        const wanted = [/anton-latin-400-normal.*\.woff2$/, /barlow-latin-700-normal.*\.woff2$/, /barlow-latin-500-normal.*\.woff2$/];
        const files = Object.keys(ctx.bundle).filter((f) => wanted.some((re) => re.test(f)));
        const links = files.map((f) => `<link rel="preload" href="./${f}" as="font" type="font/woff2" crossorigin>`).join('\n  ');
        return html.replace('</title>', `</title>\n  ${links}`);
      },
    },
  };
}

// Relative base so the build works on GitHub Pages under /wanted-weather/.
// The style guide in /muestra is a separate page and is not part of the app build.
export default defineConfig({
  base: './',
  plugins: [contentSecurityPolicy(), preloadFonts()],
  build: {
    target: 'es2022',
  },
});
