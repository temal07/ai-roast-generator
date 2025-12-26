"use client";

import { ChangeEvent, useState } from "react";
import type { ImageUploadProps } from "../types";
import { useAutoDismiss } from "../hooks/useAutoDismiss";
import ErrorMessage from "./ErrorMessage";
import { useFileUpload } from "../hooks/useFileUpload";

export default function ImageUpload({ onResponse }: ImageUploadProps) {
  // with the values returned from useFileUplaod.ts, destructure them and you'll 
  // be able to use them here as well (this is basically how you create a custom hook in React)

  const { handleOnChangeA, handleOnChangeB, handleSubmit, isLoading, selectedFileA, selectedFileB, errorMessage } = useFileUpload({ onResponse });

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 max-w-md mx-auto">
      <label className="flex flex-col items-center justify-center px-4 py-2 bg-white text-blue-600 rounded-lg shadow-md cursor-pointer hover:bg-blue-50">
        <span>{selectedFileA ? selectedFileA.name : "Choose first image"}</span>
        <input type="file" accept="image/*" className="hidden" onChange={handleOnChangeA} />
      </label>
      
      <label className="flex flex-col items-center justify-center px-4 py-2 bg-white text-blue-600 rounded-lg shadow-md cursor-pointer hover:bg-blue-50">
        <span>{selectedFileB ? selectedFileB.name : "Choose second image"}</span>
        <input type="file" accept="image/*" className="hidden" onChange={handleOnChangeB} />
      </label>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-500 text-white rounded-md p-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading || !selectedFileA || !selectedFileB}
      >
        {isLoading ? "Generating..." : "Generate Roast"}
      </button>

      {errorMessage && <ErrorMessage message={errorMessage} isFading={false} />}
    </form>
  );
}