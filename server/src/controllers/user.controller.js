import User from '../models/user.model.js';
import Role from '../models/role.model.js';
import argon2 from 'argon2';

export const registerUser = async (req, res) => {
  const { firstName, lastName, email, password, role } = req.body;
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new Error('Email is alredy registered');
  }
  let userRole = null;
  if (role) {
    userRole = await Role.findOne({ name: role.toLowerCase() });
    if (!userRole) {
      throw new Error(`Role ${role} does not exist`);
    }
  }
  try {
    const user = await User.create(req.body);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const loginUser = async (req, res) => {
  res
    .status(200)
    .json({ message: 'Login endpoint (test only)', body: req.body });
};

export const logoutUser = async (req, res) => {
  res.status(200).json({ message: 'Logout endpoint (test only)' });
};

export const getUserProfile = async (req, res) => {
  res.status(200).json({ message: 'Get profile endpoint (test only)' });
};

export const updateUserProfile = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteUserByID = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const forgotPassword = async (req, res) => {
  res
    .status(200)
    .json({ message: 'Forgot password endpoint (test only)', body: req.body });
};

export const resetPassword = async (req, res) => {
  res
    .status(200)
    .json({ message: 'Reset password endpoint (test only)', body: req.body });
};

export const changePassword = async (req, res) => {
  res
    .status(200)
    .json({ message: 'Change password endpoint (test only)', body: req.body });
};
