import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import { siteConfig, sitePath } from '../config/site';
import { shouldIncludeWriting } from '../content/visibility';

export async function GET() {
  const writing = (await getCollection('writing'))
    .filter((entry) => shouldIncludeWriting(entry.data, true))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: `${siteConfig.title} · Writing`,
    description: siteConfig.description,
    site: new URL(siteConfig.deployment.url),
    customData: '<language>en-us</language>',
    items: writing.map((entry) => ({
      title: entry.data.title,
      description: entry.data.description,
      pubDate: entry.data.date,
      link: sitePath(`/writing/${entry.id}/`),
      categories: [...entry.data.topics, ...entry.data.tags],
    })),
  });
}
