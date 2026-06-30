import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { listVacancies } from '../controllers/vacantesController.js';
const router = Router();
router.get('/', authMiddleware, listVacancies);
export default router;
