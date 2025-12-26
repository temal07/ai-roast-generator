"use client";

import { ChangeEvent, useState } from "react";
import type { ImageUploadProps } from "../types";
import { useAutoDismiss } from "../hooks/useAutoDismiss";
import ErrorMessage from "./ErrorMessage";
import { useFileUpload } from "../hooks/useFileUpload";

export default function ImageUpload({ onResponse }: ImageUploadProps) {
  // with the values returned from useFileUplaod.ts, destructure them and you'll 
  // be able to use them here as well

  const { handleOnChange, handleSubmit, isLoading, selectedFile, errorMessage, isFading } = useFileUpload({ onResponse });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="flex flex-col items-center justify-center w-full max-w-xs px-4 py-2 bg-white text-blue-600 rounded-lg shadow-md tracking-wide uppercase border border-blue-500 cursor-pointer hover:bg-blue-50 transition duration-150">
        <svg className="w-6 h-6 mb-1 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5-6 5 6M12 4.5V14" />
        </svg>
        <span className="text-base leading-normal">{selectedFile ? selectedFile.name : "Choose a file"}</span>
        <input 
          type="file" 
          name="file" 
          className="hidden" 
          onChange={handleOnChange}
        />
      </label>
      <button type="submit" className="bg-blue-500 text-white rounded-md p-2 max-w-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed" disabled={isLoading || !selectedFile}>{isLoading ? "Generating..." : "Generate Roast"}</button>
      <ErrorMessage message={errorMessage} isFading={isFading} />
    </form>
  );
}