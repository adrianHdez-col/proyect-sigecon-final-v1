import { Request, Response } from 'express';
import { getActiveVacancies } from '../services/vacantesServices.js';

export const listVacancies = async (_req: Request, res: Response) => {
  try {
    const vacancies = await getActiveVacancies();
    return res.status(200).json({ success: true, data: vacancies });
  } catch (error) {
    console.error('List vacancies error:', error);
    return res.status(500).json({ message: 'Error interno del servidor.' });
  }
};
