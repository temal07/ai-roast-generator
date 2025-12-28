import { NextRequest, NextResponse } from "next/server";
import { GenerativeModel, GoogleGenerativeAI } from "@google/generative-ai";
import { fileDataToURL, callGeminiWithRetry } from "../utils/utils";

// Initialise Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
  // Parse the FormData from the request
  const formData = await request.formData();

  const imageA = formData.get("imageA");
  const imageB = formData.get("imageB");

  if ((!imageA || !(imageA instanceof File)) || (!imageB || !(imageB instanceof File))) {
    return NextResponse.json({ error: "Both images are required" }, { status: 400 });
  }

  // Convert files to Data URLs
  const imageADataURL = await fileDataToURL(imageA);
  const imageBDataURL = await fileDataToURL(imageB);

  try {
    // Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Create the prompt
    const prompt = `
      You are a comedian. You will receive two images below.
      Your task is to roast BOTH images in a playful, non-derogatory way.

      Rules:
      - Describe the images
      - Use sarcasm
      - Use real-world analogies
      - Use jokes sparingly
      - Casual slang is allowed

      Return in this exact order:
      1. Image A Roast (IN BOLD FONT)
      2. Image B Roast (IN BOLD FONT)
      3. Winner: imageA or imageB (IN BOLD FONT)
      4. Reasoning for your choice (IN BOLD FONT)
    `;

    // Prepare image parts for Gemini
    // Extract base64 data and mime type from data URLs
    const imageAParts = imageADataURL.split(",");
    const imageBParts = imageBDataURL.split(",");
    
    // Get mime types from data URL (e.g., "data:image/jpeg;base64")
    const imageAMimeType = imageAParts[0].match(/:(.*?);/)?.[1] || "image/jpeg";
    const imageBMimeType = imageBParts[0].match(/:(.*?);/)?.[1] || "image/jpeg";

    const imageParts = [
      {
        inlineData: {
          mimeType: imageAMimeType,
          data: imageAParts[1],
        },
      },
      {
        inlineData: {
          mimeType: imageBMimeType,
          data: imageBParts[1],
        },
      },
    ];

    // Call Gemini with retry logic
    const text = await callGeminiWithRetry(model, prompt, imageParts);

    return NextResponse.json({ text });
    
  } catch (error: any) {
    console.error("Gemini API error:", error);
    
    if (error.message?.includes("429")) {
      return NextResponse.json(
        { 
          error: "Rate limit exceeded. Please try again in a few seconds.",
          retryAfter: 5 
        },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Failed to generate roast", details: error.message },
      { status: 500 }
    );
  }
}