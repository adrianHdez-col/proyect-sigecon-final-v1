import { db } from '../db/connection.js';
export const getSavedVacancyIds = async (userId) => {
    const [rows] = await db.query('SELECT vacante_id AS vacancyId FROM candidato_guardados WHERE usuario_id = ? ORDER BY created_at DESC', [userId]);
    return Array.isArray(rows) ? rows.map((row) => Number(row.vacancyId)) : [];
};
export const saveVacancy = async (userId, vacancyId) => {
    await db.execute('INSERT IGNORE INTO candidato_guardados (usuario_id, vacante_id) VALUES (?, ?)', [userId, vacancyId]);
    return getSavedVacancyIds(userId);
};
export const unsaveVacancy = async (userId, vacancyId) => {
    await db.execute('DELETE FROM candidato_guardados WHERE usuario_id = ? AND vacante_id = ?', [userId, vacancyId]);
    return getSavedVacancyIds(userId);
};
