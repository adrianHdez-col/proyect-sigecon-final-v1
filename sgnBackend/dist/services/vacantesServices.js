<<<<<<< HEAD
import { db } from '../db/connection.js';
export const getActiveVacancies = async () => {
    const [rows] = await db.query(`
    SELECT
      v.id,
      v.titulo AS title,
      v.area AS department,
      v.descripcion AS description,
      v.requisitos AS requirements,
      v.salario AS salary,
      v.tipo_contrato AS type,
      v.modalidad AS modality,
      v.fecha_limite AS deadline,
      v.estado AS status,
      e.nombre AS companyName,
      COALESCE(p.postulant_count, 0) AS applicants
    FROM vacantes v
    JOIN empresas e ON v.empresa_id = e.id
    LEFT JOIN (
      SELECT vacante_id, COUNT(*) AS postulant_count
      FROM postulaciones
      GROUP BY vacante_id
    ) p ON p.vacante_id = v.id
    WHERE v.estado = 'abierta'
    ORDER BY v.created_at DESC
  `);
    if (!Array.isArray(rows)) {
        return [];
    }
    return rows.map((vacancy) => ({
        id: vacancy.id,
        title: vacancy.title,
        department: vacancy.department || vacancy.companyName || 'General',
        description: vacancy.description,
        requirements: vacancy.requirements
            ? vacancy.requirements.split(',').map((item) => item.trim()).filter(Boolean)
            : [],
        salaryRange: vacancy.salary ? `$${Number(vacancy.salary).toLocaleString('es-CO')}` : 'N/A',
        location: vacancy.modality || 'Remoto',
        type: vacancy.type || 'N/A',
        deadline: vacancy.deadline ? new Date(vacancy.deadline).toISOString().split('T')[0] : null,
        status: vacancy.status === 'abierta' ? 'active' : 'closed',
        applicants: Number(vacancy.applicants || 0),
    }));
};
=======
export {};
>>>>>>> 0791f2620e0ffdfb7daf0b03755f026d38dd79c2
