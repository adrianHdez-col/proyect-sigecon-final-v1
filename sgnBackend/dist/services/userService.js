import { db } from '../db/connection.js';
export class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
export const getUserByEmail = async (email) => {
    const [rows] = await db.query(`SELECT u.id, u.email, u.password_hash, u.nombre_completo, u.telefono, u.activo,
            u.empresa_id AS empresaId,
            e.nombre AS empresaNombre,
            r.nombre AS role
     FROM usuarios u
     JOIN roles r ON u.rol_id = r.id
     LEFT JOIN empresas e ON u.empresa_id = e.id
     WHERE u.email = ?`, [email]);
    return Array.isArray(rows) && rows.length > 0 ? rows[0] : null;
};
const generateSubdomain = (name) => {
    const normalized = name
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
    return normalized || `empresa-${Date.now()}`;
};
const getUniqueSubdomain = async (baseName) => {
    let subdomain = generateSubdomain(baseName);
    let suffix = 0;
    while (true) {
        const candidate = suffix === 0 ? subdomain : `${subdomain}-${suffix}`;
        const [rows] = await db.query('SELECT id FROM empresas WHERE subdominio = ?', [candidate]);
        if (!Array.isArray(rows) || rows.length === 0) {
            return candidate;
        }
        suffix += 1;
    }
};
const findOrCreateCompany = async (data) => {
    const [companyRows] = await db.query('SELECT id FROM empresas WHERE nombre = ? OR nit = ? OR email_contacto = ?', [data.companyName, data.companyNit || null, data.companyEmail || null]);
    if (Array.isArray(companyRows) && companyRows.length > 0) {
        return companyRows[0].id;
    }
    const subdominio = await getUniqueSubdomain(data.companyName);
    const [result] = await db.execute('INSERT INTO empresas (nombre, nit, direccion, telefono, email_contacto, sitio_web, subdominio, activo) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', [
        data.companyName,
        data.companyNit || null,
        data.companyAddress || null,
        data.companyPhone || null,
        data.companyEmail || null,
        data.companyWebsite || null,
        subdominio,
        true,
    ]);
    return result.insertId;
};
export const createUser = async (data) => {
    const roleName = data.role === 'recruiter'
        ? 'RRHH'
        : data.role === 'admin'
            ? 'SU'
            : data.role === 'evaluator'
                ? 'Evaluador'
                : 'Candidato';
    const [roleRows] = await db.query('SELECT id FROM roles WHERE nombre = ?', [roleName]);
    const roleRecord = Array.isArray(roleRows) && roleRows.length > 0 ? roleRows[0] : null;
    if (!roleRecord) {
        throw new AppError(`Role not found: ${roleName}`, 400);
    }
    let companyId = null;
    if (data.role === 'recruiter') {
        const companyName = data.companyName || data.company;
        if (!companyName) {
            throw new AppError('El nombre de la empresa es obligatorio para los reclutadores.', 400);
        }
        companyId = await findOrCreateCompany({
            companyName,
            companyNit: data.companyNit,
            companyAddress: data.companyAddress,
            companyPhone: data.companyPhone,
            companyEmail: data.companyEmail || data.email,
            companyWebsite: data.companyWebsite,
        });
    }
    else if (data.company) {
        const [companyRows] = await db.query('SELECT id FROM empresas WHERE nombre = ?', [data.company]);
        if (Array.isArray(companyRows) && companyRows.length > 0) {
            companyId = companyRows[0].id;
        }
    }
    const [result] = await db.execute('INSERT INTO usuarios (rol_id, email, password_hash, nombre_completo, telefono, empresa_id) VALUES (?, ?, ?, ?, ?, ?)', [roleRecord.id, data.email, data.passwordHash, data.fullName, null, companyId]);
    return result.insertId;
};
