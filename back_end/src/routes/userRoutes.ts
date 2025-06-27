import { Router } from 'express';
import {
  authenticate,
  authorized,
  login,
  logout,
  register,
} from '../controllers/authController.ts';
import {
  deleteUser,
  getUser,
  getUsers,
} from '../controllers/userController.ts';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);

router.route('/').get(authenticate, authorized('admin'), getUsers);
router
  .route('/:id')
  .get(authenticate, authorized('admin'), getUser)
  .delete(authenticate, authorized('admin', 'user'), deleteUser);

export default router;
