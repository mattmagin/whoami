import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './server/db/schema.ts',
  out: './server/db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL
      ?? `postgres://${process.env.DATABASE_USER ?? 'whoami'}:${process.env.DATABASE_PASSWORD ?? 'shhhhItsASecret'}@${process.env.DATABASE_HOST ?? '127.0.0.1'}:${process.env.DATABASE_PORT ?? '5434'}/${process.env.DATABASE_NAME ?? 'whoami_development'}`,
  },
});
