interface RateLimitRecord {
  count: number;
  resetTime: number;
}

// In-memory rate limiting store
const store = new Map<string, RateLimitRecord>();

// Periodic cleanup of expired rate limits every 5 minutes
const CLEANUP_INTERVAL_MS = 5 * 60 * 1000;
let lastCleanup = Date.now();

function cleanupExpiredRecords(now: number) {
  if (now - lastCleanup > CLEANUP_INTERVAL_MS) {
    lastCleanup = now;
    for (const [key, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(key);
      }
    }
  }
}

/**
 * Checks if an action is within rate limit.
 * Returns true if allowed, false if limit exceeded.
 */
export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = Date.now();
  cleanupExpiredRecords(now);

  const record = store.get(key);

  if (!record || now > record.resetTime) {
    store.set(key, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (record.count >= maxAttempts) {
    return false;
  }

  record.count += 1;
  return true;
}

/**
 * Resets the rate limit for a specific key (e.g., upon successful login).
 */
export function resetRateLimit(key: string): void {
  store.delete(key);
}

/**
 * Gets client IP address safely from request headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) {
    return realIp.trim();
  }
  return '127.0.0.1';
}
