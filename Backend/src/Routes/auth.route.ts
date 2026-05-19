import { Router } from 'express';
import { AuthController } from '../Controller/auth.controller.ts';
import { authenticate } from '../Middlewares/auth.middleware.ts';

const router = Router();

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);
router.get('/verify/:token', AuthController.emailVerify);
router.post('/refresh', AuthController.refresh);
router.get('/me', authenticate, AuthController.getCurrentUser);
router.post('/logout', authenticate, AuthController.logout);

export default router;
