import { Hono } from 'hono';
import { eq, and, count, asc } from 'drizzle-orm';
import { db, schema } from '../db';
import { published } from '../lib/filters';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DEFAULT_PER_PAGE = 5;

const serializeProject = (project: typeof schema.projects.$inferSelect) => ({
  id: project.id,
  slug: project.slug,
  name: project.name,
  excerpt: project.excerpt,
  description: project.description,
  techStack: project.techStack,
  url: project.url,
  githubUrl: project.githubUrl,
  imageUrl: project.imageUrl,
  featured: project.featured,
  publishedAt: project.publishedAt?.toISOString() ?? null,
  createdAt: project.createdAt.toISOString(),
  updatedAt: project.updatedAt.toISOString(),
});

const app = new Hono()
  .get('/', async (c) => {
    const page = Math.max(1, Number(c.req.query('page')) || 1);
    const offset = (page - 1) * DEFAULT_PER_PAGE;

    const publishedFilter = published(schema.projects);

    const [totalResult, projects] = await Promise.all([
      db.select({ count: count() }).from(schema.projects).where(publishedFilter),
      db.select()
        .from(schema.projects)
        .where(publishedFilter)
        .orderBy(asc(schema.projects.name))
        .limit(DEFAULT_PER_PAGE)
        .offset(offset),
    ]);

    const total = totalResult[0]?.count ?? 0;

    return c.json({
      data: projects.map(serializeProject),
      meta: {
        page,
        perPage: DEFAULT_PER_PAGE,
        total,
        totalPages: Math.ceil(total / DEFAULT_PER_PAGE),
      },
    });
  })
  .get('/:slug', async (c) => {
    const param = c.req.param('slug');
    const isUuid = UUID_REGEX.test(param);

    const project = isUuid
      ? await db.select().from(schema.projects).where(and(eq(schema.projects.id, param), published(schema.projects))).then(r => r[0])
      : await db.select().from(schema.projects).where(and(eq(schema.projects.slug, param), published(schema.projects))).then(r => r[0]);

    if (!project) {
      return c.json({ error: 'not_found', message: 'Project not found' }, 404);
    }

    return c.json(serializeProject(project));
  });

export default app;
