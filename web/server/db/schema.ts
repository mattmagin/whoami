import { pgTable, uuid, text, varchar, boolean, timestamp, date, integer, index, uniqueIndex } from 'drizzle-orm/pg-core';

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
    name: varchar('name').notNull(),
    title: varchar('title').notNull(),
    summary: text('summary'),
    email: varchar('email'),
    location: varchar('location'),
    githubUrl: varchar('github_url'),
    linkedinUrl: varchar('linkedin_url'),
    websiteUrl: varchar('website_url'),
    interests: varchar('interests').array(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    uniqueIndex('index_resumes_on_slug').on(table.slug),
]);

export const resumeSkills = pgTable('resume_skills', {
    id: uuid('id').defaultRandom().primaryKey(),
    resumeId: uuid('resume_id').notNull().references(() => resumes.id),
    category: varchar('category').notNull(),
    name: varchar('name').notNull(),
    sortOrder: integer('sort_order').notNull().default(0),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
}, (table) => [
    index('index_resume_skills_on_resume_id').on(table.resumeId),
]);

export const resumeExperiences = pgTable('resume_experiences', {
    id: uuid('id').defaultRandom().primaryKey(),
    resumeId: uuid('resume_id').notNull().references(() => resumes.id),
    title: varchar('title').notNull(),
    company: varchar('company').notNull(),
    location: varchar('location'),
    startDate: date('start_date').notNull(),
    endDate: date('end_date'),
    current: boolean('current').notNull().default(false),
    highlights: text('highlights').array(),
    sortOrder: integer('sort_order').notNull().default(0),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    index('index_resume_experiences_on_resume_id').on(table.resumeId),
]);

export const resumeProjects = pgTable('resume_projects', {
    id: uuid('id').defaultRandom().primaryKey(),
    resumeId: uuid('resume_id').notNull().references(() => resumes.id),
    name: varchar('name').notNull(),
    description: text('description'),
    technologies: varchar('technologies').array(),
    projectId: uuid('project_id').references(() => projects.id),
    sortOrder: integer('sort_order').notNull().default(0),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    index('index_resume_projects_on_resume_id').on(table.resumeId),
    index('index_resume_projects_on_project_id').on(table.projectId),
]);

export const resumeEducation = pgTable('resume_education', {
    id: uuid('id').defaultRandom().primaryKey(),
    resumeId: uuid('resume_id').notNull().references(() => resumes.id),
    degree: varchar('degree').notNull(),
    institution: varchar('institution').notNull(),
    location: varchar('location'),
    startYear: integer('start_year'),
    endYear: integer('end_year'),
    details: text('details').array(),
    sortOrder: integer('sort_order').notNull().default(0),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    index('index_resume_education_on_resume_id').on(table.resumeId),
]);

export const resumeCertifications = pgTable('resume_certifications', {
    id: uuid('id').defaultRandom().primaryKey(),
    resumeId: uuid('resume_id').notNull().references(() => resumes.id),
    name: varchar('name').notNull(),
    year: integer('year'),
    sortOrder: integer('sort_order').notNull().default(0),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    deletedAt: timestamp('deleted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
}, (table) => [
    index('index_resume_certifications_on_resume_id').on(table.resumeId),
]);
