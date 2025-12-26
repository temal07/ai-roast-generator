import { ChangeEvent, useState } from "react";
import type { ImageUploadProps, Response } from "../types";
import { useAutoDismiss } from "./useAutoDismiss";

export function useFileUpload({ onResponse } : ImageUploadProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const { errorMessage, setErrorMessage, isFading, clearError } = useAutoDismiss();

    // after change in file selection
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setSelectedFile(null);
      clearError();
      return;
    }

    if (file.type.startsWith("image/")) {
      setSelectedFile(file);
      clearError();
    } else {
      setSelectedFile(null);
      setErrorMessage("Only image files are supported. Please select an image file (.jpg, .jpeg, .png, etc.)");
    }
  };

  // after submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    // prevents full page reload (which is the default behaviour)
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file"); // could be File, string, or null

    // that's why you add !(file instanceof File)
    if (!file || !(file instanceof File)) {
      return;
    }
    // create a loading effect
    setIsLoading(true);

    try {
      // make a call to the backend url
      const res = await fetch("/api", {
        // method and body, method is POST, since you're sending stuff
        // body is the stuff you're sending. In this case, it's the formData
        method: "POST",
        body: formData,
      });

      // if the response is a falsy value
      if (!res.ok) {
        throw new Error(`Error status: ${res.status}`);
      }
      
      // await the response and store it in data
      const data = await res.json();
      // log it
      onResponse(data.file);
    } catch(error) {
      console.error("Error uploading file: ", error);
    } finally {
      setIsLoading(false);
    }
  };

  // At the end of the function, return EVERYTHING
  return {
    handleOnChange,
    handleSubmit,
    isLoading,
    selectedFile,
    errorMessage,
    isFading,
  }
}