<<<<<<< HEAD
import { Router } from 'express';
import { authMiddleware } from '../middlewares/authMiddleware.js';
import { listVacancies } from '../controllers/vacantesController.js';
const router = Router();
router.get('/', authMiddleware, listVacancies);
export default router;
=======
export {};
>>>>>>> 0791f2620e0ffdfb7daf0b03755f026d38dd79c2
