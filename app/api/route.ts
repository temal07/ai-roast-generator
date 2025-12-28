// app/api/roast/route.ts

import { NextRequest, NextResponse } from "next/server";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { callGeminiWithRetry, fileDataToURL, hashImageData } from "../utils/utils";
import crypto from "crypto";
import PQueue from "p-queue";

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// 1-hour deterministic cache
type RoastCacheItem = { text: string; timestamp: number };
const roastCache = new Map<string, RoastCacheItem>();
const CACHE_MAX_AGE = 1000 * 60 * 60; // 1 hour

// Queue to serialize API calls
const queue = new PQueue({ concurrency: 1 });

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageA = formData.get("imageA");
    const imageB = formData.get("imageB");

    if ((!imageA || !(imageA instanceof File)) || (!imageB || !(imageB instanceof File))) {
      return NextResponse.json({ error: "Both images are required" }, { status: 400 });
    }

    const imageADataURL = await fileDataToURL(imageA);
    const imageBDataURL = await fileDataToURL(imageB);

    const hashA = hashImageData(imageADataURL.split(",")[1]);
    const hashB = hashImageData(imageBDataURL.split(",")[1]);
    const cacheKey = crypto.createHash("sha256").update([hashA, hashB].sort().join("-")).digest("hex");

    // Always use cached response if available
    const now = Date.now();
    const cachedItem = roastCache.get(cacheKey);
    if (cachedItem && now - cachedItem.timestamp < CACHE_MAX_AGE) {
      return NextResponse.json({ text: cachedItem.text });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = `
      You are a comedian. You will receive two images below.
      Your task is to roast BOTH images in a playful, non-derogatory way.

      Rules:
      - Check if the images are of a person/people. If not, STOP and remind user to upload a person.
      - Describe the images
      - Use sarcasm
      - Use real-world analogies
      - Use jokes sparingly
      - Casual slang is allowed

      Return in this exact order:
      1. Image A Roast (IN BOLD)
      2. Image B Roast (IN BOLD)
      3. Winner: imageA or imageB (IN BOLD)
      4. Reasoning for your choice (IN BOLD)
    `;

    const getMimeType = (dataURL: string) =>
      dataURL.match(/^data:([^;]+);base64/)?.[1] || "application/octet-stream";

    const imageParts = [
      { inlineData: { mimeType: getMimeType(imageADataURL), data: imageADataURL.split(",")[1] } },
      { inlineData: { mimeType: getMimeType(imageBDataURL), data: imageBDataURL.split(",")[1] } },
    ];

    // Queue API call to prevent hitting rate limits
    const text = await queue.add(() => callGeminiWithRetry(model, prompt, imageParts));

    // Store result in cache
    roastCache.set(cacheKey, { text, timestamp: now });

    return NextResponse.json({ text });
  } catch (error: any) {
    console.error("Gemini API error:", error);

    if (error.message?.includes("429")) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again shortly.", retryAfter: 5 },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate roast", details: error.message },
      { status: 500 }
    );
  }
}
