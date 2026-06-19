import bcrypt from 'bcryptjs';
import { signToken } from '../utils/jwt.js';
import { validateEmail, validatePassword } from '../utils/validation.js';
import { getUserByEmail, createUser } from '../services/userService.js';
const ROLE_MAP = {
    SU: 'admin',
    RRHH: 'recruiter',
    Evaluador: 'evaluator',
    Candidato: 'aspirant',
};
const UI_ROLE_TO_DB_ROLE = {
    admin: 'SU',
    recruiter: 'RRHH',
    evaluator: 'Evaluador',
    aspirant: 'Candidato',
};
const mapDbRoleToUi = (dbRole) => ROLE_MAP[dbRole] || 'aspirant';
const mapUiRoleToDb = (uiRole) => UI_ROLE_TO_DB_ROLE[uiRole] || 'Candidato';
export const register = async (req, res) => {
    try {
        const { fullName, email, password, role = 'aspirant', company, } = req.body;
        if (!fullName || !email || !password) {
            return res.status(400).json({ message: 'Nombre, correo y contrasena son obligatorios.' });
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ message: 'El correo no es valido.' });
        }
        if (!validatePassword(password)) {
            return res.status(400).json({ message: 'La contrasena debe tener al menos 8 caracteres.' });
        }
        const existingUser = await getUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ message: 'El correo ya esta registrado.' });
        }
        const passwordHash = await bcrypt.hash(password, 10);
        const dbRole = mapUiRoleToDb(role);
        const userId = await createUser({
            fullName,
            email,
            passwordHash,
            role,
            company: company || null,
        });
        const token = signToken({ id: userId, email, role: mapDbRoleToUi(dbRole) });
        return res.status(201).json({
            success: true,
            data: {
                id: userId,
                fullName,
                email,
                role: mapDbRoleToUi(dbRole),
                company: company || null,
                token,
            },
        });
    }
    catch (error) {
        console.error('Register error:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ message: 'Correo y contrasena son obligatorios.' });
        }
        const user = await getUserByEmail(email);
        if (!user) {
            return res.status(401).json({ message: 'Credenciales invalidas.' });
        }
        if (!user.activo) {
            return res.status(403).json({ message: 'Cuenta desactivada. Contacte al administrador.' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password_hash);
        if (!passwordMatch) {
            return res.status(401).json({ message: 'Credenciales invalidas.' });
        }
        const frontendRole = mapDbRoleToUi(user.role);
        const token = signToken({ id: user.id, email: user.email, role: frontendRole });
        return res.status(200).json({
            success: true,
            data: {
                id: user.id,
                fullName: user.nombre_completo,
                email: user.email,
                role: frontendRole,
                company: null,
                token,
            },
        });
    }
    catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({ message: 'Error interno del servidor.' });
    }
};
