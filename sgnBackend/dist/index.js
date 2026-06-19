import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import { testConnection } from './db/connection.js';
import { initializeRoles } from './db/initRoles.js';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 4000;
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
app.use(cors({ origin: FRONTEND_URL, credentials: true }));
app.use(express.json());
app.use('/api/auth', authRoutes);
app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok' });
});
const startServer = async () => {
    try {
        await testConnection();
        console.log('MySQL connected successfully');
        await initializeRoles();
        console.log('Default roles verified');
    }
    catch (error) {
        console.error('MySQL initialization failed:', error);
        process.exit(1);
    }
    app.listen(PORT, () => {
        console.log(`SIGECON backend listening on port ${PORT}`);
    });
};
startServer();
