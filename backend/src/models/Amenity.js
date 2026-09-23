const { pool } = require('../config/db');

const Amenity = {
  /**
   * List all standardized platform amenities
   */
  async findAll() {
    const [rows] = await pool.query('SELECT * FROM amenities ORDER BY category, name ASC');
    return rows;
  },

  /**
   * List amenities assigned to a specific property
   */
  async findByPropertyId(propertyId) {
    const [rows] = await pool.query(
      `SELECT a.* FROM amenities a
       JOIN property_amenities pa ON a.id = pa.amenity_id
       WHERE pa.property_id = ?
       ORDER BY a.category, a.name ASC`,
      [propertyId]
    );
    return rows;
  },

  /**
   * Safely replace property amenity assignments inside a transaction
   */
  async assignToProperty(propertyId, amenityIds = []) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Delete current mappings for property
      await connection.query('DELETE FROM property_amenities WHERE property_id = ?', [propertyId]);

      // 2. Validate and insert new mappings if any provided
      if (Array.isArray(amenityIds) && amenityIds.length > 0) {
        // Validate IDs exist in amenities table
        const placeholders = amenityIds.map(() => '?').join(',');
        const [validAmenities] = await connection.query(
          `SELECT id FROM amenities WHERE id IN (${placeholders})`,
          amenityIds
        );

        if (validAmenities.length > 0) {
          const values = validAmenities.map((a) => [propertyId, a.id]);
          await connection.query(
            'INSERT INTO property_amenities (property_id, amenity_id) VALUES ?',
            [values]
          );
        }
      }

      await connection.commit();

      // 3. Return fresh amenity list
      const [updated] = await connection.query(
        `SELECT a.* FROM amenities a
         JOIN property_amenities pa ON a.id = pa.amenity_id
         WHERE pa.property_id = ?
         ORDER BY a.category, a.name ASC`,
        [propertyId]
      );
      return updated;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
};

module.exports = Amenity;