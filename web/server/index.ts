import { Hono } from 'hono';
import { logger } from 'hono/logger';
import { serveStatic } from 'hono/bun';
import posts from './routes/posts';
import projects from './routes/projects';
import resume from './routes/resume';
import contacts from './routes/contacts';
import version from './routes/version';

const app = new Hono();

// Logging
app.use('*', logger());

// API routes
const api = new Hono()
  .route('/posts', posts)
  .route('/projects', projects)
  .route('/resume', resume)
  .route('/contacts', contacts)
  .route('/version', version);

app.route('/api', api);

// In production, serve the built React SPA
if (process.env.NODE_ENV === 'production') {
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
