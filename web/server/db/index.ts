import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from './schema';

const connectionString = process.env.DATABASE_URL
    ?? `postgres://${process.env.DATABASE_USER ?? 'whoami'}:${process.env.DATABASE_PASSWORD ?? 'shhhhItsASecret'}@${process.env.DATABASE_HOST ?? '127.0.0.1'}:${process.env.DATABASE_PORT ?? '5434'}/${process.env.DATABASE_NAME ?? 'whoami_development'}`;

const client = postgres(connectionString);

export const db = drizzle(client, { schema });

export { schema };
