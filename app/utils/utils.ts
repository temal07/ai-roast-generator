import { GenerativeModel } from "@google/generative-ai";

// Helper function to convert file data to URL
export async function fileDataToURL(file : File) : Promise<string> {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    return `data:${file.type};base64,${base64}`;
}

export function prettifyText(text: string): string {
    return text
      // Convert **bold** to <strong>
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      // Convert *italic* to <em>
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Convert newlines to <br />
      .replace(/\n/g, '<br />')
      // Clean up multiple consecutive <br /> tags (optional)
      .replace(/(<br \/>){3,}/g, '<br /><br />');
  }

// Retry logic with 429 errors
export async function callGeminiWithRetry(
    model: GenerativeModel,
    prompt: string,
    images: any[],
    maxRetries = 3
  ) {
    for (let i = 0; i < maxRetries; i++) {
      try {
        const result = await model.generateContent([prompt, ...images]);
        return result.response.text();
      } catch (error: any) {
        if (error.message?.includes("429") && i < maxRetries - 1) {
          // Exponential backoff: 1s, 2s, 4s
          const waitTime = Math.pow(2, i) * 1000;
          console.log(`Rate limited. Retrying in ${waitTime}ms...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
          continue;
        }
        throw error;
      }
    }
  }