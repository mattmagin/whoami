import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
  deletedAt: project.deletedAt?.toISOString() ?? null,
});

const app = new Hono()
  .get('/', async (c) => {
    const allProjects = await db.select().from(schema.projects);
    return c.json(allProjects.map(serializeProject));
  })
  .get('/:slug', async (c) => {
    const param = c.req.param('slug');
    const isUuid = UUID_REGEX.test(param);

    const project = isUuid
      ? await db.select().from(schema.projects).where(eq(schema.projects.id, param)).then(r => r[0])
      : await db.select().from(schema.projects).where(eq(schema.projects.slug, param)).then(r => r[0]);

    if (!project) {
      return c.json({ error: 'not_found', message: 'Project not found' }, 404);
    }

    return c.json(serializeProject(project));
  });

export default app;
