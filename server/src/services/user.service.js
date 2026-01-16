import User from '../models/user.model.js';
import argon2 from 'argon2';

export const getUsers = async () => {
  const users = await User.find({ active: true });
  return users.map((u) => {
    const obj = u.toObject();
    delete obj.password;
    return obj;
  });
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user || !user.active) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  const obj = user.toObject();
  delete obj.password;
  return obj;
};

export const createUser = async (data) => {
  const existingUser = await User.findOne({ email: data.email });
  if (existingUser) {
    const err = new Error('Ya existe un usuario con este email');
    err.status = 409;
    throw err;
  }
  const hashedPassword = await argon2.hash(data.password);
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
  const updateData = {};
  if (data.email) updateData.email = data.email;
  if (data.password) updateData.password = await argon2.hash(data.password);
  if (data.role) updateData.role = data.role;
  if (typeof data.active === 'boolean') updateData.active = data.active;
  if (data.createdBy) updateData.createdBy = data.createdBy;

  const updatedUser = await User.findByIdAndUpdate(id, updateData, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  const obj = updatedUser.toObject();
  delete obj.password;
  return obj;
};

export const deleteUser = async (id) => {
  const deletedUser = await User.findByIdAndUpdate(
    id,
    { active: false },
    { new: true }
  );
  if (!deletedUser) {
    const err = new Error('Usuario no encontrado');
    err.status = 404;
    throw err;
  }
  const obj = deletedUser.toObject();
  delete obj.password;
  return obj;
};
