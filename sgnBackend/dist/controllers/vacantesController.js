<<<<<<< HEAD
import { getActiveVacancies } from '../services/vacantesServices.js';
export const listVacancies = async (_req, res) => {
    try {
        const vacancies = await getActiveVacancies();
        return res.status(200).json({ success: true, data: vacancies });
    }
    catch (error) {
        console.error('List vacancies error:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
=======
export {};
>>>>>>> 0791f2620e0ffdfb7daf0b03755f026d38dd79c2
