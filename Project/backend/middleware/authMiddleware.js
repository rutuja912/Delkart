import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/users.model.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      return next(); // ✅ early return if successful
    } catch (error) {
      console.error(error);
      res.status(401);
      throw new Error('Not authorized, token failed');
    }
  }

  // ✅ Only runs if no token or header present
  res.status(401);
  throw new Error('Not authorized, no token');
});

const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (req.user && allowedRoles.includes(req.user.role)) {
      next();
    } else {
      res.status(403);
      throw new Error('Not authorized as ' + (req.user?.role || 'unknown'));
    }
  };
};

export { protect, requireRole };
