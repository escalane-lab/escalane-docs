# Escalane site

Astro marketing + docs for **Escalane** (escalane harness). Deploys to GitHub Pages from the repo workflow.

```bash
npm ci
npm run dev      # http://localhost:4321/escalane-docs/
npm run build
npm run preview
```

Override base path for a custom domain: `ASTRO_BASE=/ npm run build`.  
Override GitHub link: `PUBLIC_GITHUB_URL=https://github.com/org/repo`.
