import { db } from '../db/connection.js';

export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export const getUserByEmail = async (email: string) => {
  const [rows] = await db.query(
    `SELECT u.id, u.email, u.password_hash, u.nombre_completo, u.telefono, u.activo,
            u.empresa_id AS empresaId,
            e.nombre AS empresaNombre,
            r.nombre AS role
     FROM usuarios u
     JOIN roles r ON u.rol_id = r.id
     LEFT JOIN empresas e ON u.empresa_id = e.id
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
  const roleName =
    data.role === 'recruiter'
      ? 'RRHH'
      : data.role === 'admin'
      ? 'SU'
      : data.role === 'evaluator'
      ? 'Evaluador'
      : 'Candidato';

  const [roleRows] = await db.query('SELECT id FROM roles WHERE nombre = ?', [roleName]);
  const roleRecord = Array.isArray(roleRows) && roleRows.length > 0 ? (roleRows[0] as any) : null;

  if (!roleRecord) {
    throw new AppError(`Role not found: ${roleName}`, 400);
  }

  let companyId = null;
  if (data.company) {
    const [companyRows] = await db.query('SELECT id FROM empresas WHERE nombre = ?', [data.company]);
    if (Array.isArray(companyRows) && companyRows.length > 0) {
      companyId = (companyRows[0] as any).id;
    } else if (data.role === 'recruiter') {
      throw new AppError(`La empresa '${data.company}' no está registrada en el sistema.`, 400);
    }
  }

  const [result] = await db.execute(
    'INSERT INTO usuarios (rol_id, email, password_hash, nombre_completo, telefono, empresa_id) VALUES (?, ?, ?, ?, ?, ?)',
    [roleRecord.id, data.email, data.passwordHash, data.fullName, null, companyId]
  );

  return (result as any).insertId;
};
