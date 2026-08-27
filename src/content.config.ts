import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const posts = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./content/posts",
  }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    banner: z.string().optional(),
    slug: z.string().optional(),
  }),
});

const pages = defineCollection({
  loader: glob({
    pattern: "**/*.{md,mdx}",
    base: "./content/pages",
  }),
  schema: z.object({
    title: z.string(),
    slug: z.string().optional(),
  }),
});

export const collections = { posts, pages };
