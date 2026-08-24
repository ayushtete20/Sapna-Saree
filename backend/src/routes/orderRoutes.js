// backend/src/routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken, can } = require('../middleware/authMiddleware');

// Customer checkout route
router.post('/', verifyToken, orderController.createOrder);

// Admin & Owner order management routes
router.get('/', verifyToken, can('canManageOrders'), orderController.getOrders);
router.put('/:id/status', verifyToken, can('canManageOrders'), orderController.updateOrderStatus);

module.exports = router;
