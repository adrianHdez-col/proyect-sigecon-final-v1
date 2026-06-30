import { Router } from 'express';
import { listSavedVacancies, saveVacancyForMe, unsaveVacancyForMe, } from '../controllers/guardadosController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = Router();
router.get('/', authMiddleware, listSavedVacancies);
router.post('/', authMiddleware, saveVacancyForMe);
router.delete('/:vacancyId', authMiddleware, unsaveVacancyForMe);
export default router;
