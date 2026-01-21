import express from 'express';
import {
  registerUser,
  loginUser,
  refreshToken,
} from '../controllers/auth.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import {
  validateRegister,
  validateLogin,
} from '../validators/auth.validator.js';

const router = express.Router();

router.post('/register', validateRegister, registerUser);
router.post('/login', validateLogin, loginUser);
router.post('/refresh', verifyToken, refreshToken);

export default router;
