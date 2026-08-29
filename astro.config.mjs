// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import { unified } from '@astrojs/markdown-remark';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';
import { siteConfig } from './src/config/site';

/** @type {Record<string, string>} */
const languageNames = {
  bash: 'Shell',
  css: 'CSS',
  html: 'HTML',
  javascript: 'JavaScript',
  js: 'JavaScript',
  json: 'JSON',
  jsx: 'JSX',
  markdown: 'Markdown',
  md: 'Markdown',
  python: 'Python',
  py: 'Python',
  shell: 'Shell',
  ts: 'TypeScript',
  tsx: 'TSX',
  typescript: 'TypeScript',
  yaml: 'YAML',
  yml: 'YAML',
};

/** @type {import('shiki').ShikiTransformer} */
const codeBlockMetadata = {
  name: 'research-blog:code-block-metadata',
  pre(node) {
    const language = this.options.lang || 'text';
    const label = languageNames[language] ?? language.toUpperCase();

    node.properties['data-language'] = language;
    node.properties['data-language-label'] = label;
    node.properties['aria-label'] = `${label} code example`;
    node.properties.tabindex = 0;
  },
};

export default defineConfig({
  site: siteConfig.deployment.origin,
  base: siteConfig.deployment.base,
  output: 'static',
  integrations: [mdx()],
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    syntaxHighlight: 'shiki',
    shikiConfig: {
      themes: {
        light: 'github-light',
        dark: 'github-dark',
      },
      defaultColor: false,
      wrap: false,
      transformers: [codeBlockMetadata],
    },
  },
});
