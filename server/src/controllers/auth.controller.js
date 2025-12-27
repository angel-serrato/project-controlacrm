import {
  createUser,
  validateUserCredentials,
  changeUserPassword,
  formatUserResponse,
} from '../services/user.service.js';
import { generateToken } from '../services/auth.service.js';

/**
 * Set authentication cookie
 */
const setAuthCookie = (res, token) => {
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });
};

/**
 * Clear authentication cookie
 */
const clearAuthCookie = (res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
};

/**
 * Register a new user
 */
export const register = async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate password length
    if (password.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password must have at least 8 characters' });
    }

    // Create user
    const user = await createUser({ firstName, lastName, email, password });

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    setAuthCookie(res, token);

    // Send response
    res.status(201).json({
      message: 'User registered successfully',
      user: formatUserResponse(user),
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Login user
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate required fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Validate credentials
    const user = await validateUserCredentials(email, password);

    // Generate token
    const token = generateToken(user._id);

    // Set cookie
    setAuthCookie(res, token);

    // Send response
    res.status(200).json({
      message: 'Login successful',
      user: formatUserResponse(user),
    });
  } catch (error) {
    const statusCode =
      error.message.includes('Invalid') || error.message.includes('inactive')
        ? 401
        : 400;
    res.status(statusCode).json({ error: error.message });
  }
};

/**
 * Logout user
 */
export const logout = async (req, res) => {
  try {
    clearAuthCookie(res);
    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

/**
 * Change password
 */
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Validate required fields
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate new password length
    if (newPassword.length < 8) {
      return res
        .status(400)
        .json({ error: 'Password must have at least 8 characters' });
    }

    // Change password
    await changeUserPassword(req.user.id, currentPassword, newPassword);

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    const statusCode = error.message.includes('incorrect') ? 401 : 400;
    res.status(statusCode).json({ error: error.message });
  }
};

/**
 * Forgot password - TODO: Implement email functionality
 */
export const forgotPassword = async (req, res) => {
  res.status(200).json({
    message: 'Forgot password endpoint (to be implemented)',
    body: req.body,
  });
};

/**
 * Reset password - TODO: Implement token verification
 */
export const resetPassword = async (req, res) => {
  res.status(200).json({
    message: 'Reset password endpoint (to be implemented)',
    body: req.body,
  });
};
