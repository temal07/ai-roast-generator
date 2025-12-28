"use client";

import geminiIcon from "@/public/gemini-icon.webp";
import Image from "next/image";
import { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import { prettifyText } from "./utils/utils";


export default function Home() {
  const [response, setResponse] = useState<string | null>(null);

  console.log(response);

  return (
    <div className="flex flex-col justify-center mt-5 gap-5 px-4 py-4">
      <ImageUpload onResponse={setResponse} />

      <div className="flex flex-col">
          {
            (response) && (
              <div className="flex flex-col gap-5 px-4 py-4">
                <div className='mb-20 max-w-max flex mr-40 ml-20'>
                    <div>
                        <Image
                            src={geminiIcon}
                            alt="gemini"
                            className='w-40 h-10 mr-4 rounded-full'
                        />
                    </div>
                    <div
                      className="text-sm font-poppins text-gray-900 bg-gray-300 p-4 rounded-lg"
                      dangerouslySetInnerHTML={{ __html: response }}
                    />
                </div>
              </div>
            )
          }
      </div>
    </div>
  );
}
