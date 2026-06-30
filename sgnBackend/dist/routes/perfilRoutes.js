import { Router } from 'express';
import { getMyProfile, updateMyProfile } from '../controllers/perfilController.js';
import { authMiddleware } from '../middlewares/authMiddleware.js';
const router = Router();
router.get('/me', authMiddleware, getMyProfile);
router.put('/me', authMiddleware, updateMyProfile);
export default router;
