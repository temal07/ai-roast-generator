"use client";

import type { ImageUploadProps } from "../types";
import ErrorMessage from "./ErrorMessage";
import { useFileUpload } from "../hooks/useFileUpload";
import Image from "next/image";

export default function ImageUpload({ onResponse }: ImageUploadProps) {
  const {
    handleOnChangeA,
    handleOnChangeB,
    handleSubmit,
    isLoading,
    selectedFileA,
    selectedFileB,
    errorMessage,
    previewA,
    previewB,
  } = useFileUpload({ onResponse });

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col w-full max-w-md mx-auto"
    >
      {/* Upload Grid */}
      <div className="grid grid-cols-2 gap-8">
        {/* ---------- IMAGE A ---------- */}
        <div className="flex flex-col items-center gap-3">
          {/* Upload Button */}
          <label className="cursor-pointer">
            <div className="px-4 py-4 border rounded-lg flex items-center justify-center bg-white shadow-md hover:bg-blue-50 transition">
              <span className="text-blue-600 text-sm text-center font-bold">
                Choose first image
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleOnChangeA}
            />
          </label>

          {/* Preview */}
          {previewA && (
            <div className="w-40 h-40 border rounded-lg overflow-hidden">
              <Image
                src={previewA}
                alt="First image preview"
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Filename */}
          {selectedFileA && (
            <span className="text-xs text-gray-600 truncate w-40 text-center">
              {selectedFileA.name}
            </span>
          )}
        </div>

        {/* ---------- IMAGE B ---------- */}
        <div className="flex flex-col items-center gap-3">
          {/* Upload Button */}
          <label className="cursor-pointer">
            <div className="px-4 py-4 border rounded-lg flex items-center justify-center bg-white shadow-md hover:bg-blue-50 transition">
              <span className="text-blue-600 text-sm text-center font-bold">
                Choose second image
              </span>
            </div>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleOnChangeB}
            />
          </label>

          {/* Preview */}
          {previewB && (
            <div className="w-40 h-40 border rounded-lg overflow-hidden">
              <Image
                src={previewB}
                alt="Second image preview"
                width={160}
                height={160}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          {/* Filename */}
          {selectedFileB && (
            <span className="text-xs text-gray-600 truncate w-40 text-center">
              {selectedFileB.name}
            </span>
          )}
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading || !selectedFileA || !selectedFileB}
        className="mt-10 bg-blue-500 text-white rounded-md p-2 disabled:opacity-50 disabled:cursor-not-allowed transition cursor-pointer"
      >
        {isLoading ? "Generating..." : "Generate Roast"}
      </button>

      {/* Error */}
      {errorMessage && (
        <ErrorMessage message={errorMessage} isFading={false} />
      )}
    </form>
  );
}
