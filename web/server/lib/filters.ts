import { and, isNull, isNotNull, type Column } from 'drizzle-orm';

export const published = <T extends { publishedAt: Column; deletedAt: Column }>(table: T) =>
    and(isNotNull(table.publishedAt), isNull(table.deletedAt));
