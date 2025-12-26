// Defines all the types for a better structured Nextjs app

export type Response = {
    name: string; 
    size: number; 
    type: string; 
    image: string,
    lastModified: number;
}

export type ErrorMessageProps = {
    message: string | null;
    isFading: boolean;
}

export type ImageUploadProps = {
    onResponse: (response: Response | null) => void;
};