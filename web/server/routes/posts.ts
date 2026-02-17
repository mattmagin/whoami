import { Hono } from 'hono';
import { eq } from 'drizzle-orm';
import { db, schema } from '../db';
import { formatReadingTime } from '../lib/reading-time';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const serializePost = (post: typeof schema.posts.$inferSelect) => ({
  id: post.id,
  slug: post.slug,
  title: post.title,
  excerpt: post.excerpt,
  content: post.content,
  tags: post.tags,
  featureImageUrl: post.featureImageUrl,
  publishedAt: post.publishedAt?.toISOString() ?? null,
  createdAt: post.createdAt.toISOString(),
  updatedAt: post.updatedAt.toISOString(),
  deletedAt: post.deletedAt?.toISOString() ?? null,
  readingTime: formatReadingTime(post.content),
});

const app = new Hono()
  .get('/', async (c) => {
    const allPosts = await db.select().from(schema.posts);
    return c.json(allPosts.map(serializePost));
  })
  .get('/:slug', async (c) => {
    const param = c.req.param('slug');
    const isUuid = UUID_REGEX.test(param);

    const post = isUuid
      ? await db.select().from(schema.posts).where(eq(schema.posts.id, param)).then(r => r[0])
      : await db.select().from(schema.posts).where(eq(schema.posts.slug, param)).then(r => r[0]);

    if (!post) {
      return c.json({ error: 'not_found', message: 'Post not found' }, 404);
    }

    return c.json(serializePost(post));
  });

export default app;
