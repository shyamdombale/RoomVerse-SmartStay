const Amenity = require('../models/Amenity');
const Property = require('../models/Property');
const apiResponse = require('../utils/apiResponse');

/**
 * GET /api/amenities
 * List all standardized platform amenities
 */
async function getAmenities(req, res, next) {
  try {
    const amenities = await Amenity.findAll();
    return apiResponse.success(res, amenities, 'Amenities catalog retrieved successfully', 200, {
      count: amenities.length,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/properties/:propertyId/amenities
 * Assign/replace amenities for a property (Owner of property or Admin only)
 */
async function updatePropertyAmenities(req, res, next) {
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
      return apiResponse.error(res, 'Access denied: You can only assign amenities to your own property', 403, [
        { field: 'ownership', message: 'User is not the designated owner of this property' },
      ]);
    }

    const { amenityIds } = req.body;
    if (!Array.isArray(amenityIds)) {
      return apiResponse.error(res, 'Validation failed: amenityIds must be an array of amenity IDs', 400, [
        { field: 'amenityIds', message: 'Expected array of integers' },
      ]);
    }

    const updatedAmenities = await Amenity.assignToProperty(propertyId, amenityIds);
    return apiResponse.success(res, updatedAmenities, 'Property amenities updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAmenities,
  updatePropertyAmenities,
};