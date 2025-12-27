import express from 'express';
import {
  getProfile,
  updateProfile,
  deleteProfile,
  getAll,
  getById,
  deleteById,
} from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.middleware.js';

const router = express.Router();

// All user routes require authentication
router.use(authenticate);

// Profile routes (current logged in user)
router.get('/profile', getProfile);
router.patch('/profile/:id', updateProfile);
router.delete('/profile/:id', deleteProfile);

// User management routes (admin)
router.get('/', getAll);
router.get('/:id', getById);
router.delete('/:id', deleteById);

export default router;
