import { Hono } from 'hono';
import posts from './routes/posts';
import projects from './routes/projects';
import resume from './routes/resume';
import contacts from './routes/contacts';
import version from './routes/version';

const api = new Hono()
    .route('/posts', posts)
    .route('/projects', projects)
    .route('/resume', resume)
    .route('/contacts', contacts)
    .route('/version', version);

export default api;
export type ApiType = typeof api;
