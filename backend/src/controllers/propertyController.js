const Property = require('../models/Property');
const apiResponse = require('../utils/apiResponse');

/**
 * POST /api/properties
 * Owner only: create a new property
 */
async function createProperty(req, res, next) {
  try {
    const {
      title, propertyType, genderPreference, city, locality,
      address, pincode, latitude, longitude, description,
      minRent, maxRent, securityDeposit, estimatedMaintenance,
      estimatedFoodCharge, estimatedElectricityCharge,
      foodAvailable, noticePeriodDays, rules,
    } = req.body;

    // 1. Validation
    const errors = [];
    if (!title || typeof title !== 'string' || title.trim().length < 3) {
      errors.push({ field: 'title', message: 'Title is required (minimum 3 characters)' });
    }
    if (!city || typeof city !== 'string' || city.trim().length === 0) {
      errors.push({ field: 'city', message: 'City is required' });
    }
    if (!locality || typeof locality !== 'string' || locality.trim().length === 0) {
      errors.push({ field: 'locality', message: 'Locality is required' });
    }
    if (!address || typeof address !== 'string' || address.trim().length === 0) {
      errors.push({ field: 'address', message: 'Full physical address is required' });
    }
    if (minRent === undefined || isNaN(Number(minRent)) || Number(minRent) < 0) {
      errors.push({ field: 'minRent', message: 'Minimum rent must be a valid positive number' });
    }
    if (maxRent === undefined || isNaN(Number(maxRent)) || Number(maxRent) < Number(minRent)) {
      errors.push({ field: 'maxRent', message: 'Maximum rent must be greater than or equal to minimum rent' });
    }

    if (errors.length > 0) {
      return apiResponse.error(res, 'Validation failed: Check required property details', 400, errors);
    }

    // 2. Owner ID strictly extracted from authenticated user JWT
    const ownerId = req.user.id;

    // 3. Create property
    const newProperty = await Property.create({
      ownerId,
      title,
      propertyType,
      genderPreference,
      city,
      locality,
      address,
      pincode,
      latitude,
      longitude,
      description,
      minRent: Number(minRent),
      maxRent: Number(maxRent),
      securityDeposit: securityDeposit ? Number(securityDeposit) : 0,
      estimatedMaintenance: estimatedMaintenance ? Number(estimatedMaintenance) : 0,
      estimatedFoodCharge: estimatedFoodCharge ? Number(estimatedFoodCharge) : 0,
      estimatedElectricityCharge: estimatedElectricityCharge ? Number(estimatedElectricityCharge) : 0,
      foodAvailable: Boolean(foodAvailable),
      noticePeriodDays: noticePeriodDays ? Number(noticePeriodDays) : 30,
      rules,
    });

    return apiResponse.success(res, newProperty, 'Property created successfully and submitted for verification', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/properties
 * Public & Authenticated users: view list of properties with search, filters, and pagination
 * Supports ?my=true for owners to view only their own listings
 */
async function getProperties(req, res, next) {
  try {
    const isOwnerQuery = req.query.my === 'true';
    let filterOwnerId = null;

    if (isOwnerQuery) {
      if (!req.user || !req.user.id) {
        return apiResponse.error(res, 'Authentication token required to view your own properties', 401, [
          { field: 'authorization', message: 'You must be signed in to view your owner portfolio' },
        ]);
      }
      filterOwnerId = req.user.id;
    }

    const {
      search, q, city, locality, propertyType, type,
      genderPreference, gender, minRent, minPrice,
      maxRent, maxPrice, minTotalCost, maxTotalCost,
      foodAvailable, roomType, isAc, ac, isFurnished, furnished,
      availableOnly, hasVacancy, amenities, minRating,
      status, active, sortBy, sort, page, limit
    } = req.query;

    const result = await Property.findAll({
      ownerId: filterOwnerId,
      search: search || q || null,
      city: city || null,
      locality: locality || null,
      propertyType: propertyType || type || null,
      genderPreference: genderPreference || gender || null,
      minRent: minRent || minPrice || null,
      maxRent: maxRent || maxPrice || null,
      minTotalCost: minTotalCost || null,
      maxTotalCost: maxTotalCost || null,
      foodAvailable: foodAvailable !== undefined ? foodAvailable : null,
      roomType: roomType || null,
      isAc: isAc !== undefined ? isAc : (ac !== undefined ? ac : null),
      isFurnished: isFurnished !== undefined ? isFurnished : (furnished !== undefined ? furnished : null),
      availableOnly: availableOnly !== undefined ? availableOnly : (hasVacancy !== undefined ? hasVacancy : null),
      amenities: amenities || null,
      minRating: minRating || null,
      verificationStatus: status || null,
      isActive: active !== undefined ? active === 'true' : null,
      sortBy: sortBy || sort || 'newest',
      page: page ? parseInt(page, 10) : null,
      limit: limit ? parseInt(limit, 10) : null,
    });

    return apiResponse.success(
      res,
      result.properties,
      'Properties retrieved successfully',
      200,
      {
        total: result.total,
        count: result.properties.length,
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        hasNextPage: result.hasNextPage,
        hasPrevPage: result.hasPrevPage,
      }
    );
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/properties/filters/meta
 * Public: get dynamic filter choices, price boundaries, and amenities catalog
 */
async function getFilterMetadata(req, res, next) {
  try {
    const meta = await Property.getFilterMeta();
    return apiResponse.success(res, meta, 'Filter metadata retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/properties/:id
 * Authenticated users: view full details of a property
 */
async function getPropertyById(req, res, next) {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return apiResponse.error(res, 'Property not found', 404, [
        { field: 'id', message: `No property found with ID ${req.params.id}` },
      ]);
    }

    return apiResponse.success(res, property, 'Property details retrieved successfully', 200);
  } catch (err) {
    next(err);
  }
}

/**
 * PUT /api/properties/:id
 * Owner can update ONLY their own property. Admin can update any.
 */
async function updateProperty(req, res, next) {
  try {
    const property = await Property.findRaw(req.params.id);
    if (!property) {
      return apiResponse.error(res, 'Property not found', 404, [
        { field: 'id', message: `No property found with ID ${req.params.id}` },
      ]);
    }

    // Ownership check (Admin bypass allowed)
    if (property.owner_id !== req.user.id && req.user.role !== 'admin') {
      return apiResponse.error(res, 'Access denied: You can only modify your own properties', 403, [
        { field: 'ownership', message: 'User is not the designated owner of this property' },
      ]);
    }

    // Prevent changing ownership or verification status through this endpoint
    const updates = { ...req.body };
    delete updates.owner_id;
    delete updates.ownerId;
    delete updates.verification_status;
    delete updates.verificationStatus;
    delete updates.verified_at;
    delete updates.verified_by;

    const updated = await Property.update(req.params.id, updates);
    return apiResponse.success(res, updated, 'Property updated successfully', 200);
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/properties/:id
 * Owner can delete ONLY their own property. Admin can delete any.
 */
async function deleteProperty(req, res, next) {
  try {
    const property = await Property.findRaw(req.params.id);
    if (!property) {
      return apiResponse.error(res, 'Property not found', 404, [
        { field: 'id', message: `No property found with ID ${req.params.id}` },
      ]);
    }

    // Ownership check
    if (property.owner_id !== req.user.id && req.user.role !== 'admin') {
      return apiResponse.error(res, 'Access denied: You can only delete your own properties', 403, [
        { field: 'ownership', message: 'User is not the designated owner of this property' },
      ]);
    }

    await Property.delete(req.params.id);
    return apiResponse.success(res, { id: req.params.id, deleted: true }, 'Property deleted successfully', 200);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  createProperty,
  getProperties,
  getFilterMetadata,
  getPropertyById,
  updateProperty,
  deleteProperty,
};