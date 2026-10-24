import { defineCollection, z } from 'astro:content'

const work = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string(),
      year: z.number(),
      period: z.string().optional(),
      role: z.string().optional(),
      order: z.number().default(99),
      tags: z.array(z.string()).default([]),
      coverImage: image().optional(),
      client: z.string().optional(),
      featured: z.boolean().default(false),
      externalUrl: z.string().url().optional(),
    }),
})

const writing = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    publishedAt: z.date().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
})

const people = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      name: z.string(),
      handle: z.string(),
      role: z.string(),
      location: z.string(),
      url: z.string().url(),
      avatar: image().optional(),
      tags: z.array(z.string()).default([]),
      relationship: z.enum(['colleague', 'friend', 'mentor', 'internet friend']),
      asifsTake: z.string(),
      featured: z.boolean().default(false),
    }),
})

const jobs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    company: z.string(),
    location: z.string(),
    type: z.enum(['full-time', 'part-time', 'contract', 'freelance', 'internship']),
    tags: z.array(z.string()).default([]),
    url: z.string().url(),
    salary: z.string().optional(),
    postedAt: z.date(),
    expiresAt: z.date().optional(),
    active: z.boolean().default(true),
    asifNote: z.string().optional(),
  }),
})

export const collections = { work, writing, people, jobs }
