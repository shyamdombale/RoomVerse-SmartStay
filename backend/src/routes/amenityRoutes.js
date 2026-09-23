const express = require('express');
const router = express.Router();
const amenityController = require('../controllers/amenityController');
const { authenticateJWT } = require('../middleware/authMiddleware');

router.get('/', authenticateJWT, amenityController.getAmenities);

module.exports = router;