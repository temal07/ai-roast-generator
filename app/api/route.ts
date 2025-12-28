import { NextRequest, NextResponse } from "next/server";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { fileDataToURL, callGeminiWithRetry, hashImageData } from "../utils/utils";
import crypto from "crypto";

// Initialise Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Hybrid + time-based caching
type RoastCacheItem = { text: string; timestamp: number };
const roastCache = new Map<string, RoastCacheItem>();
const CACHE_MAX_AGE = 1000 * 60 * 5; // 5 minutes

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const imageA = formData.get("imageA");
  const imageB = formData.get("imageB");

  if ((!imageA || !(imageA instanceof File)) || (!imageB || !(imageB instanceof File))) {
    return NextResponse.json({ error: "Both images are required" }, { status: 400 });
  }

  const imageADataURL = await fileDataToURL(imageA);
  const imageBDataURL = await fileDataToURL(imageB);

  try {
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

    const imageAParts = imageADataURL.split(",");
    const imageBParts = imageBDataURL.split(",");

    const imageAMimeType = imageAParts[0].match(/^data:([^;]+);base64$/)?.[1] || "application/octet-stream";
    const imageBMimeType = imageBParts[0].match(/^data:([^;]+);base64$/)?.[1] || "application/octet-stream";

    const imageParts = [
      { inlineData: { mimeType: imageAMimeType, data: imageAParts[1] } },
      { inlineData: { mimeType: imageBMimeType, data: imageBParts[1] } },
    ];

    const hashA = hashImageData(imageADataURL.split(",")[1]);
    const hashB = hashImageData(imageBDataURL.split(",")[1]);
    const cacheKey = crypto.createHash("sha256").update([hashA, hashB].sort().join("-")).digest("hex");

    const now = Date.now();
    const cachedItem = roastCache.get(cacheKey);

    // Hybrid cache logic: 60% chance to use cache if valid
    if (cachedItem && now - cachedItem.timestamp < CACHE_MAX_AGE) {
      if (Math.random() < 0.6) {
        return NextResponse.json({ text: cachedItem.text });
      }
    }

    // Fresh API call
    const text = await callGeminiWithRetry(model, prompt, imageParts);
    roastCache.set(cacheKey, { text, timestamp: now });

    return NextResponse.json({ text });

  } catch (error: any) {
    console.error("Gemini API error:", error);

    if (error.message?.includes("429")) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again in a few seconds.", retryAfter: 5 },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate roast", details: error.message },
      { status: 500 }
    );
  }
}
