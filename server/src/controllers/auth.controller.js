import * as authService from '../services/auth.service.js';

export const registerUser = async (req, res, next) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      data: user,
    });
  } catch (err) {
    next(err);
  }
};

export const loginUser = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({
      success: true,
      message: 'Login exitoso',
      data: { user, token },
    });
  } catch (err) {
    next(err);
  }
};
