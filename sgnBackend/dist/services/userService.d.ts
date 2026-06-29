export declare class AppError extends Error {
    statusCode: number;
    constructor(message: string, statusCode?: number);
}
export declare const getUserByEmail: (email: string) => Promise<any>;
export declare const createUser: (data: {
    fullName: string;
    email: string;
    passwordHash: string;
    role: string;
    company?: string | null;
}) => Promise<any>;
