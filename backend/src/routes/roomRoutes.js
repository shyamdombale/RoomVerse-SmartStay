const express = require('express');
const router = express.Router();
const roomController = require('../controllers/roomController');
const { authenticateJWT, requireRole } = require('../middleware/authMiddleware');

router.get('/:id', authenticateJWT, roomController.getRoomById);
router.put('/:id', authenticateJWT, requireRole('owner', 'admin'), roomController.updateRoom);
router.delete('/:id', authenticateJWT, requireRole('owner', 'admin'), roomController.deleteRoom);

module.exports = router;