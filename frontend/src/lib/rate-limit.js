import "server-only";

// Small in-memory limiter to slow down password guessing.
// Per server instance only: use Redis/Upstash or similar if you run multiple instances.
const buckets = new Map();

export function rateLimit(key, { limit = 5, windowMs = 15 * 60 * 1000 } = {}) {
  const now = Date.now();
  const bucket = buckets.get(key);
  if (!bucket || bucket.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { ok: true };
  }
  bucket.count += 1;
  if (bucket.count > limit) {
    return { ok: false, retryAfterMinutes: Math.ceil((bucket.resetAt - now) / 60000) };
  }
  return { ok: true };
}

export function resetRateLimit(key) {
  buckets.delete(key);
}

