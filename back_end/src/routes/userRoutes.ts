import { Router } from 'express';
import {
  authenticate,
  authorize,
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
  updatePassword,
} from '../controllers/authController.ts';
import {
  deleteUser,
  getUser,
  getUsers,
  updateUser,
} from '../controllers/userController.ts';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.post('/forgotPassword', forgotPassword);

router.patch('/resetPassword/:token', resetPassword);
router.patch('/updatePassword', authenticate, updatePassword);
router.patch('/updateUser', authenticate, updateUser);

router.route('/').get(authenticate, authorize(['admin']), getUsers);
router
  .route('/:id')
  .get(authenticate, authorize(['admin']), getUser)
  .delete(authenticate, authorize(['admin']), deleteUser);

export default router;
