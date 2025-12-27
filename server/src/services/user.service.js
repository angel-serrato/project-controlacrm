import User from '../models/user.model.js';
import { hashPassword, verifyPassword } from './auth.service.js';

/**
 * Create a new user
 */
export const createUser = async (userData) => {
  const { firstName, lastName, email, password } = userData;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email is already registered');
  }

  const hashedPassword = await hashPassword(password);

  const user = await User.create({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  return user;
};

/**
 * Find user by email with password
 */
export const findUserByEmailWithPassword = async (email) => {
  const user = await User.findOne({ email }).select('+password');
  return user;
};

/**
 * Validate user credentials
 */
export const validateUserCredentials = async (email, password) => {
  const user = await findUserByEmailWithPassword(email);

  if (!user) {
    throw new Error('Invalid email or password');
  }

  if (!user.isActive) {
    throw new Error('User account is inactive');
  }

  const isPasswordValid = await verifyPassword(user.password, password);

  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  return user;
};

/**
 * Get user by ID
 */
export const getUserById = async (userId) => {
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }
  return user;
};

/**
 * Get all users
 */
export const getAllUsers = async () => {
  const users = await User.find();
  return users;
};

/**
 * Update user by ID
 */
export const updateUser = async (userId, updateData) => {
  // Remove sensitive fields that shouldn't be updated directly
  delete updateData.password;

  const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedUser) {
    throw new Error('User not found');
  }

  return updatedUser;
};

/**
 * Delete user by ID
 */
export const deleteUser = async (userId) => {
  const deletedUser = await User.findByIdAndDelete(userId);
  if (!deletedUser) {
    throw new Error('User not found');
  }
  return deletedUser;
};

/**
 * Change user password
 */
export const changeUserPassword = async (
  userId,
  currentPassword,
  newPassword,
) => {
  const user = await User.findById(userId).select('+password');

  if (!user) {
    throw new Error('User not found');
  }

  const isPasswordValid = await verifyPassword(user.password, currentPassword);

  if (!isPasswordValid) {
    throw new Error('Current password is incorrect');
  }

  user.password = await hashPassword(newPassword);
  await user.save();

  return user;
};

/**
 * Format user response (remove sensitive data)
 */
export const formatUserResponse = (user) => {
  return {
    id: user._id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};
