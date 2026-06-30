<<<<<<< HEAD
import { db } from '../db/connection.js';
import { AppError } from './userService.js';
export const getCandidateApplications = async (candidateId) => {
    const [rows] = await db.query(`SELECT
      p.id AS id,
      p.vacante_id AS vacancyId,
      p.fecha_postulacion AS appliedDate,
      p.estado AS status,
      p.comentarios AS comments,
      v.titulo AS vacancyTitle,
      v.area AS department,
      e.nombre AS companyName
    FROM postulaciones p
    JOIN vacantes v ON p.vacante_id = v.id
    JOIN empresas e ON v.empresa_id = e.id
    WHERE p.candidato_id = ?
    ORDER BY p.fecha_postulacion DESC`, [candidateId]);
    return Array.isArray(rows) ? rows : [];
};
export const createApplication = async (candidateId, vacancyId, comments) => {
    try {
        const [result] = await db.execute('INSERT INTO postulaciones (vacante_id, candidato_id, comentarios) VALUES (?, ?, ?)', [vacancyId, candidateId, comments]);
        return result.insertId;
    }
    catch (error) {
        if (error?.code === 'ER_DUP_ENTRY') {
            throw new AppError('Ya te has postulado a esta vacante.', 409);
        }
        throw error;
    }
};
=======
export {};
>>>>>>> 0791f2620e0ffdfb7daf0b03755f026d38dd79c2
