// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';

// Project Pages default: /escalane-docs/ — override with ASTRO_BASE=/ for custom domain.
const base = process.env.ASTRO_BASE ?? '/escalane-docs/';

export default defineConfig({
	site: process.env.ASTRO_SITE ?? 'https://example.github.io',
	base,
	integrations: [mdx()],
	trailingSlash: 'always',
});
