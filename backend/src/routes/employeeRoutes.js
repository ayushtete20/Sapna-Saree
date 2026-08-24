// backend/src/routes/employeeRoutes.js
const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeeController');
const { verifyToken, isOwnerOrAdmin } = require('../middleware/authMiddleware');

const isOwnerOnly = (req, res, next) => {
  if (req.user && req.user.role && req.user.role.toUpperCase() === 'OWNER') {
    return next();
  }
  return res.status(403).json({ success: false, message: 'Forbidden. Owner privileges required.' });
};

router.use(verifyToken);

// Accessible by Admin & Owner
router.get('/', isOwnerOrAdmin, employeeController.getEmployees);
router.post('/', isOwnerOrAdmin, employeeController.createEmployee);
router.delete('/:id', isOwnerOrAdmin, employeeController.deleteEmployee);
router.put('/:id/permissions', isOwnerOrAdmin, employeeController.updatePermissions);

// Restricted to Owner only (Account Approvals)
router.post('/:id/approve', isOwnerOnly, employeeController.approveRequest);
router.post('/:id/reject', isOwnerOnly, employeeController.rejectRequest);

module.exports = router;
