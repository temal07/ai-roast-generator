import { ChangeEvent, useEffect, useState } from "react";
import type { ImageUploadProps } from "../types";
import { useAutoDismiss } from "./useAutoDismiss";
import { prettifyText } from "../utils/utils";

export function useFileUpload({ onResponse } : ImageUploadProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFileA, setSelectedFileA] = useState<File | null>(null);
    const [selectedFileB, setSelectedFileB] = useState<File | null>(null);
    const { errorMessage, setErrorMessage, isFading, clearError } = useAutoDismiss();

    // previews are string, which will then be converted to images
    const [previewA, setPreviewA] = useState<string | null>(null);
    const [previewB, setPreviewB] = useState<string | null>(null);

    // after change in file selection
    const handleOnChangeA = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setSelectedFileA(e.target.files[0]);
      };
    
    const handleOnChangeB = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files?.[0]) setSelectedFileB(e.target.files[0]);
    };


    // Use effects for image preview
    useEffect(() => {
        if (!selectedFileA) {
          setPreviewA(null);
          return;
        }

        const url = URL.createObjectURL(selectedFileA);
        setPreviewA(url);

        // revokeObjectURL() --> cleanup
        return () => URL.revokeObjectURL(url);
    }, [selectedFileA]);
    
    useEffect(() => {
      if (!selectedFileB) {
        setPreviewB(null);
        return;
      }
  
      const url = URL.createObjectURL(selectedFileB);
      setPreviewB(url);
  
      return () => URL.revokeObjectURL(url);
    }, [selectedFileB]);

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
      console.log(data);

      const pretty = prettifyText(data.text); // pass the actual text
      console.log("API response:", pretty);
      onResponse(pretty);
    } catch (error) {
      console.error("Error generating response:", error);
      setErrorMessage("Error Generating response, please try again.");
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
    previewA,
    previewB,
  }
}