import { Request, Response } from 'express';
export declare const getMyApplications: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const applyToVacancy: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
