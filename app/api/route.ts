import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { fileDataToURL, callGeminiWithRetry, hashImageData } from "../utils/utils";
import crypto from "crypto";

// Initialise Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Cache + in-flight locking
type RoastCacheItem = { text: string; timestamp: number };
const roastCache = new Map<string, RoastCacheItem>();
const inFlight = new Map<string, Promise<string>>();

const CACHE_MAX_AGE = 1000 * 60 * 60; // 1 hour

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageA = formData.get("imageA");
    const imageB = formData.get("imageB");

    if (!(imageA instanceof File) || !(imageB instanceof File)) {
      return NextResponse.json(
        { error: "Both images are required" },
        { status: 400 }
      );
    }

    const imageADataURL = await fileDataToURL(imageA);
    const imageBDataURL = await fileDataToURL(imageB);

    const hashA = hashImageData(imageADataURL.split(",")[1]);
    const hashB = hashImageData(imageBDataURL.split(",")[1]);

    const cacheKey = crypto
      .createHash("sha256")
      .update([hashA, hashB].sort().join("-"))
      .digest("hex");

    const now = Date.now();

    // ✅ HARD CACHE HIT
    const cached = roastCache.get(cacheKey);
    if (cached && now - cached.timestamp < CACHE_MAX_AGE) {
      return NextResponse.json({ text: cached.text });
    }

    // ✅ IN-FLIGHT DEDUPLICATION
    if (inFlight.has(cacheKey)) {
      const text = await inFlight.get(cacheKey)!;
      return NextResponse.json({ text });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

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

    const imageParts = [
      {
        inlineData: {
          mimeType:
            imageAParts[0].match(/^data:([^;]+);base64$/)?.[1] ??
            "application/octet-stream",
          data: imageAParts[1],
        },
      },
      {
        inlineData: {
          mimeType:
            imageBParts[0].match(/^data:([^;]+);base64$/)?.[1] ??
            "application/octet-stream",
          data: imageBParts[1],
        },
      },
    ];

    // 🔒 SINGLE AUTHORITATIVE PROMISE
    const promise = (async () => {
      console.log("Calling Gemini for cacheKey:", cacheKey);
      const text = await callGeminiWithRetry(model, prompt, imageParts);
      roastCache.set(cacheKey, { text, timestamp: Date.now() });
      return text;
    })();

    inFlight.set(cacheKey, promise);

    try {
      const text = await promise;
      return NextResponse.json({ text });
    } finally {
      inFlight.delete(cacheKey);
    }
  } catch (error: any) {
    console.error("Route error:", error);

    if (error?.message?.includes("429")) {
      return NextResponse.json(
        {
          error: "Rate limit exceeded. Please try again shortly.",
          retryAfter: 5,
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate roast" },
      { status: 500 }
    );
  }
}
