// backend/src/routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { verifyToken, can } = require('../middleware/authMiddleware');

// Public catalog view
router.get('/', productController.getProducts);

// Protected catalog mutation routes requiring canManageCatalog permission or Admin/Owner
router.post('/', verifyToken, can('canManageCatalog'), productController.createProduct);
router.put('/:id', verifyToken, can('canManageCatalog'), productController.updateProduct);

module.exports = router;
