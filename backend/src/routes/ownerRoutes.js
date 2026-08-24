const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');
const { verifyToken, isOwnerOrAdmin } = require('../middleware/authMiddleware');

router.use(verifyToken);

// Accessible by both Admin and Owner
router.get('/financials', isOwnerOrAdmin, ownerController.getFinancials);
router.get('/analytics', isOwnerOrAdmin, ownerController.getAnalytics);

// Security guard restricting staff account management exclusively to Owner role
const isOwnerOnly = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.toUpperCase() === 'OWNER') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden. Action requires Owner privileges.' });
};

router.get('/staff', isOwnerOnly, ownerController.getStaff);
router.post('/staff', isOwnerOnly, ownerController.addStaff);
router.delete('/staff/:id', isOwnerOnly, ownerController.deleteStaff);

module.exports = router;
