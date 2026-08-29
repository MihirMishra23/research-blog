import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { topicSchema, writingSchema } from './content/schemas';

const writing = defineCollection({
  loader: glob({
    base: './src/content/writing',
    pattern: '**/*.{md,mdx}',
  }),
  schema: writingSchema,
});

const topics = defineCollection({
  loader: glob({
    base: './src/content/topics',
    pattern: '**/*.{md,mdx}',
  }),
  schema: topicSchema,
});

export const collections = { topics, writing };
