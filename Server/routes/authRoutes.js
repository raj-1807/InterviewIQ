import express from 'express';
import { googleAuth, getMe, logout } from '../controllers/authController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.post('/google', googleAuth);
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

export default router;
