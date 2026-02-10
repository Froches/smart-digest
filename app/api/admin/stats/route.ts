import { NextRequest, NextResponse } from "next/server";
import { redis, STATS_KEYS } from "@/lib/redis";

// Simple password protection
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

interface RecentUrlItem {
  url: string;
  title: string;
  timestamp: number;
  processingTime?: number;
}

export async function GET(req: NextRequest) {
  try {
    // Check authorization
    const authHeader = req.headers.get("authorization");
    const providedPassword = authHeader?.replace("Bearer ", "");

    if (providedPassword !== ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch statistics
    const totalDigests =
      (await redis.get<number>(STATS_KEYS.TOTAL_DIGESTS)) || 0;
    const recentUrlsRaw = await redis.lrange(STATS_KEYS.RECENT_URLS, 0, 49); // Get last 50

    const recentUrls = recentUrlsRaw
      .map((item) => {
        try {
          return JSON.parse(item) as RecentUrlItem;
        } catch {
          return null;
        }
      })
      .filter((item): item is RecentUrlItem => item !== null);

    // Calculate additional stats
    const last24Hours = Date.now() - 24 * 60 * 60 * 1000;
    const digestsLast24h = recentUrls.filter(
      (item) => item.timestamp > last24Hours,
    ).length;

    const avgProcessingTime =
      recentUrls.length > 0
        ? recentUrls.reduce(
            (sum, item) => sum + (item.processingTime || 0),
            0,
          ) / recentUrls.length
        : 0;

    return NextResponse.json({
      stats: {
        totalDigests,
        digestsLast24h,
        avgProcessingTime: Math.round(avgProcessingTime),
        totalCached: recentUrls.length,
      },
      recentUrls: recentUrls.slice(0, 20), // Return top 20
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[SYSTEM_ERROR] Admin stats fetch failed:", error);
    return NextResponse.json(
      { error: "Failed to fetch statistics" },
      { status: 500 },
    );
  }
}
