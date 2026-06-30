import { getSavedVacancyIds, saveVacancy, unsaveVacancy } from '../services/guardadosService.js';
export const listSavedVacancies = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }
        const vacancyIds = await getSavedVacancyIds(Number(user.id));
        return res.status(200).json({ success: true, data: vacancyIds });
    }
    catch (error) {
        console.error('List saved vacancies error:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
export const saveVacancyForMe = async (req, res) => {
    try {
        const user = req.user;
        const { vacancyId } = req.body;
        if (!user?.id) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }
        if (!vacancyId) {
            return res.status(400).json({ message: 'vacancyId es obligatorio.' });
        }
        const vacancyIds = await saveVacancy(Number(user.id), Number(vacancyId));
        return res.status(200).json({ success: true, data: vacancyIds });
    }
    catch (error) {
        console.error('Save vacancy error:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
export const unsaveVacancyForMe = async (req, res) => {
    try {
        const user = req.user;
        const vacancyId = Number(req.params.vacancyId);
        if (!user?.id) {
            return res.status(401).json({ message: 'Usuario no autenticado.' });
        }
        if (!vacancyId) {
            return res.status(400).json({ message: 'vacancyId no valido.' });
        }
        const vacancyIds = await unsaveVacancy(Number(user.id), vacancyId);
        return res.status(200).json({ success: true, data: vacancyIds });
    }
    catch (error) {
        console.error('Unsave vacancy error:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
