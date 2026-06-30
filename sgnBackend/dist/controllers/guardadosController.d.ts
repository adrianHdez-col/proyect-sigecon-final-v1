import { Request, Response } from 'express';
export declare const listSavedVacancies: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const saveVacancyForMe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
export declare const unsaveVacancyForMe: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>;
