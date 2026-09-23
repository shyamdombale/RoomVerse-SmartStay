const Property = require('../models/Property');
const apiResponse = require('../utils/apiResponse');

/**
 * PATCH /api/admin/properties/:id/verification
 * Admin only: update property verification status and log audit record
 */
async function verifyProperty(req, res, next) {
  try {
    const { id } = req.params;
    const { status, comments } = req.body;

    const allowedStatuses = ['verified', 'rejected', 'expired', 'pending'];
    if (!status || !allowedStatuses.includes(status.toLowerCase())) {
      return apiResponse.error(res, 'Validation failed: Invalid verification status', 400, [
        { field: 'status', message: `Status must be one of: ${allowedStatuses.join(', ')}` },
      ]);
    }

    const property = await Property.findRaw(id);
    if (!property) {
      return apiResponse.error(res, 'Property not found', 404, [
        { field: 'id', message: `No property exists with ID ${id}` },
      ]);
    }

    const updated = await Property.updateVerification(id, {
      status: status.toLowerCase(),
      adminId: req.user.id,
      comments: comments ? comments.trim() : null,
    });

    return apiResponse.success(res, updated, `Property status updated to "${status}" and audit logged`, 200);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/admin/properties
 * Admin only: list all properties across the platform with full status
 */
async function getAllProperties(req, res, next) {
  try {
    const properties = await Property.findAll({
      verificationStatus: req.query.status || null,
      city: req.query.city || null,
    });

    return apiResponse.success(res, properties, 'Admin property overview retrieved successfully', 200, {
      count: properties.length,
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  verifyProperty,
  getAllProperties,
};