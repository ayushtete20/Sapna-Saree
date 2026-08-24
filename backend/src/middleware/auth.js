const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sapna_sarees_lavichitra_jwt_secret_key_2026';

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Access token missing or invalid.' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, message: 'Invalid or expired session token.' });
  }
}

function checkRole(allowedRoles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Unauthorized.' });
    }
    const userRole = (req.user.role || '').toUpperCase();
    const normalizedAllowed = allowedRoles.map(r => String(r).toUpperCase());
    
    // ADMIN or OWNER or allowed roles or explicit permission flag
    if (normalizedAllowed.includes(userRole) || userRole === 'ADMIN' || userRole === 'OWNER' || req.user.canManageCatalog) {
      return next();
    }

    return res.status(403).json({ 
      success: false, 
      message: `Forbidden. Role '${req.user.role}' lacks permission for this action.` 
    });
  };
}

module.exports = {
  verifyToken,
  checkRole,
  JWT_SECRET
};
