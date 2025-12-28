// Defines all the types for a better structured Nextjs app
export type ErrorMessageProps = {
    message: string | null;
    isFading: boolean;
}

export type ImageUploadProps = {
    onResponse: (response: string | null) => void;
};