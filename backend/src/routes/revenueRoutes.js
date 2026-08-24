// backend/src/routes/revenueRoutes.js
const express = require('express');
const router = express.Router();
const revenueController = require('../controllers/revenueController');
const { verifyToken, can } = require('../middleware/authMiddleware');

// Protected revenue summary requiring canViewRevenue permission or Admin/Owner
router.get('/summary', verifyToken, can('canViewRevenue'), revenueController.getRevenueSummary);

module.exports = router;
