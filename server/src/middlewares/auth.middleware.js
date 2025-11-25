import { verifyToken } from '../services/auth.service.js';
import User from '../models/user.model.js';

export const authenticate = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = verifyToken(token);
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }

    if (!user.isActive) {
      return res.status(401).json({ error: 'User account is inactive' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export const authorize = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'User not authenticated' });
    }

    const userRole = await req.user.populate('role');
    
    if (!allowedRoles.includes(userRole.role.name)) {
      return res
        .status(403)
        .json({ error: 'Insufficient permissions' });
    }

    next();
  };
};
