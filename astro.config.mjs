import { defineConfig } from 'astro/config';

// Configure base/site from env for GitHub Pages compatibility
// - BASE_URL: e.g. "/your-repo/" on Pages, "/" locally
// - SITE: e.g. "https://<user>.github.io/<repo>/"
const BASE_URL = process.env.BASE_URL ?? '/';
const SITE = process.env.SITE ?? 'http://localhost:4321';

export default defineConfig({
  site: SITE,
  base: BASE_URL,
  output: 'static'
});
