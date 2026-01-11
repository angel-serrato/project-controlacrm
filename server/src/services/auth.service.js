import User from '../models/user.model.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export const register = async ({ email, password, role }) => {
  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    const err = new Error('El email ya está registrado');
    err.status = 409;
    throw err;
  }
  const hash = await argon2.hash(password);
  const user = await User.create({ email, password: hash, role });
  // No devolver password
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

export const login = async ({ email, password }) => {
  // Seleccionar password explícitamente
  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  const valid = await argon2.verify(user.password, password);
  if (!valid) {
    const err = new Error('Contraseña incorrecta');
    err.status = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  // No devolver password
  const userObj = user.toObject();
  delete userObj.password;
  return { user: userObj, token };
};
