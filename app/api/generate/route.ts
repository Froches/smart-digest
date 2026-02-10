import { NextRequest, NextResponse } from "next/server";
import { generateObject } from "ai";
import { google } from "@ai-sdk/google";
import * as cheerio from "cheerio";
import { digestSchema } from "@/lib/schema";

export async function POST(req: NextRequest) {
  try {
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

    // Scrape the webpage
    const response = await fetch(validUrl.toString(), {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; SmartDigest/1.0)",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: `Failed to fetch URL: ${response.statusText}` },
        { status: response.status },
      );
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

    // Generate structured summary using AI
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

Make the quiz questions meaningful and test understanding of the main concepts.`,
    });

    return NextResponse.json(result.object);
  } catch (error) {
    console.error("Error processing request:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
      },
      { status: 500 },
    );
  }
}
