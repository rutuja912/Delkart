import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getUserById,
  updateUser,
} from '../controllers/users.controller.js';
import { protect, requireRole } from '../middleware/authMiddleware.js';

router.route('/')
  .post(registerUser)
  .get(protect, requireRole('admin'), getUsers);

router.post('/login', authUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

router.route('/:id')
  .delete(protect, requireRole('admin'), deleteUser)
  .get(protect, requireRole('admin'), getUserById)
  .put(protect, requireRole('admin'), updateUser);

export default router;

