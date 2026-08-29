import type { WritingData } from './schemas';
import type { ArticleNavigationData, ContentLink } from '../types/content-ui';

export interface ArticleNavigationRecord extends ContentLink {
  id: string;
}

type NavigationMetadata = Pick<WritingData, 'previous' | 'next' | 'related'>;

/** Resolve frontmatter IDs once routes have loaded the visible writing collection. */
export function resolveArticleNavigation(
  metadata: NavigationMetadata,
  articles: ArticleNavigationRecord[],
): ArticleNavigationData {
  const byId = new Map(articles.map((article) => [article.id, article]));
  const resolve = (id: string | null | undefined) => {
    if (!id) return undefined;
    const article = byId.get(id);
    if (!article) return undefined;

    const { title, href, description } = article;
    return { title, href, description };
  };

  return {
    previous: resolve(metadata.previous),
    next: resolve(metadata.next),
    related: metadata.related.flatMap((id) => {
      const article = resolve(id);
      return article ? [article] : [];
    }),
  };
}
