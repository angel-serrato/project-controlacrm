import {
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
  formatUserResponse,
} from '../services/user.service.js';

/**
 * Get current user profile
 */
export const getProfile = async (req, res) => {
  try {
    const user = await getUserById(req.user.id);
    res.status(200).json(formatUserResponse(user));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Update user profile
 */
export const updateProfile = async (req, res) => {
  try {
    const updatedUser = await updateUser(req.params.id, req.body);
    res.status(200).json(formatUserResponse(updatedUser));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete user profile
 */
export const deleteProfile = async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get all users
 */
export const getAll = async (req, res) => {
  try {
    const users = await getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Get user by ID
 */
export const getById = async (req, res) => {
  try {
    const user = await getUserById(req.params.id);
    res.status(200).json(formatUserResponse(user));
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Delete user by ID
 */
export const deleteById = async (req, res) => {
  try {
    await deleteUser(req.params.id);
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
