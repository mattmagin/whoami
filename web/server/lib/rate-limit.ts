import type { Context, Next } from 'hono';

interface RateLimitOptions {
    /** Maximum number of requests allowed within the window */
    limit: number;
    /** Time window in milliseconds */
    windowMs: number;
}

interface RateLimitEntry {
    count: number;
    resetAt: number;
}

/**
 * Simple in-memory rate limiter middleware for Hono.
 * Uses the client IP (from X-Forwarded-For or socket address) as the key.
 * Not suitable for multi-instance deployments — use Redis-backed limiting
 * if you scale beyond a single process.
 */
export const rateLimiter = ({ limit, windowMs }: RateLimitOptions) => {
    const store = new Map<string, RateLimitEntry>();

    // Periodically clean up expired entries to prevent memory leaks
    const cleanup = () => {
        const now = Date.now();
        for (const [key, entry] of store) {
            if (now >= entry.resetAt) {
                store.delete(key);
            }
        }
    };

    setInterval(cleanup, windowMs * 2);

    return async (c: Context, next: Next) => {
        const ip =
            c.req.header('x-forwarded-for')?.split(',')[0]?.trim() ??
            c.req.header('x-real-ip') ??
            'unknown';

        const now = Date.now();
        const entry = store.get(ip);

        if (!entry || now >= entry.resetAt) {
            // First request or window expired — start a new window
            store.set(ip, { count: 1, resetAt: now + windowMs });
            await next();
            return;
        }

        if (entry.count >= limit) {
            const retryAfterSecs = Math.ceil((entry.resetAt - now) / 1000);
            c.header('Retry-After', String(retryAfterSecs));
            return c.json(
                { error: 'rate_limited', message: 'Too many requests. Please try again later.' },
                429,
            );
        }

        entry.count++;
        await next();
    };
};
