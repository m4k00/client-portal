import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Initialize Redis client (will be undefined if env vars not set)
const redis =
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
    ? new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })
    : null;

// Create rate limiter (3 submissions per hour per IP)
export const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: true,
    })
  : null;

export async function checkRateLimit(identifier: string): Promise<{
  success: boolean;
  limit?: number;
  remaining?: number;
  reset?: number;
}> {
  // If rate limiting is not configured, allow the request
  if (!ratelimit) {
    console.warn("Rate limiting not configured - allowing request");
    return { success: true };
  }

  try {
    const { success, limit, remaining, reset } = await ratelimit.limit(identifier);

    return {
      success,
      limit,
      remaining,
      reset,
    };
  } catch (error) {
    console.error("Rate limit check error:", error);
    // On error, allow the request (fail open)
    return { success: true };
  }
}
