import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { serveStatic } from 'hono/bun';
import api from './api';

const app = new Hono();

app.use('*', logger());

app.use('*', secureHeaders());

app.onError((err, c) => {
    console.error('[server] Unhandled error:', err);
    return c.json(
        { error: 'internal_error', message: 'Internal server error' },
        500,
    );
});

app.route('/api', api);

if (process.env.NODE_ENV === 'production') {
    app.use('/assets/*', async (c, next) => {
        await next();
        c.header('Cache-Control', 'public, max-age=31536000, immutable');
    });

    app.use('/*', serveStatic({ root: './dist' }));

    app.get('/*', async (c, next) => {
        await next();
        c.header('Cache-Control', 'no-cache');
    });
    app.get('/*', serveStatic({ path: './dist/index.html' }));
}

const port = parseInt(process.env.PORT ?? '3001', 10);

export default {
    port,
    fetch: app.fetch,
};
