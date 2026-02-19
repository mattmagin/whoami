import { Hono } from 'hono';
import { eq, and, count, desc } from 'drizzle-orm';
import { db, schema } from '../db';
import { formatReadingTime } from '../lib/reading-time';
import { published } from '../lib/filters';

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const DEFAULT_PER_PAGE = 5;

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
    readingTime: formatReadingTime(post.content),
});

const app = new Hono()
    .get('/', async (c) => {
        const page = Math.max(1, Number(c.req.query('page')) || 1);
        const offset = (page - 1) * DEFAULT_PER_PAGE;

        const publishedFilter = published(schema.posts);

        const [totalResult, posts] = await Promise.all([
            db.select({ count: count() }).from(schema.posts).where(publishedFilter),
            db.select()
                .from(schema.posts)
                .where(publishedFilter)
                .orderBy(desc(schema.posts.publishedAt))
                .limit(DEFAULT_PER_PAGE)
                .offset(offset),
        ]);

        const total = totalResult[0]?.count ?? 0;

        return c.json({
            data: posts.map(serializePost),
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

        const post = isUuid
            ? await db.select().from(schema.posts).where(and(eq(schema.posts.id, param), published(schema.posts))).then(r => r[0])
            : await db.select().from(schema.posts).where(and(eq(schema.posts.slug, param), published(schema.posts))).then(r => r[0]);

        if (!post) {
            return c.json({ error: 'not_found', message: 'Post not found' }, 404);
        }

        return c.json(serializePost(post));
    });

export default app;
