import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import authRoutes from './routes/authRoutes.js';
import { testConnection } from './db/connection.js';
import { initializeRoles } from './db/initRoles.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || `http://localhost:${PORT}`;
const FRONTEND_DIST = path.resolve(process.cwd(), '../Sigecon-frontend/dist');
const FRONTEND_INDEX = path.join(FRONTEND_DIST, 'index.html');
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use('/api/auth', authRoutes);
let databaseAvailable = false;
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        database: databaseAvailable ? 'connected' : 'unavailable',
    });
});
if (fs.existsSync(FRONTEND_DIST)) {
    app.use(express.static(FRONTEND_DIST));
    app.get('*', (req, res) => {
        if (req.path.startsWith('/api')) {
            return res.status(404).json({ message: 'API route not found.' });
        }
        return res.sendFile(FRONTEND_INDEX);
    });
}
const startServer = async () => {
    try {
        await testConnection();
        console.log('MySQL connected successfully');
        await initializeRoles();
        console.log('Default roles verified');
        databaseAvailable = true;
    }
    catch (error) {
        console.error('MySQL initialization failed:', error);
        console.warn('Continuando el arranque sin conexión de BD. Las rutas de auth fallarán hasta que se corrija la configuración.');
    }
    app.listen(PORT, () => {
        console.log(`SIGECON backend listening on port ${PORT}`);
    });
};
startServer();
