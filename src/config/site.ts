const customDomain: string | null = null;
const githubPagesOrigin = 'https://mihirmishra23.github.io';
const githubPagesBase = '/research-blog';

const deploymentOrigin = customDomain ?? githubPagesOrigin;
const deploymentBase = customDomain ? '/' : githubPagesBase;

export const siteConfig = {
  title: 'The LLM Map',
  description: 'Mihir Mishra’s LLM concept map and research writing.',
  deployment: {
    customDomain,
    origin: deploymentOrigin,
    base: deploymentBase,
    url: new URL(
      `${deploymentBase.replace(/^\//, '')}/`,
      `${deploymentOrigin}/`,
    ).toString(),
  },
} as const;

/** Prefix a root-relative internal path with the configured deployment base. */
export function sitePath(path = '/'): string {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  if (siteConfig.deployment.base === '/') {
    return normalizedPath;
  }

  if (normalizedPath === '/') {
    return `${siteConfig.deployment.base}/`;
  }

  return `${siteConfig.deployment.base}${normalizedPath}`;
}

export function siteHref(href: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(href)) {
    return href;
  }

  return sitePath(href);
}
