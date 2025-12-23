"use client";

import geminiIcon from "@/public/gemini-icon.webp";
import Image from "next/image";
import { useState } from "react";

function prettifyText(text: string): string {
  return text.replace(/\n/g, "<br />");
}

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<{ message: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const prompt = formData.get("prompt") as string | null;
    if (!prompt) {
      return;
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      console.log(data);
      const message = data.message || "No response generated";
      setResponse({ message });
    } catch (error) {
      console.error("Error generating roast:", error);
      setResponse({ message: "Error generating roast. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center mt-5 gap-5 px-4 py-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <input type="text" placeholder="Enter a name" name="prompt" required className="border-2 border-gray-300 rounded-md p-2 max-w-3xl" />
        <button type="submit" className="bg-blue-500 text-white rounded-md p-2 max-w-3xl" disabled={isLoading}>{isLoading ? "Generating..." : "Generate Roast"}</button>
      </form>

      <div className="flex flex-col">
      <div>
            {
                response && (
                    <div className='mb-20 max-w-max flex mr-40 ml-20'>
                        <div>
                            <Image
                                src={geminiIcon}
                                alt="gemini"
                                width={70}
                                height={70}
                                className='w-10 h-10 mr-4 rounded-full'
                            />
                        </div>
                        <div className='text-sm font-poppins text-gray-900 bg-gray-300 p-4 rounded-lg' dangerouslySetInnerHTML={{ __html: prettifyText(response.message) }} />      
                    </div>
                )
            }
        </div>
      </div>
    </div>
  );
}
