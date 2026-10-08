const express = require('express');
const router = express.Router();
const propertyController = require('../controllers/propertyController');
const roomController = require('../controllers/roomController');
const amenityController = require('../controllers/amenityController');
const imageController = require('../controllers/imageController');
const { authenticateJWT, optionalAuthenticateJWT, requireRole } = require('../middleware/authMiddleware');

// Property Filter Metadata (Must be declared before /:id)
router.get('/filters/meta', propertyController.getFilterMetadata);

// Property Core CRUD
router.post('/', authenticateJWT, requireRole('owner'), propertyController.createProperty);
router.get('/', optionalAuthenticateJWT, propertyController.getProperties);
router.get('/:id', optionalAuthenticateJWT, propertyController.getPropertyById);
router.put('/:id', authenticateJWT, requireRole('owner', 'admin'), propertyController.updateProperty);
router.delete('/:id', authenticateJWT, requireRole('owner', 'admin'), propertyController.deleteProperty);

// Nested Room Routes
router.post('/:propertyId/rooms', authenticateJWT, requireRole('owner', 'admin'), roomController.createRoom);
router.get('/:propertyId/rooms', authenticateJWT, roomController.getRoomsByProperty);

// Nested Amenity Assignment
router.put('/:propertyId/amenities', authenticateJWT, requireRole('owner', 'admin'), amenityController.updatePropertyAmenities);

// Nested Image Metadata
router.post('/:propertyId/images', authenticateJWT, requireRole('owner', 'admin'), imageController.addImage);
router.get('/:propertyId/images', authenticateJWT, imageController.getImages);
router.delete('/:propertyId/images/:imageId', authenticateJWT, requireRole('owner', 'admin'), imageController.deleteImage);

module.exports = router;