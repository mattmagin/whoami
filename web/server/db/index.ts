import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

// Ensure `.env` is loaded for Node/tsx-based execution (dev scripts, migrations, etc).
import 'dotenv/config';

// DATABASE_URL is set in .env (dev defaults) and overridden via .env.local or environment.
// In production, require it to be explicitly set.
if (process.env.NODE_ENV === 'production' && !process.env.DATABASE_URL) {
    throw new Error(
        'DATABASE_URL environment variable is required in production. ' +
        'Set it to your PostgreSQL connection string.',
    );
}

if (!process.env.DATABASE_URL) {
    throw new Error(
        'DATABASE_URL environment variable is required. ' +
        'For local dev, set it in web/.env or export it in your shell.',
    );
}

const client = postgres(process.env.DATABASE_URL!);

export const db = drizzle(client, { schema });

export { schema };
