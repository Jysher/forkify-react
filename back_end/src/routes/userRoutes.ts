import { Router } from 'express';
import { auth, login, register } from '../controllers/authController.ts';
import { getUsers } from '../controllers/userController.ts';

const router = Router();

router.post('/register', register);
router.post('/login', login);

router.route('/').get(auth, getUsers);

export default router;
