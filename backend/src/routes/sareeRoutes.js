const express = require('express');
const router = express.Router();
const sareeController = require('../controllers/sareeController');
const { verifyToken, checkRole } = require('../middleware/auth');

router.get('/', sareeController.getAllSarees);
router.get('/:id', sareeController.getSareeById);

// Admin, Owner, & Catalog Staff protected product management routes
router.post('/', verifyToken, checkRole(['admin', 'owner', 'employee']), sareeController.createSaree);
router.put('/:id', verifyToken, checkRole(['admin', 'owner', 'employee']), sareeController.updateSaree);
router.delete('/:id', verifyToken, checkRole(['admin', 'owner', 'employee']), sareeController.deleteSaree);

module.exports = router;
