import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

// Initialize Redis client
export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

// Rate limiter: 5 requests per hour per IP
export const ratelimit = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(5, "1 h"),
  analytics: true,
  prefix: "ratelimit:digest",
});

// Cache key generation
export function getCacheKey(url: string): string {
  return `digest:${url}`;
}

// Stats keys
export const STATS_KEYS = {
  TOTAL_DIGESTS: "stats:total_digests",
  RECENT_URLS: "stats:recent_urls",
} as const;
