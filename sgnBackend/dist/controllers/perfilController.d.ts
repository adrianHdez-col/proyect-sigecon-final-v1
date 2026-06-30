import { Request, Response } from 'express';
export declare const getMyProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const updateMyProfile: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
