import User from '../models/user.model.js';
import argon2 from 'argon2';

// Configuración de Argon2 (RFC 9106 recomendado)
const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  timeCost: 3,
  memoryCost: 65536,
  parallelism: 4,
  hashLength: 32,
  raw: false,
};

export const getUsers = async () => {
  const users = await User.find({ active: true }).lean();
  return users.map((u) => {
    delete u.password;
    return u;
  });
};

export const getUserById = async (id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    const err = new Error('ID de usuario inválido');
    err.status = 400;
    throw err;
  }
  const user = await User.findById(id).lean();
  if (!user || !user.active) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  delete user.password;
  return user;
};

export const createUser = async (data) => {
  // Validar contraseña
  if (!data.password || data.password.length < 8) {
    const err = new Error('La contraseña debe tener al menos 8 caracteres');
    err.status = 400;
    throw err;
  }

  const existingUser = await User.findOne({ email: data.email }).lean();
  if (existingUser) {
    const err = new Error('Ya existe un usuario con este email');
    err.status = 409;
    throw err;
  }

  let hashedPassword;
  try {
    hashedPassword = await argon2.hash(data.password, ARGON2_OPTIONS);
  } catch (error) {
    const err = new Error('Error al procesar la contraseña');
    err.status = 500;
    throw err;
  }

  const userData = {
    email: data.email,
    password: hashedPassword,
    role: data.role || 'sales',
    active: data.active !== undefined ? data.active : true,
    createdBy: data.createdBy,
  };
  const user = await User.create(userData);
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

export const updateUser = async (id, data) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    const err = new Error('ID de usuario inválido');
    err.status = 400;
    throw err;
  }

  const updateData = {};
  if (data.email) updateData.email = data.email;
  if (data.password) {
    // Validar contraseña
    if (data.password.length < 8) {
      const err = new Error('La contraseña debe tener al menos 8 caracteres');
      err.status = 400;
      throw err;
    }

    try {
      updateData.password = await argon2.hash(data.password, ARGON2_OPTIONS);
    } catch (error) {
      const err = new Error('Error al procesar la contraseña');
      err.status = 500;
      throw err;
    }
  }
  if (data.role) updateData.role = data.role;
  if (typeof data.active === 'boolean') updateData.active = data.active;
  if (data.createdBy) updateData.createdBy = data.createdBy;

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  }).lean();
  if (!updatedUser) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  delete updatedUser.password;
  return updatedUser;
};

export const deleteUser = async (id) => {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    const err = new Error('ID de usuario inválido');
    err.status = 400;
    throw err;
  }
  const deletedUser = await User.findByIdAndUpdate(
    id,
    { active: false },
    { new: true }
  ).lean();
  if (!deletedUser) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  delete deletedUser.password;
  return deletedUser;
};
