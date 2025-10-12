import User from '../models/user.model.js';

export const registerUser = async (req, res) => {
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
