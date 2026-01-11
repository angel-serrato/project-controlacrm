import User from '../models/user.model.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export const register = async ({ email, password, role }) => {
  const hash = await argon2.hash(password);
  const user = await User.create({ email, password: hash, role });
  return user;
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Usuario no encontrado');
  const valid = await argon2.verify(user.password, password);
  if (!valid) throw new Error('Contraseña incorrecta');

  const token = jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
  return { user, token };
};
