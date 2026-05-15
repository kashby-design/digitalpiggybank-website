import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

export const BLOG_TAGS = [
  'allowance',
  'chores',
  'saving',
  'digital-money',
  'parenting-mindset',
  'ads-impulse',
] as const;

export type BlogTag = (typeof BLOG_TAGS)[number];

export const TAG_LABELS: Record<BlogTag, string> = {
  allowance: 'Allowance',
  chores: 'Chores',
  saving: 'Saving',
  'digital-money': 'Digital Money',
  'parenting-mindset': 'Parenting Mindset',
  'ads-impulse': 'Ads & Impulse',
};

const blog = defineCollection({
  loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        date: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        description: z.string(),
        image: image(),
        imageAlt: z.string(),
        draft: z.boolean().default(false),
        tags: z.array(z.enum(BLOG_TAGS)).default([]),
        author: z.string().default('Digital Piggy Bank Team'),
      })
      .passthrough(),
});

export const collections = { blog };
