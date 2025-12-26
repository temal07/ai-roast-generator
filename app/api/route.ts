import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Helper function to convert file data to URL
async function fileDataToURL(file : File) : Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    return `data:${file.type};base64,${base64}`;
}

export async function POST(request : NextRequest) {
    // Parse the FormData from the request
    const formData = await request.formData();
    // get the file property from the formData
    console.log(formData);

    const imageA = formData.get("imageA");
    const imageB = formData.get("imageB");

    console.log(imageA, imageB);
    
    if ((!imageA || !(imageA instanceof File)) || (!imageB || !(imageB instanceof File))) {
        return NextResponse.json({ error: "Both images are required"}, {status: 400});
    }

    // turn image1 and image2 into images
    const imageADataURL = await fileDataToURL(imageA);
    const imageBDataURL = await fileDataToURL(imageB);

    // File objects can't be serialized to JSON, so return file metadata instead
    return NextResponse.json({ 
        roastA: "Roast for Image A",
        roastB: "Roast for Image B",
        winner: "Winner is Image A",
        reason: "Reason why Image A wins",
    });
}