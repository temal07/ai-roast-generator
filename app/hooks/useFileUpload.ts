import { ChangeEvent, useState } from "react";
import type { ImageUploadProps, Response } from "../types";
import { useAutoDismiss } from "./useAutoDismiss";

export function useFileUpload({ onResponse } : ImageUploadProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFileA, setSelectedFileA] = useState<File | null>(null);
    const [selectedFileB, setSelectedFileB] = useState<File | null>(null);
    const { errorMessage, setErrorMessage, isFading, clearError } = useAutoDismiss();

    // after change in file selection
    const handleOnChangeA = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setSelectedFileA(e.target.files[0]);
      };
    
    const handleOnChangeB = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setSelectedFileB(e.target.files[0]);
    };

  // after submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // prevents full page reload (which is the default behaviour)
    e.preventDefault();
    if (!selectedFileA || !selectedFileB) {
      setErrorMessage("Please select both images.");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    const formData = new FormData();
    formData.append("imageA", selectedFileA);
    formData.append("imageB", selectedFileB);

    try {
      const res = await fetch("/api", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        throw new Error(`Error status: ${res.status}`);
      }

      const data = await res.json();
      console.log("API response:", data);
      onResponse(data);
    } catch (error) {
      console.error("Error uploading files:", error);
      setErrorMessage("Upload failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // At the end of the function, return EVERYTHING
  return {
    handleOnChangeA,
    handleOnChangeB,
    handleSubmit,
    isLoading,
    selectedFileA,
    selectedFileB,
    errorMessage,
    isFading,
  }
}