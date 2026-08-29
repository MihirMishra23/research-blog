interface TopicReferenceData {
  parent?: string | null;
  prerequisites: string[];
  cameBefore: string[];
  leadsTo: string[];
  related: string[];
}

interface WritingReferenceData {
  topics: string[];
  previous?: string | null;
  next?: string | null;
  related: string[];
}

export interface TopicReferenceRecord {
  id: string;
  data: TopicReferenceData;
}

export interface WritingReferenceRecord {
  id: string;
  data: WritingReferenceData;
}

/** Return actionable cross-entry errors for topic and article frontmatter. */
export function findContentReferenceErrors(
  topics: TopicReferenceRecord[],
  writing: WritingReferenceRecord[],
): string[] {
  const errors: string[] = [];
  const topicById = new Map(topics.map((entry) => [entry.id, entry]));
  const writingById = new Map(writing.map((entry) => [entry.id, entry]));
  const topicFields = [
    'prerequisites',
    'cameBefore',
    'leadsTo',
    'related',
  ] as const;

  for (const topic of topics) {
    const references: Array<readonly [string, string[]]> = topic.data.parent
      ? [['parent', [topic.data.parent]]]
      : [];

    for (const field of topicFields) {
      references.push([field, topic.data[field]]);
    }

    for (const [field, ids] of references) {
      for (const id of ids) {
        if (id === topic.id) {
          errors.push(
            `Topic "${topic.id}" cannot reference itself in ${field}.`,
          );
        } else if (!topicById.has(id)) {
          errors.push(
            `Topic "${topic.id}" references missing topic "${id}" in ${field}.`,
          );
        }
      }
    }

    for (const id of topic.data.related) {
      const target = topicById.get(id);
      if (target && !target.data.related.includes(topic.id)) {
        errors.push(
          `Related topics must be reciprocal: "${id}" does not reference "${topic.id}".`,
        );
      }
    }

    for (const id of topic.data.leadsTo) {
      const target = topicById.get(id);
      if (target && !target.data.cameBefore.includes(topic.id)) {
        errors.push(
          `Progression must be reciprocal: "${id}" does not list "${topic.id}" in cameBefore.`,
        );
      }
    }
  }

  for (const article of writing) {
    for (const topicId of article.data.topics) {
      if (!topicById.has(topicId)) {
        errors.push(
          `Article "${article.id}" references missing topic "${topicId}".`,
        );
      }
    }

    const navigation = [
      ['previous', article.data.previous],
      ['next', article.data.next],
      ...article.data.related.map((id) => ['related', id] as const),
    ] as const;

    for (const [field, id] of navigation) {
      if (!id) continue;
      if (id === article.id) {
        errors.push(
          `Article "${article.id}" cannot reference itself in ${field}.`,
        );
      } else if (!writingById.has(id)) {
        errors.push(
          `Article "${article.id}" references missing article "${id}" in ${field}.`,
        );
      }
    }

    if (article.data.next) {
      const next = writingById.get(article.data.next);
      if (next && next.data.previous !== article.id) {
        errors.push(
          `Article sequence must be reciprocal: "${article.data.next}" does not point back to "${article.id}".`,
        );
      }
    }
  }

  return errors;
}

export function assertContentReferences(
  topics: TopicReferenceRecord[],
  writing: WritingReferenceRecord[],
): void {
  const errors = findContentReferenceErrors(topics, writing);
  if (errors.length > 0) {
    throw new Error(`Invalid content references:\n- ${errors.join('\n- ')}`);
  }
}
