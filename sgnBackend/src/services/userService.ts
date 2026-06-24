import { db } from '../db/connection.js';

export const getUserByEmail = async (email: string) => {
  const [rows] = await db.query(
    `SELECT u.id, u.email, u.password_hash, u.nombre_completo, u.telefono, u.empresa, u.activo, r.nombre AS role
     FROM usuarios u
     JOIN roles r ON u.rol_id = r.id
     WHERE u.email = ?`,
    [email]
  );

  return Array.isArray(rows) && rows.length > 0 ? (rows[0] as any) : null;
};

export const createUser = async (data: {
  fullName: string;
  email: string;
  passwordHash: string;
  role: string;
  company?: string | null;
}) => {
  const roleName = data.role === 'recruiter' ? 'RRHH' : data.role === 'admin' ? 'SU' : data.role === 'evaluator' ? 'Evaluador' : 'Candidato';
  const [roleRows] = await db.query('SELECT id FROM roles WHERE nombre = ?', [roleName]);
  const roleRecord = Array.isArray(roleRows) && roleRows.length > 0 ? (roleRows[0] as any) : null;

  if (!roleRecord) {
    throw new Error(`Role not found: ${roleName}`);
  }

  const [result] = await db.execute(
    'INSERT INTO usuarios (rol_id, email, password_hash, nombre_completo, telefono, empresa) VALUES (?, ?, ?, ?, ?, ?)',
    [roleRecord.id, data.email, data.passwordHash, data.fullName, null, data.company || null]
  );

  return (result as any).insertId;
};
