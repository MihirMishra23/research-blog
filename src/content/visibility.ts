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
