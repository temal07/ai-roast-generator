// Defines all the types for a better structured Nextjs app

export type Response = {
    roastA: string;
    roastB: string;
    winner: "imageA" | "imageB";
    reason: string;
};

export type ErrorMessageProps = {
    message: string | null;
    isFading: boolean;
}

export type ImageUploadProps = {
    onResponse: (response: Response | null) => void;
};