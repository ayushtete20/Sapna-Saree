// backend/src/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sapna_sarees_lavichitra_jwt_secret_key_2026';

/**
 * Validates JSON Web Token from Authorization header (Bearer <token>)
 */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Access token is missing or malformed.'
    });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // { id, email, role, canManageCatalog, canViewRevenue, canManageOrders }
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid or expired token.'
    });
  }
};

/**
 * Restricts access exclusively to ADMIN or OWNER roles.
 */
const isOwnerOrAdmin = (req, res, next) => {
  if (!req.user || !req.user.role) {
    return res.status(401).json({ success: false, message: 'Unauthorized.' });
  }

  const role = req.user.role.toUpperCase();
  if (role === 'ADMIN' || role === 'OWNER') {
    return next();
  }


  return res.status(403).json({
    success: false,
    message: 'Forbidden. Action requires Admin or Owner privileges.'
  });
};

/**
 * Dynamic RBAC middleware:
 * Checks if the user is an ADMIN/OWNER OR has the specific boolean permission flag set to true.
 * @param {string} permissionFlag - Name of the user permission boolean field (e.g., 'canManageOrders')
 */
const can = (permissionFlag) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }

    const role = req.user.role;

    // ADMIN and OWNER always bypass granular employee checks
    if (role === 'ADMIN' || role === 'OWNER') {
      return next();
    }

    // For EMPLOYEE accounts, check the specified boolean permission flag
    if (role === 'EMPLOYEE' && req.user[permissionFlag] === true) {
      return next();
    }

    return res.status(403).json({
      success: false,
      message: `Forbidden. Lack required permission flag: '${permissionFlag}'.`
    });
  };
};

module.exports = {
  verifyToken,
  isOwnerOrAdmin,
  can,
  JWT_SECRET
};
