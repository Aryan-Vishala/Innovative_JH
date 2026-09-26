const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    if (!allowedRoles.includes(req.user.primaryRole)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: role '${req.user.primaryRole}' cannot access this resource`,
      });
    }

    next();
  };
};

module.exports = { authorizeRoles };
