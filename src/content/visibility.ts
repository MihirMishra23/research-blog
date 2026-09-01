import type { TopicData, WritingData } from './schemas';

function currentBuildIsProduction(): boolean {
  return import.meta.env?.PROD === true;
}

/** Include all writing during development, but only published, non-draft entries in production. */
export function shouldIncludeWriting(
  data: Pick<WritingData, 'status' | 'draft'>,
  isProduction = currentBuildIsProduction(),
): boolean {
  return !isProduction || (data.status === 'published' && data.draft === false);
}

/** Include draft topics during development, but never emit them in production routes or indexes. */
export function shouldIncludeTopic(
  data: Pick<TopicData, 'draft'>,
  isProduction = currentBuildIsProduction(),
): boolean {
  return !isProduction || data.draft === false;
}

/**
 * Keep the current hand-positioned map limited to reviewed, positioned topics.
 * Draft topic routes may exist during development without requiring temporary
 * coordinates. Relationships to hidden drafts are projected out of the map;
 * the source topic metadata remains intact for full reference validation.
 */
export function topicsForCurrentMap<T extends { id: string; data: TopicData }>(
  topics: T[],
): T[] {
  const included = topics.filter((entry) => entry.data.draft === false);
  const includedIds = new Set(included.map((entry) => entry.id));
  const visible = (ids: string[]) => ids.filter((id) => includedIds.has(id));

  return included.map((entry) => ({
    ...entry,
    data: {
      ...entry.data,
      prerequisites: visible(entry.data.prerequisites),
      cameBefore: visible(entry.data.cameBefore),
      leadsTo: visible(entry.data.leadsTo),
      related: visible(entry.data.related),
    },
  }));
}
