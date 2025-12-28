"use client";

import geminiIcon from "@/public/gemini-icon.webp";
import Image from "next/image";
import { useState } from "react";
import ImageUpload from "./components/ImageUpload";
import { prettifyText } from "./utils/utils";
import Instructions from "./components/Instructions";
import Footer from "./components/Footer";


export default function Home() {
  const [response, setResponse] = useState<string | null>(null);

  return (
    <div className="flex flex-col justify-center mt-5 gap-5 px-4 py-4">
      <Instructions />
      <ImageUpload onResponse={setResponse} />
      <div className="flex flex-col">
          {
            (response) && (
              <div className="flex flex-col gap-5 px-2 py-4 sm:px-4">
                <div className="flex flex-col sm:flex-row items-start mb-10 sm:mb-20 max-w-full sm:max-w-2xl mx-auto">
                  <div className="shrink-0 mb-4 sm:mb-0 sm:mr-4 flex items-center">
                    <Image
                      src={geminiIcon}
                      alt="gemini"
                      className="w-12 h-12 sm:w-12 sm:h-12 md:w-12 md:h-12 rounded-full"
                      priority
                    />
                  </div>
                  <div
                    className="text-sm font-poppins text-gray-900 bg-gray-300 p-3 sm:p-4 rounded-lg w-full break-words"
                    dangerouslySetInnerHTML={{ __html: response }}
                  />
                </div>
              </div>
            )
          }
      </div>
      <Footer />
    </div>
  );
}
