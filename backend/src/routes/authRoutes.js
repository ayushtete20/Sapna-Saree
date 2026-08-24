// backend/src/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/authMiddleware');

// Dual-Method Authentication Endpoints
// 1. Customer OTP Auth Flow
router.post('/customer-login', authController.customerLogin);
router.post('/customer-verify', authController.customerVerify);

// 2. Staff Email + Password Auth Flow
router.post('/staff-login', authController.staffLogin);

// Dedicated Aliases & Legacy Support
router.post('/customer/register', authController.registerCustomer);
router.post('/customer/login', authController.customerLogin);
router.post('/customer/verify', authController.customerVerify);
router.post('/staff/login', authController.staffLogin);

router.post('/login', authController.login);
router.post('/register', authController.register);
router.get('/me', verifyToken, authController.me);

module.exports = router;
