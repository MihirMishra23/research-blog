import { z } from 'astro/zod';

export const ARTICLE_TYPES = [
  'explainer',
  'deep-dive',
  'experiment',
  'paper-notes',
  'research-note',
  'survey',
  'opinion',
] as const;

export const DIFFICULTY_LEVELS = [
  'introductory',
  'intermediate',
  'advanced',
] as const;

export const PUBLICATION_STATUSES = ['draft', 'published', 'archived'] as const;

export const TOPIC_CATEGORIES = [
  'post-training',
  'inference',
  'models',
  'multimodal',
  'agents',
  'memory',
  'evaluation',
  'interpretability',
  'safety',
] as const;

export const CONCEPT_TYPES = [
  'area',
  'concept',
  'method',
  'architecture',
  'system',
  'benchmark',
  'practice',
  'tool',
] as const;

export const MATURITY_STATUSES = [
  'foundational',
  'established',
  'active',
  'frontier',
] as const;

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .regex(
    /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    'Use a lowercase kebab-case content ID, such as "speculative-decoding".',
  );

const titleSchema = z.string().trim().min(3).max(120);
const descriptionSchema = z.string().trim().min(10).max(240);

const uniqueSlugListSchema = z
  .array(slugSchema)
  .refine((values) => new Set(values).size === values.length, {
    message: 'Content ID lists cannot contain duplicates.',
  });

export const paperLinkSchema = z
  .object({
    title: z.string().trim().min(3).max(240),
    url: z.url(),
    year: z.number().int().min(1900).max(2200).optional(),
  })
  .strict();

const writingBaseSchema = z
  .object({
    title: titleSchema,
    description: descriptionSchema,
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    topics: uniqueSlugListSchema.min(
      1,
      'A post must reference at least one topic ID.',
    ),
    tags: uniqueSlugListSchema.default([]),
    level: z.enum(DIFFICULTY_LEVELS),
    type: z.enum(ARTICLE_TYPES),
    status: z.enum(PUBLICATION_STATUSES).default('draft'),
    draft: z.boolean().optional(),
    github: z.url().nullable().optional(),
    papers: z.array(paperLinkSchema).default([]),
    previous: slugSchema.nullable().optional(),
    next: slugSchema.nullable().optional(),
    related: uniqueSlugListSchema.default([]),
  })
  .strict();

export const writingSchema = writingBaseSchema
  .superRefine((data, context) => {
    if (data.draft !== undefined && data.draft !== (data.status === 'draft')) {
      context.addIssue({
        code: 'custom',
        path: ['draft'],
        message:
          '`draft` must be true only when `status` is "draft". Prefer setting `status` and omitting `draft`.',
      });
    }
  })
  .transform((data) => ({
    ...data,
    draft: data.draft ?? data.status === 'draft',
  }));

export const topicSchema = z
  .object({
    name: titleSchema,
    summary: descriptionSchema,
    category: z.enum(TOPIC_CATEGORIES),
    type: z.enum(CONCEPT_TYPES),
    status: z.enum(MATURITY_STATUSES),
    draft: z.boolean().default(false),
    aliases: z.array(z.string().trim().min(1).max(80)).default([]),
    mapLabel: z.string().trim().min(1).max(48).optional(),
    problem: z.string().trim().min(10).max(600).optional(),
    idea: z.string().trim().min(10).max(600).optional(),
    consequence: z.string().trim().min(10).max(600).optional(),
    limitations: z.string().trim().min(10).max(600).optional(),
    whatCameNext: z.string().trim().min(10).max(600).optional(),
    parent: slugSchema.nullable().optional(),
    prerequisites: uniqueSlugListSchema.default([]),
    cameBefore: uniqueSlugListSchema.default([]),
    leadsTo: uniqueSlugListSchema.default([]),
    related: uniqueSlugListSchema.default([]),
    frontierQuestions: z.array(z.string().trim().min(10).max(500)).default([]),
    papers: z.array(paperLinkSchema).default([]),
    map: z
      .object({
        x: z.number(),
        y: z.number(),
        width: z.number().positive().optional(),
        height: z.number().positive().optional(),
        labelOffsetX: z.number().default(0),
        labelOffsetY: z.number().default(0),
      })
      .strict()
      .optional(),
  })
  .strict();

export type WritingData = z.infer<typeof writingSchema>;
export type TopicData = z.infer<typeof topicSchema>;
export type PaperLink = z.infer<typeof paperLinkSchema>;
export type ArticleType = (typeof ARTICLE_TYPES)[number];
export type DifficultyLevel = (typeof DIFFICULTY_LEVELS)[number];
export type PublicationStatus = (typeof PUBLICATION_STATUSES)[number];
export type ConceptMaturity = (typeof MATURITY_STATUSES)[number];
export type TopicCategory = (typeof TOPIC_CATEGORIES)[number];
