import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.md' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    plannedPublishDate: z.coerce.date(),
    targetKeyword: z.string(),
    cluster: z.string(),
    intent: z.enum(['Learn', 'Compare', 'Solve']),
    funnel: z.enum(['Awareness', 'Consideration', 'Decision']),
    audience: z.string(),
    ctaLabel: z.string(),
    ctaHref: z.string(),
    volume: z.number().int().nonnegative().nullable(),
    cpc: z.number().nonnegative().nullable(),
    competition: z.number().min(0).max(1).nullable(),
    researchSource: z.string(),
    status: z.literal('drafted'),
    draft: z.literal(true),
    reviewRequired: z.boolean(),
  }),
});

export const collections = { blog };
