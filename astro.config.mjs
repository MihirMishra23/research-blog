// @ts-check
import { defineConfig } from 'astro/config';
import { siteConfig } from './src/config/site';

export default defineConfig({
  site: siteConfig.deployment.origin,
  base: siteConfig.deployment.base,
  output: 'static',
});
