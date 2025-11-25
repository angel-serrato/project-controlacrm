import express from 'express';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUserProfile,
  getAllUsers,
  getUserById,
  deleteUserByID,
  forgotPassword,
  resetPassword,
  changePassword,
} from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', authenticate, logoutUser);

router.get('/profile', authenticate, getUserProfile);
router.patch('/profile/:id', authenticate, updateUserProfile);
router.delete('/profile/:id', authenticate, deleteUserProfile);

router.get('/users', authenticate, getAllUsers);
router.get('/users/:id', authenticate, getUserById);
router.delete('/users/:id', authenticate, deleteUserByID);

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.patch('/change-password', authenticate, changePassword);

export default router;
