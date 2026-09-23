const PropertyImage = require('../models/PropertyImage');
const Property = require('../models/Property');
const apiResponse = require('../utils/apiResponse');

/**
 * POST /api/properties/:propertyId/images
 * Add image metadata to property (Owner of property or Admin only)
 */
async function addImage(req, res, next) {
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
      return apiResponse.error(res, 'Access denied: You can only add images to your own property', 403, [
        { field: 'ownership', message: 'User is not the designated owner of this property' },
      ]);
    }

    const { imageUrl, isPrimary, sortOrder, caption } = req.body;
    if (!imageUrl || typeof imageUrl !== 'string' || imageUrl.trim().length === 0) {
      return apiResponse.error(res, 'Validation failed: imageUrl is required', 400, [
        { field: 'imageUrl', message: 'A valid image URL string is required' },
      ]);
    }

    const image = await PropertyImage.create({
      propertyId,
      imageUrl,
      isPrimary: Boolean(isPrimary),
      sortOrder: sortOrder ? Number(sortOrder) : 0,
      caption,
    });

    return apiResponse.success(res, image, 'Image metadata added successfully', 201);
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/properties/:propertyId/images
 * List images for property
 */
async function getImages(req, res, next) {
  try {
    const { propertyId } = req.params;
    const images = await PropertyImage.findByPropertyId(propertyId);
    return apiResponse.success(res, images, 'Property images retrieved successfully', 200, {
      count: images.length,
    });
  } catch (err) {
    next(err);
  }
}

/**
 * DELETE /api/properties/:propertyId/images/:imageId
 * Delete image metadata (Owner of property or Admin only)
 */
async function deleteImage(req, res, next) {
  try {
    const { propertyId, imageId } = req.params;
    const image = await PropertyImage.findById(imageId);

    if (!image || image.property_id !== propertyId) {
      return apiResponse.error(res, 'Image not found', 404, [
        { field: 'imageId', message: `No image with ID ${imageId} exists for property ${propertyId}` },
      ]);
    }

    // Ownership Check
    if (image.owner_id !== req.user.id && req.user.role !== 'admin') {
      return apiResponse.error(res, 'Access denied: You can only delete images from your own property', 403, [
        { field: 'ownership', message: 'User is not the designated owner of this property' },
      ]);
    }

    await PropertyImage.delete(imageId);
    return apiResponse.success(res, { id: imageId, deleted: true }, 'Image metadata removed successfully', 200);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  addImage,
  getImages,
  deleteImage,
};