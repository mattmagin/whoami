import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/bun';
import api from './api';

const app = new Hono();

// Logging
app.use('*', logger());

// API routes
app.route('/api', api);

// In production, serve the built React SPA
if (process.env.NODE_ENV === 'production') {
    // Immutable cache for Vite-hashed assets (JS, CSS, fonts, images)
    app.use('/assets/*', async (c, next) => {
        await next();
        c.header('Cache-Control', 'public, max-age=31536000, immutable');
    });

    app.use('/*', serveStatic({ root: './dist' }));
    // SPA fallback: serve index.html for any non-API, non-static route
    app.get('/*', serveStatic({ path: './dist/index.html' }));
}

const port = parseInt(process.env.PORT ?? '3001', 10);

console.log(`Server running on http://localhost:${port}`);

export default {
    port,
    fetch: app.fetch,
};
