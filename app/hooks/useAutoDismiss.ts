import { useEffect, useState } from "react";

export function useAutoDismiss(duration: number = 5000, fadeDuration: number = 500) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFading, setIsFading] = useState(false);

  // Auto-dismiss error message with fade effect
  useEffect(() => {
    if (errorMessage) {
      setIsFading(false);
      const fadeStartTime = duration - fadeDuration;
      
      const fadeTimer = setTimeout(() => {
        setIsFading(true);
      }, fadeStartTime);

      const removeTimer = setTimeout(() => {
        setErrorMessage(null);
        setIsFading(false);
      }, duration);

      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(removeTimer);
      };
    }
  }, [errorMessage, duration, fadeDuration]);

  const clearError = () => {
    setErrorMessage(null);
    setIsFading(false);
  };

  return {
    errorMessage,
    setErrorMessage,
    isFading,
    clearError,
  };
}

