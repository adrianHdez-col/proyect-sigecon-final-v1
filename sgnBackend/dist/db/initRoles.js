import { db } from './connection.js';
const DEFAULT_ROLES = [
    { nombre: 'SU', descripcion: 'Super Administrador - control total del sistema' },
    { nombre: 'RRHH', descripcion: 'Administrador de Recursos Humanos - gestión de vacantes y candidatos' },
    { nombre: 'Evaluador', descripcion: 'Psicólogo o evaluador técnico' },
    { nombre: 'Candidato', descripcion: 'Aspirante a vacantes' },
];
export const initializeRoles = async () => {
    const [rows] = await db.query('SELECT nombre FROM roles');
    const existingRoles = Array.isArray(rows) ? rows.map((row) => row.nombre) : [];
    const missingRoles = DEFAULT_ROLES.filter((role) => !existingRoles.includes(role.nombre));
    if (missingRoles.length === 0) {
        return;
    }
    const insertQuery = 'INSERT INTO roles (nombre, descripcion) VALUES ?';
    const values = missingRoles.map((role) => [role.nombre, role.descripcion]);
    await db.query(insertQuery, [values]);
};
