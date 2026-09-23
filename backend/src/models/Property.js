const crypto = require('crypto');
const { pool } = require('../config/db');

const Property = {
  /**
   * Create a new property listing (defaults to pending verification)
   */
  async create(data) {
    const id = data.id || crypto.randomUUID();
    const {
      ownerId,
      title,
      propertyType = 'pg',
      genderPreference = 'any',
      city,
      locality,
      address,
      pincode = null,
      latitude = null,
      longitude = null,
      description = null,
      minRent,
      maxRent,
      securityDeposit = 0.00,
      estimatedMaintenance = 0.00,
      estimatedFoodCharge = 0.00,
      estimatedElectricityCharge = 0.00,
      foodAvailable = false,
      noticePeriodDays = 30,
      rules = null,
    } = data;

    const query = `
      INSERT INTO properties (
        id, owner_id, title, property_type, gender_preference,
        city, locality, address, pincode, latitude, longitude,
        description, min_rent, max_rent, security_deposit,
        estimated_maintenance, estimated_food_charge, estimated_electricity_charge,
        food_available, notice_period_days, rules, verification_status, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', true)
    `;

    await pool.query(query, [
      id, ownerId, title.trim(), propertyType, genderPreference,
      city.trim(), locality.trim(), address.trim(), pincode, latitude, longitude,
      description, minRent, maxRent, securityDeposit,
      estimatedMaintenance, estimatedFoodCharge, estimatedElectricityCharge,
      Boolean(foodAvailable), noticePeriodDays, rules,
    ]);

    return this.findById(id);
  },

  /**
   * Find property by ID with owner information, rooms, amenities, and images
   */
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT 
        p.*,
        u.name AS owner_name,
        u.email AS owner_email,
        u.phone AS owner_phone
       FROM properties p
       JOIN users u ON p.owner_id = u.id
       WHERE p.id = ? LIMIT 1`,
      [id]
    );

    if (!rows[0]) return null;
    const property = rows[0];

    // Fetch rooms
    const [rooms] = await pool.query(
      `SELECT id, room_number_name, room_type, is_ac, is_furnished, monthly_rent, total_capacity, available_capacity, status, created_at
       FROM rooms WHERE property_id = ? ORDER BY monthly_rent ASC`,
      [id]
    );

    // Fetch amenities
    const [amenities] = await pool.query(
      `SELECT a.id, a.name, a.slug, a.icon, a.category
       FROM amenities a
       JOIN property_amenities pa ON a.id = pa.amenity_id
       WHERE pa.property_id = ? ORDER BY a.category, a.name`,
      [id]
    );

    // Fetch images
    const [images] = await pool.query(
      `SELECT id, image_url, is_primary, sort_order, caption, created_at
       FROM property_images WHERE property_id = ? ORDER BY sort_order ASC, id ASC`,
      [id]
    );

    return {
      ...property,
      rooms: rooms || [],
      amenities: amenities || [],
      images: images || [],
    };
  },

  /**
   * Find raw property record for ownership verification
   */
  async findRaw(id) {
    const [rows] = await pool.query('SELECT * FROM properties WHERE id = ? LIMIT 1', [id]);
    return rows[0] || null;
  },

  /**
   * Find all properties with optional owner filter
   */
  async findAll({ ownerId = null, city = null, verificationStatus = null, isActive = null } = {}) {
    let sql = `
      SELECT 
        p.id, p.owner_id, p.title, p.property_type, p.gender_preference,
        p.city, p.locality, p.min_rent, p.max_rent, p.security_deposit,
        p.food_available, p.verification_status, p.average_rating, p.total_reviews,
        p.is_active, p.created_at, p.updated_at,
        u.name AS owner_name,
        u.email AS owner_email,
        (SELECT image_url FROM property_images pi WHERE pi.property_id = p.id AND pi.is_primary = true LIMIT 1) AS primary_image_url,
        (SELECT COUNT(*) FROM rooms r WHERE r.property_id = p.id) AS room_count
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (ownerId) {
      sql += ' AND p.owner_id = ?';
      params.push(ownerId);
    }
    if (city) {
      sql += ' AND LOWER(p.city) = LOWER(?)';
      params.push(city.trim());
    }
    if (verificationStatus) {
      sql += ' AND p.verification_status = ?';
      params.push(verificationStatus);
    }
    if (isActive !== null) {
      sql += ' AND p.is_active = ?';
      params.push(Boolean(isActive));
    }

    sql += ' ORDER BY p.created_at DESC';

    const [rows] = await pool.query(sql, params);
    return rows;
  },

  /**
   * Update property fields (prevents owner_id reassignment and self-verification)
   */
  async update(id, updates) {
    const allowedFields = [
      'title', 'property_type', 'gender_preference', 'city', 'locality',
      'address', 'pincode', 'latitude', 'longitude', 'description',
      'min_rent', 'max_rent', 'security_deposit', 'estimated_maintenance',
      'estimated_food_charge', 'estimated_electricity_charge', 'food_available',
      'notice_period_days', 'rules', 'is_active',
    ];

    const fields = [];
    const values = [];

    for (const key of allowedFields) {
      // Map camelCase to snake_case
      const snakeKey = key;
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());

      if (updates[snakeKey] !== undefined) {
        fields.push(`\`${snakeKey}\` = ?`);
        values.push(updates[snakeKey]);
      } else if (updates[camelKey] !== undefined) {
        fields.push(`\`${snakeKey}\` = ?`);
        values.push(updates[camelKey]);
      }
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const sql = `UPDATE properties SET ${fields.join(', ')} WHERE id = ?`;
    await pool.query(sql, values);

    return this.findById(id);
  },

  /**
   * Delete property (cascades rooms, images, amenities via DB foreign keys)
   */
  async delete(id) {
    const [result] = await pool.query('DELETE FROM properties WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },

  /**
   * Admin verification update with audit logging inside a transaction
   */
  async updateVerification(id, { status, adminId, comments = null }) {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Update property verification status
      const verifiedAt = status === 'verified' ? new Date() : null;
      await connection.query(
        `UPDATE properties 
         SET verification_status = ?, 
             verified_at = ?, 
             verified_by = ? 
         WHERE id = ?`,
        [status, verifiedAt, adminId, id]
      );

      // 2. Insert into verification_logs
      await connection.query(
        `INSERT INTO verification_logs (property_id, admin_id, action, comments)
         VALUES (?, ?, ?, ?)`,
        [id, adminId, status, comments]
      );

      await connection.commit();
      return this.findById(id);
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
};

module.exports = Property;