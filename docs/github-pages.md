# GitHub Pages deployment

The initial production URL is expected to be:

```text
https://mihirmishra23.github.io/research-blog/
```

Astro's deployment origin and repository base path are defined together in `src/config/site.ts`. Components should generate internal links and public-asset URLs with `sitePath()` rather than hard-coding `/research-blog`.

## Required repository settings

1. Open the repository at `https://github.com/MihirMishra23/research-blog`.
2. Go to **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Go to **Settings → Actions → General** and confirm GitHub Actions are enabled for the repository. If action use is restricted, allow:
   - `actions/checkout`
   - `withastro/action`
   - `actions/deploy-pages`
5. No repository-wide read/write workflow permission is required. The deployment workflow grants only `contents: read`, `pages: write`, and `id-token: write`.

The repository must also be public, or the GitHub account/organization plan must support Pages for private repositories.

## Deployment workflow

`.github/workflows/deploy.yml` runs on every push to `main` and can also be started manually from the repository's **Actions** tab. It:

1. checks out the repository;
2. detects npm from `package-lock.json`;
3. installs dependencies and runs the Astro production build with Node.js 22;
4. uploads the generated static site;
5. deploys the artifact to the `github-pages` environment.

The workflow and `astro.config.mjs` both use the repository-root Astro project and the standard `dist/` build output.

## Local verification

Use Node.js 22, then run:

```bash
npm install
npm run check
npm run build
npm run preview
```

Because the Pages base is configured during local development too, the site is served below `/research-blog/`. Internal URLs should begin with `/research-blog/` in the generated HTML.

## Future custom domain

When the final domain is known:

1. set `customDomain` in `src/config/site.ts` to the full HTTPS origin, such as `https://example.com`;
2. add `public/CNAME` containing only the hostname, such as `example.com`;
3. configure the domain in **Settings → Pages → Custom domain**;
4. configure the required DNS records with the DNS provider;
5. enable **Enforce HTTPS** after GitHub provisions the certificate;
6. rebuild and verify that generated internal URLs use `/` instead of `/research-blog`.

The shared configuration automatically changes Astro's `base` to `/` when `customDomain` is set.

## References

- [Astro: Deploy to GitHub Pages](https://docs.astro.build/en/guides/deploy/github/)
- [Astro configuration reference](https://docs.astro.build/en/reference/configuration-reference/)
- [GitHub: Configuring a publishing source](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)
