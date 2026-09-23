const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateJWT, requireRole } = require('../middleware/authMiddleware');
const apiResponse = require('../utils/apiResponse');

// Public Authentication Endpoints
router.post('/register', authController.register);
router.post('/login', authController.login);

// Protected Identity Endpoint
router.get('/me', authenticateJWT, authController.getMe);

// Minimal RBAC Verification Test Endpoints
router.get('/test-role/tenant', authenticateJWT, requireRole('tenant'), (req, res) => {
  return apiResponse.success(res, { role: req.user.role, access: 'granted' }, 'Tenant clearance verified');
});

router.get('/test-role/owner', authenticateJWT, requireRole('owner'), (req, res) => {
  return apiResponse.success(res, { role: req.user.role, access: 'granted' }, 'Owner clearance verified');
});

router.get('/test-role/admin', authenticateJWT, requireRole('admin'), (req, res) => {
  return apiResponse.success(res, { role: req.user.role, access: 'granted' }, 'Admin clearance verified');
});

module.exports = router;