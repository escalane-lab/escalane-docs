/** Site-wide marketing + docs config. */
export const brand = 'Escalane';
export const tagline = 'The model chooses; the harness is the only thing that runs.';
export const categoryLine = 'Decide & Act for catalog-bound ops';
/** Branding analogue to “agent = LLM + tools”. */
export const formula = 'Escalane = Decide + Act';
export const formulaAgent = 'Agent = LLM + tools';
export const formulaDetail = 'System One + catalog harness';
export const packageName = 'escalane';
export const githubUrl =
	import.meta.env.PUBLIC_GITHUB_URL ?? 'https://github.com/escalane-lab/escalane';

export const nav = [
	{ href: '/', label: 'Home' },
	{ href: '/how/', label: 'How' },
	{ href: '/use-cases/', label: 'Use cases' },
	{ href: '/docs/', label: 'Docs' },
] as const;

export const docsNav = [
	{ href: '/docs/', label: 'Overview' },
	{ href: '/docs/quick-start/', label: 'Quick start' },
	{ href: '/docs/catalogs/', label: 'Catalogs' },
	{ href: '/docs/gates/', label: 'Gates' },
	{ href: '/docs/integrate/', label: 'Integrate' },
	{ href: '/docs/claims/', label: 'Claims' },
] as const;
