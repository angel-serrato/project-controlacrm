import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password) => {
  const hashedPassword = await argon2.hash(password);
  return hashedPassword;
};

export const verifyPassword = async (hashedPassword, plainPassword) => {
  const isValid = await argon2.verify(hashedPassword, plainPassword);
  return isValid;
};

export const generateToken = (userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
  return token;
};

export const verifyToken = (token) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  return decoded;
};
