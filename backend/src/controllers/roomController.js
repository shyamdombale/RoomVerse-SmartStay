const Room = require('../models/Room');
const Property = require('../models/Property');
const apiResponse = require('../utils/apiResponse');

/**
 * POST /api/properties/:propertyId/rooms
 * Add room to property (Owner of property or Admin only)
 */
async function createRoom(req, res, next) {
  try {
    const { propertyId } = req.params;
    const property = await Property.findRaw(propertyId);

    if (!property) {
      return apiResponse.error(res, 'Property not found', 404, [
        { field: 'propertyId', message: `No property exists with ID ${propertyId}` },
      ]);
    }

    // Ownership Check
    if (property.owner_id !== req.user.id && req.user.role !== 'admin') {
      return apiResponse.error(res, 'Access denied: You can only add rooms to your own property', 403, [
        { field: 'ownership', message: 'User is not the designated owner of this property' },
      ]);
    }

    const {
      roomNumberName, roomType, isAc, isFurnished,
      monthlyRent, totalCapacity, availableCapacity, status,
    } = req.body;

    const errors = [];
    if (!roomNumberName || typeof roomNumberName !== 'string' || roomNumberName.trim().length === 0) {
      errors.push({ field: 'roomNumberName', message: 'Room name or number is required' });
    }
    if (monthlyRent === undefined || isNaN(Number(monthlyRent)) || Number(monthlyRent) <= 0) {
      errors.push({ field: 'monthlyRent', message: 'Monthly rent must be a positive number' });
    }

    if (errors.length > 0) {
      return apiResponse.error(res, 'Validation failed for room creation', 400, errors);
    }

    const newRoom = await Room.create({
      propertyId,
      roomNumberName,
      roomType,
      isAc: Boolean(isAc),
      isFurnished: Boolean(isFurnished),
      monthlyRent: Number(monthlyRent),
      totalCapacity: totalCapacity ? Number(totalCapacity) : 1,
      availableCapacity: availableCapacity !== undefined ? Number(availableCapacity) : (totalCapacity ? Number(totalCapacity) : 1),
      status: status || 'available',
    });

    return apiResponse.success(res, newRoom, 'Room created successfully', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/properties/:propertyId/rooms
 * List all rooms for a property
 */
async function getRoomsByProperty(req, res, next) {
  try {
    const { propertyId } = req.params;
    const property = await Property.findRaw(propertyId);

    if (!property) {
      return apiResponse.error(res, 'Property not found', 404, [
        { field: 'propertyId', message: `No property exists with ID ${propertyId}` },
      ]);
    }

    const rooms = await Room.findByPropertyId(propertyId);
    return apiResponse.success(res, rooms, 'Rooms retrieved successfully', 200, { count: rooms.length });
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/rooms/:id
 * Retrieve room details
 */
async function getRoomById(req, res, next) {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return apiResponse.error(res, 'Room not found', 404, [
        { field: 'id', message: `No room exists with ID ${req.params.id}` },
      ]);
    }
    return apiResponse.success(res, room, 'Room details retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/rooms/:id
 * Update room (Owner of parent property or Admin only)
 */
async function updateRoom(req, res, next) {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return apiResponse.error(res, 'Room not found', 404, [
        { field: 'id', message: `No room exists with ID ${req.params.id}` },
      ]);
    }

    // Ownership Check via joined property owner_id
    if (room.owner_id !== req.user.id && req.user.role !== 'admin') {
      return apiResponse.error(res, 'Access denied: You can only update rooms in your own properties', 403, [
        { field: 'ownership', message: 'User is not the designated owner of this room\'s property' },
      ]);
    }

    const updated = await Room.update(req.params.id, req.body);
    return apiResponse.success(res, updated, 'Room updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/rooms/:id
 * Delete room (Owner of parent property or Admin only)
 */
async function deleteRoom(req, res, next) {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) {
      return apiResponse.error(res, 'Room not found', 404, [
        { field: 'id', message: `No room exists with ID ${req.params.id}` },
      ]);
    }

    // Ownership Check
    if (room.owner_id !== req.user.id && req.user.role !== 'admin') {
      return apiResponse.error(res, 'Access denied: You can only delete rooms in your own properties', 403, [
        { field: 'ownership', message: 'User is not the designated owner of this room\'s property' },
      ]);
    }

    await Room.delete(req.params.id);
    return apiResponse.success(res, { id: req.params.id, deleted: true }, 'Room deleted successfully', 200);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createRoom,
  getRoomsByProperty,
  getRoomById,
  updateRoom,
  deleteRoom,
};