const { pool } = require('../config/db');

const PropertyImage = {
  /**
   * Add image metadata to property
   */
  async create(data) {
    const { propertyId, imageUrl, isPrimary = false, sortOrder = 0, caption = null } = data;

    // If isPrimary is true, unset any existing primary image for this property
    if (isPrimary) {
      await pool.query('UPDATE property_images SET is_primary = false WHERE property_id = ?', [propertyId]);
    }

    const [result] = await pool.query(
      `INSERT INTO property_images (property_id, image_url, is_primary, sort_order, caption)
       VALUES (?, ?, ?, ?, ?)`,
      [propertyId, imageUrl.trim(), Boolean(isPrimary), sortOrder, caption ? caption.trim() : null]
    );

    return this.findById(result.insertId);
  },

  /**
   * Find image by ID with owner_id from properties (for ownership verification)
   */
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT pi.*, p.owner_id 
       FROM property_images pi
       JOIN properties p ON pi.property_id = p.id
       WHERE pi.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Find all images for a property
   */
  async findByPropertyId(propertyId) {
    const [rows] = await pool.query(
      'SELECT * FROM property_images WHERE property_id = ? ORDER BY is_primary DESC, sort_order ASC, id ASC',
      [propertyId]
    );
    return rows;
  },

  /**
   * Delete an image
   */
  async delete(id) {
    const [result] = await pool.query('DELETE FROM property_images WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = PropertyImage;