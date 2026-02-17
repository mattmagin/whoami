import { pgTable, uuid, text, varchar, boolean, timestamp, index, uniqueIndex } from 'drizzle-orm/pg-core';

export const projects = pgTable('projects', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug').notNull(),
  name: varchar('name').notNull(),
  excerpt: text('excerpt'),
  description: text('description'),
  techStack: varchar('tech_stack').array(),
  url: varchar('url'),
  githubUrl: varchar('github_url'),
  imageUrl: varchar('image_url'),
  featured: boolean('featured').notNull().default(false),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('index_projects_on_slug').on(table.slug),
  uniqueIndex('index_projects_on_name').on(table.name),
]);

export const posts = pgTable('posts', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug').notNull(),
  title: varchar('title').notNull(),
  excerpt: text('excerpt'),
  content: text('content'),
  tags: varchar('tags').array(),
  featureImageUrl: text('feature_image_url'),
  projectId: uuid('project_id').references(() => projects.id),
  publishedAt: timestamp('published_at', { withTimezone: true }),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('index_posts_on_slug').on(table.slug),
  uniqueIndex('index_posts_on_title').on(table.title),
  index('index_posts_on_project_id').on(table.projectId),
]);

export const contacts = pgTable('contacts', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name'),
  email: varchar('email'),
  message: text('message'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const resumes = pgTable('resumes', {
  id: uuid('id').defaultRandom().primaryKey(),
  slug: varchar('slug').notNull(),
  data: text('data').notNull().default(''),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
  uniqueIndex('index_resumes_on_slug').on(table.slug),
]);
