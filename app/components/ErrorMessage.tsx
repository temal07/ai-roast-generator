import type { ErrorMessageProps } from "../types";

export default function ErrorMessage({ message, isFading }: ErrorMessageProps) {
  if (!message) return null;

  return (
    <div className={`bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md max-w-md transition-opacity duration-500 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
      <p className="text-sm">{message}</p>
    </div>
  );
}