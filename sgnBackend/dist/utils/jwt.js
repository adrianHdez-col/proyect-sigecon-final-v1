import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';
export const signToken = (payload) => {
    // jsonwebtoken v9 is ESM and exports a default function object;
    // import default to ensure `sign` exists at runtime.
    return jwt.sign(payload, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });
};
export const verifyToken = (token) => {
    return jwt.verify(token, JWT_SECRET);
};
