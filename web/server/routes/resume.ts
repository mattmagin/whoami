import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import yaml from 'js-yaml';
import { db, schema } from '../db';

const app = new Hono()
  .get('/', async (c) => {
    const resume = await db.select()
      .from(schema.resumes)
      .where(eq(schema.resumes.slug, 'primary'))
      .then(r => r[0]);

    if (!resume) {
      return c.json({ error: 'not_found', message: 'Resume not found' }, 404);
    }

    const parsed = yaml.load(resume.data);
    return c.json(parsed);
  });

export default app;
