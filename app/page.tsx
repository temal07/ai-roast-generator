"use client";

import geminiIcon from "@/public/gemini-icon.webp";
import Image from "next/image";
import { useState } from "react";
import type { Response } from "./types";
import ImageUpload from "./components/ImageUpload";


export default function Home() {
  const [response, setResponse] = useState<Response | null>(null);

  console.log(response);

  return (
    <div className="flex flex-col justify-center mt-5 gap-5 px-4 py-4">
      <ImageUpload onResponse={setResponse} />

      <div className="flex flex-col">
          {
            (response) && (
              <div className="flex flex-col gap-5 px-4 py-4">
                <div className="">
                  <Image 
                    src={response.image}
                    alt="image"
                    width={200}
                    height={200}
                    className=""
                  />
                </div>
                <div className='mb-20 max-w-max flex mr-40 ml-20'>
                    <div>
                        <Image
                            src={geminiIcon}
                            alt="gemini"
                            className='w-10 h-10 mr-4 rounded-full'
                        />
                    </div>
                    <div className='text-sm font-poppins text-gray-900 bg-gray-300 p-4 rounded-lg'>
                        File uploaded: {response.name} ({(response.size / 1024).toFixed(2)} KB)
                    </div>
                </div>
              </div>
            )
          }
      </div>
    </div>
  );
}
