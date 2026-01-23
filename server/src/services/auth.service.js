import User from '../models/user.model.js';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';

// Validar que JWT_SECRET está configurado
if (!process.env.JWT_SECRET) {
  throw new Error('JWT_SECRET environment variable is not configured');
}

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_ALGORITHM = 'HS256';
const JWT_EXPIRATION = '1h';

// Configuración de Argon2 (RFC 9106 recomendado)
const ARGON2_OPTIONS = {
  type: argon2.argon2id, // Recomendado para propósitos generales
  timeCost: 3, // Número de iteraciones
  memoryCost: 65536, // 64 MB en kilobytes
  parallelism: 4, // Número de threads en paralelo
  hashLength: 32, // Longitud del hash en bytes
  raw: false, // Retorna formato $argon2id$...
};

// Validar opciones de Argon2
if (
  !ARGON2_OPTIONS.type ||
  !ARGON2_OPTIONS.timeCost ||
  !ARGON2_OPTIONS.memoryCost
) {
  throw new Error('Invalid Argon2 configuration');
}

export const register = async ({ email, password, role }) => {
  // Validar contraseña: 8+ caracteres, 1 mayúscula, 1 número
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
  if (!password || !passwordRegex.test(password)) {
    const err = new Error(
      'La contraseña debe tener: mínimo 8 caracteres, 1 mayúscula, 1 número'
    );
    err.status = 400;
    throw err;
  }

  // Verificar si el usuario ya existe
  const existingUser = await User.findOne({ email }).lean();
  if (existingUser) {
    const err = new Error('El email ya está registrado');
    err.status = 409;
    throw err;
  }

  let hash;
  try {
    hash = await argon2.hash(password, ARGON2_OPTIONS);
  } catch (error) {
    const err = new Error('Error al procesar la contraseña');
    err.status = 500;
    throw err;
  }

  const user = await User.create({ email, password: hash, role });
  // No devolver password
  const userObj = user.toObject();
  delete userObj.password;
  return userObj;
};

export const login = async ({ email, password }) => {
  // Seleccionar password explícitamente
  const user = await User.findOne({ email, active: true }).select('+password');
  if (!user) {
    const err = new Error('Credenciales inválidas');
    err.status = 401;
    throw err;
  }

  let isValidPassword;
  try {
    isValidPassword = await argon2.verify(user.password, password);
  } catch (error) {
    // argon2.verify lanza error si el hash es inválido
    const err = new Error('Error al verificar credenciales');
    err.status = 500;
    throw err;
  }

  if (!isValidPassword) {
    const err = new Error('Credenciales inválidas');
    err.status = 401;
    throw err;
  }

  // Verificar si el hash necesita rehashing con nuevos parámetros
  const needsRehash = await argon2.needsRehash(user.password, ARGON2_OPTIONS);
  if (needsRehash) {
    try {
      const newHash = await argon2.hash(password, ARGON2_OPTIONS);
      await User.findByIdAndUpdate(user._id, { password: newHash });
    } catch (error) {
      // Log error pero no fallar el login
      console.error('Error rehashing password:', error);
    }
  }

  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
    algorithm: JWT_ALGORITHM,
  });
  // No devolver password
  const userObj = user.toObject();
  delete userObj.password;
  return { user: userObj, token };
};

export const generateNewToken = async (authUser) => {
  // authUser viene del middleware de autenticación
  // Obtener usuario actualizado de la BD
  const user = await User.findById(authUser.id).lean();
  if (!user || !user.active) {
    const err = new Error('Usuario no encontrado o inactivo');
    err.status = 401;
    throw err;
  }

  // Generar nuevo token
  const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
    algorithm: JWT_ALGORITHM,
  });

  // No devolver password
  delete user.password;
  return { user, token };
};
