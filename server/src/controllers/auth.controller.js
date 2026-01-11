import * as authService from '../services/auth.service.js';

export const registerUser = async (req, res) => {
  try {
    const user = await authService.register(req.body);
    res.status(201).json({ message: 'Usuario registrado', user });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { user, token } = await authService.login(req.body);
    res.json({ message: 'Login exitoso', user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};
