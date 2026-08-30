const customDomain: string | null = null;
const githubPagesOrigin = 'https://mihirmishra23.github.io';
const githubPagesBase = '/research-blog';

const deploymentOrigin = customDomain ?? githubPagesOrigin;
const deploymentBase = customDomain ? '/' : githubPagesBase;

export const siteConfig = {
  title: 'The LLM Map',
  description:
    'An evolving map of how modern language models are trained, adapted, evaluated, and served.',
  locale: 'en_US',
  socialImage: '/social-preview.png',
  author: {
    name: 'Mihir Mishra',
    email: null,
    github: 'https://github.com/MihirMishra23',
    googleScholar: null,
    linkedIn: null,
    x: null,
    cv: null,
  },
  repository: {
    owner: 'MihirMishra23',
    name: 'research-blog',
    url: 'https://github.com/MihirMishra23/research-blog',
  },
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

/** Resolve internal root-relative links while leaving absolute URLs and anchors alone. */
export function siteHref(href: string): string {
  if (/^(?:[a-z][a-z\d+.-]*:|#)/i.test(href)) {
    return href;
  }

  return sitePath(href);
}
