import { Router } from 'express';
import {
  getCurrentUser,
  updateCurrentUser,
} from '../controllers/userController.js';
import { authenticate } from '../middleware/authenticate.js';

const router = Router();

router.get('/api/user/me', authenticate, getCurrentUser);
router.patch('/api/user/edit', authenticate, updateCurrentUser);

export default router;
