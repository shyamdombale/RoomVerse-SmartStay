const express = require('express');
const router = express.Router();
const adminPropertyController = require('../controllers/adminPropertyController');
const { authenticateJWT, requireRole } = require('../middleware/authMiddleware');

// Property Verification & Platform-wide Listing Overview
router.get('/properties', authenticateJWT, requireRole('admin'), adminPropertyController.getAllProperties);
router.patch('/properties/:id/verification', authenticateJWT, requireRole('admin'), adminPropertyController.verifyProperty);

module.exports = router;