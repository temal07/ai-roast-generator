import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request : NextRequest) {
    // Parse the FormData from the request
    const formData = await request.formData();
    // get the file property from the formData
    const file = formData.get("file");
    // if file is a falsy value
    
    if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: "No file provided"}, {status: 400});
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const imageDataUrl = `data:${file.type};base64,${base64Image}`;
    
    // File objects can't be serialized to JSON, so return file metadata instead
    return NextResponse.json({ 
        file: {
            name: file.name,
            size: file.size,
            type: file.type,
            image: imageDataUrl,
            lastModified: file.lastModified
        }
    });
}