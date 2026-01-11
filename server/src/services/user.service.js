import User from '../models/user.model.js';

export const getUsers = async () => {
  return await User.find();
};

export const getUserById = async (id) => {
  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

export const createUser = async (data) => {
  const existingUser = await User.findOne({ name: data.name });
  if (existingUser) {
    throw new Error('User already registered');
  }
  return await User.create(data);
};

export const updateUser = async (id, data) => {
  const updatedUser = await User.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
  if (!updatedUser) {
    throw new Error('User does not exist');
  }
  return updatedUser;
};

export const deleteUser = async (id) => {
  const deletedUser = await User.findByIdAndDelete(id);
  if (!deletedUser) {
    throw new Error('User does not exist');
  }
  return deletedUser;
};
