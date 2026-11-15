import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string().min(1),
    status: z.enum(['draft', 'stub', 'published']).default('draft'),
    description: z.string().optional(),
    publishedAt: z.coerce.date().optional(),
  }),
});

export const collections = { posts };
