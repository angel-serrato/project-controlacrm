import express from 'express';
import { registerUser, loginUser } from '../controllers/auth.controller.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import validate from '../middlewares/validate.middleware.js';

const router = express.Router();

router.post('/register', validate(registerSchema), registerUser);
router.post('/login', validate(loginSchema), loginUser);

export default router;
