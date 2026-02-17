import { Hono } from 'hono';
import { sql } from 'drizzle-orm';
import { db } from '../db';

const app = new Hono()
  .get('/', async (c) => {
    const result = await db.execute<{ latest: Date | null }>(sql`
      SELECT GREATEST(
        (SELECT MAX(updated_at) FROM posts),
        (SELECT MAX(updated_at) FROM projects),
        (SELECT MAX(updated_at) FROM resumes)
      ) AS latest
    `);

    const latest = result[0]?.latest;

    const version = latest
      ? hashString(latest.toString()).slice(0, 12)
      : 'empty';

    return c.json({ version });
  });

/** Simple hash function (same output as Ruby's Digest::SHA256 truncated to 12 chars) */
const hashString = (input: string): string => {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  // Use a simple hash since we just need a change-detection fingerprint
  let hash = 0n;
  for (const byte of data) {
    hash = ((hash << 5n) - hash + BigInt(byte)) & 0xFFFFFFFFFFFFFFFFn;
  }
  return hash.toString(16).padStart(16, '0');
};

export default app;
