type ErrorInfo = {
    status?: number;
    location?: string;
};
export declare const createCustomError: (message: string, errorInfo: ErrorInfo) => Error;
export declare const getErrorInfo: (err: unknown) => ErrorInfo | null;
export {};
