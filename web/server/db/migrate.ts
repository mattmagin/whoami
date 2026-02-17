import { db } from './index';
import { sql } from 'drizzle-orm';
import * as fs from 'fs';
import * as path from 'path';

const MIGRATIONS_DIR = path.resolve(import.meta.dir, 'migrations');

async function migrate() {
    console.log('Running migrations...');

    const files = fs.readdirSync(MIGRATIONS_DIR)
        .filter(f => f.endsWith('.sql'))
        .sort();

    for (const file of files) {
        console.log(`  Applying: ${file}`);
        const migration = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf-8');
        await db.execute(sql.raw(migration));
        console.log(`  Done: ${file}`);
    }

    console.log('Migrations complete!');
    process.exit(0);
}

migrate().catch((err) => {
    console.error('Migration failed:', err);
    process.exit(1);
});
