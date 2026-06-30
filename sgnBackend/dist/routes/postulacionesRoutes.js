<<<<<<< HEAD
import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { applyToVacancy, getMyApplications } from '../controllers/postulacionesController.js';
const router = Router();
router.get('/mine', authMiddleware, getMyApplications);
router.post('/', authMiddleware, applyToVacancy);
export default router;
=======
export {};
>>>>>>> 0791f2620e0ffdfb7daf0b03755f026d38dd79c2
