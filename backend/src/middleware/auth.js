import jwt from 'jsonwebtoken';
import { db } from '../data/store.js';

const JWT_SECRET = process.env.JWT_SECRET || 'innovative_jharkhand_super_secret_jwt_key_2026';

export function signToken(user) {
  return jwt.sign(
    {
      userId: user.id,
      email: user.email,
      role: user.role,
      organizationId: user.organizationId
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function authenticate(req, res, next) {
  // 1. Check direct role/user header for developer ease & role-switching dropdown
  const directUserId = req.headers['x-user-id'];
  if (directUserId) {
    const user = db.users.find((u) => u.id === directUserId);
    if (user) {
      const org = db.organizations.find((o) => o.id === user.organizationId);
      req.user = {
        ...user,
        organizationType: org ? org.type : null
      };
      return next();
    }
  }

  // 2. Check standard Authorization header
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication required. Missing or malformed token.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = db.users.find((u) => u.id === decoded.userId);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    const org = db.organizations.find((o) => o.id === user.organizationId);
    req.user = {
      ...user,
      organizationType: org ? org.type : null
    };
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired token.',
      error: err.message
    });
  }
}

export function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthenticated' });
    }
    if (!allowedRoles.includes(req.user.role) && req.user.role !== 'state_admin') {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Role '${req.user.role}' is not authorized to perform this operation. Required: ${allowedRoles.join(', ')}`
      });
    }
    next();
  };
}
