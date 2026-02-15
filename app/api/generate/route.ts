import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import * as cheerio from "cheerio";
import { digestSchema, type DigestResult } from "@/lib/schema";
import { redis, ratelimit, getCacheKey, STATS_KEYS } from "@/lib/redis";
import { generateContentHashSync } from "@/lib/crypto";

// Helper to get client IP
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  const realIp = req.headers.get("x-real-ip");
  return forwarded?.split(",")[0] || realIp || "127.0.0.1";
}

export async function POST(req: NextRequest) {
  const startTime = Date.now();

  try {
    // ============================================
    // 1. RATE LIMITING (5 requests per hour per IP)
    // ============================================
    const clientIp = getClientIp(req);
    const { success, limit, remaining, reset } =
      await ratelimit.limit(clientIp);

    if (!success) {
      console.log(`[RATE_LIMIT] IP ${clientIp} exceeded limit`);
      return NextResponse.json(
        {
          error: "You have reached your hourly limit. Please try again later.",
          limit,
          remaining: 0,
          reset: new Date(reset).toISOString(),
        },
        {
          status: 429,
          headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": reset.toString(),
          },
        },
      );
    }

    console.log(
      `[RATE_LIMIT] IP ${clientIp} - ${remaining}/${limit} requests remaining`,
    );

    // ============================================
    // 2. REQUEST VALIDATION
    // ============================================
    const { url } = await req.json();

    if (!url) {
      return NextResponse.json({ error: "URL is required" }, { status: 400 });
    }

    // Validate URL format
    let validUrl: URL;
    try {
      validUrl = new URL(url);
    } catch {
      return NextResponse.json(
        { error: "Invalid URL format" },
        { status: 400 },
      );
    }

    const normalizedUrl = validUrl.toString();
    const cacheKey = getCacheKey(normalizedUrl);

    // ============================================
    // 3. SMART CACHING (Check if cached in last 24h)
    // ============================================
    try {
      const cachedData = await redis.get<DigestResult>(cacheKey);

      if (cachedData) {
        console.log(
          `[CACHE_HIT] Returning cached digest for: ${normalizedUrl}`,
        );
        return NextResponse.json(
          {
            ...cachedData,
            cached: true,
            cacheHit: true,
          },
          {
            headers: {
              "X-Cache": "HIT",
              "X-RateLimit-Limit": limit.toString(),
              "X-RateLimit-Remaining": remaining.toString(),
            },
          },
        );
      }

      console.log(`[CACHE_MISS] No cache found for: ${normalizedUrl}`);
    } catch (cacheError) {
      console.error("[SYSTEM_ERROR] Cache check failed:", cacheError);
      // Continue without cache - don't fail the request
    }

    // ============================================
    // 4. WEB SCRAPING
    // ============================================
    console.log(`[SCRAPING] Fetching content from: ${normalizedUrl}`);

    const response = await fetch(validUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SmartDigest/1.0)",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();
    const $ = cheerio.load(html);

    // Remove script and style elements
    $("script, style, nav, footer, iframe").remove();

    // Extract text content
    const title = $("title").text() || $("h1").first().text() || "Untitled";
    const bodyText = $("body")
      .text()
      .replace(/\s+/g, " ")
      .trim()
      .substring(0, 10000); // Limit to avoid token limits

    if (!bodyText || bodyText.length < 100) {
      return NextResponse.json(
        { error: "Insufficient content found on the page" },
        { status: 400 },
      );
    }

    console.log(
      `[SCRAPING] Extracted ${bodyText.length} characters from: ${title}`,
    );

    // ============================================
    // 4.5 VERIFICATION INFRASTRUCTURE - Generate Content Hash
    // ============================================
    const scrapeTimestamp = Date.now();
    const contentHash = generateContentHashSync(bodyText);

    console.log(
      `[VERIFICATION] Generated content hash: ${contentHash.substring(0, 16)}...`,
    );

    // ============================================
    // 5. AI GENERATION with ERROR TRACKING
    // ============================================
    console.log(`[AI_GENERATION] Calling Gemini API for: ${normalizedUrl}`);

    const result = await generateObject({
      model: google("gemini-2.5-flash"),
      schema: digestSchema,
      prompt: `Analyze the following webpage content and create a comprehensive digest.

Title: ${title}

Content:
${bodyText}

Please provide:
1. A clear, descriptive title
2. A summary broken into 2-4 concise paragraphs
3. 3-5 key takeaways as bullet points
4. Exactly 3 multiple-choice quiz questions with 4 options each

Make the quiz questions meaningful and test understanding of the main concepts.

IMPORTANT: You must include a verification_metadata object with:
- source_url: "${normalizedUrl}"
- scrape_timestamp: ${scrapeTimestamp}
- content_hash: "${contentHash}"`,
    });

    const digest = result.object;

    // Ensure verification metadata is included (override AI output for security)
    digest.verification_metadata = {
      source_url: normalizedUrl,
      scrape_timestamp: scrapeTimestamp,
      content_hash: contentHash,
    };

    const processingTime = Date.now() - startTime;

    console.log(
      `[AI_GENERATION] Successfully generated digest in ${processingTime}ms`,
    );

    // ============================================
    // 6. CACHE THE RESULT (24 hour TTL)
    // ============================================
    try {
      await redis.set(cacheKey, digest, {
        ex: 60 * 60 * 24, // 24 hours in seconds
      });
      console.log(`[CACHE_SET] Cached digest for 24h: ${normalizedUrl}`);
    } catch (cacheError) {
      console.error("[SYSTEM_ERROR] Failed to cache result:", cacheError);
      // Continue - don't fail the request
    }

    // ============================================
    // 7. UPDATE STATISTICS
    // ============================================
    try {
      // Increment total digest counter
      await redis.incr(STATS_KEYS.TOTAL_DIGESTS);

      // Add to recent URLs list (keep last 100)
      await redis.lpush(
        STATS_KEYS.RECENT_URLS,
        JSON.stringify({
          url: normalizedUrl,
          title: digest.title,
          timestamp: Date.now(),
          processingTime,
          ip: clientIp,
        }),
      );

      await redis.ltrim(STATS_KEYS.RECENT_URLS, 0, 99);

      console.log(`[STATS] Updated system statistics`);
    } catch (statsError) {
      console.error("[SYSTEM_ERROR] Failed to update stats:", statsError);
      // Continue - don't fail the request
    }

    // ============================================
    // 8. RETURN SUCCESS RESPONSE
    // ============================================
    return NextResponse.json(
      {
        ...digest,
        cached: false,
        cacheHit: false,
        processingTime,
      },
      {
        headers: {
          "X-Cache": "MISS",
          "X-Processing-Time": processingTime.toString(),
          "X-RateLimit-Limit": limit.toString(),
          "X-RateLimit-Remaining": remaining.toString(),
        },
      },
    );
  } catch (error) {
    // ============================================
    // ERROR TRACKING - Comprehensive logging
    // ============================================
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    const errorStack = error instanceof Error ? error.stack : undefined;

    console.error("[SYSTEM_ERROR] ==========================================");
    console.error("[SYSTEM_ERROR] Fatal error in digest generation");
    console.error("[SYSTEM_ERROR] Message:", errorMessage);
    console.error("[SYSTEM_ERROR] Stack:", errorStack);
    console.error("[SYSTEM_ERROR] Timestamp:", new Date().toISOString());
    console.error("[SYSTEM_ERROR] ==========================================");

    // Check for specific error types
    if (errorMessage.includes("fetch")) {
      return NextResponse.json(
        {
          error:
            "Failed to fetch the URL. The website might be blocking our requests.",
        },
        { status: 502 },
      );
    }

    if (errorMessage.includes("Gemini") || errorMessage.includes("API")) {
      return NextResponse.json(
        {
          error:
            "AI service is temporarily unavailable. Please try again later.",
        },
        { status: 503 },
      );
    }

    return NextResponse.json(
      {
        error: "An unexpected error occurred while processing your request.",
        details:
          process.env.NODE_ENV === "development" ? errorMessage : undefined,
      },
      { status: 500 },
    );
  }
}
