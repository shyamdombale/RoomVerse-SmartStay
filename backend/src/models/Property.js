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
   * Find all properties with advanced search, multi-faceted filtering, sorting, and pagination
   */
  async findAll({
    ownerId = null,
    search = null,
    city = null,
    locality = null,
    propertyType = null,
    genderPreference = null,
    minRent = null,
    maxRent = null,
    minTotalCost = null,
    maxTotalCost = null,
    foodAvailable = null,
    roomType = null,
    isAc = null,
    isFurnished = null,
    availableOnly = null,
    amenities = null,
    minRating = null,
    verificationStatus = null,
    isActive = null,
    sortBy = 'newest',
    page = null,
    limit = null,
  } = {}) {
    let baseWhere = ' WHERE 1=1';
    const params = [];

    // 1. Owner Filter (for ?my=true)
    if (ownerId) {
      baseWhere += ' AND p.owner_id = ?';
      params.push(ownerId);
    }

    // 2. Verification & Active Status
    if (verificationStatus) {
      baseWhere += ' AND p.verification_status = ?';
      params.push(verificationStatus);
    } else if (!ownerId) {
      // Public search defaults to verified properties
      baseWhere += " AND p.verification_status = 'verified'";
    }

    if (isActive !== null && isActive !== undefined) {
      baseWhere += ' AND p.is_active = ?';
      params.push(Boolean(isActive));
    } else if (!ownerId) {
      baseWhere += ' AND p.is_active = TRUE';
    }

    // 3. Keyword Search (q/search)
    if (search && search.trim()) {
      const term = `%${search.trim().toLowerCase()}%`;
      baseWhere += ` AND (
        LOWER(p.title) LIKE ? OR
        LOWER(p.city) LIKE ? OR
        LOWER(p.locality) LIKE ? OR
        LOWER(p.address) LIKE ? OR
        LOWER(COALESCE(p.description, '')) LIKE ?
      )`;
      params.push(term, term, term, term, term);
    }

    // 4. City Filter
    if (city && city.trim()) {
      baseWhere += ' AND LOWER(p.city) = LOWER(?)';
      params.push(city.trim());
    }

    // 5. Locality Filter
    if (locality && locality.trim()) {
      baseWhere += ' AND LOWER(p.locality) LIKE LOWER(?)';
      params.push(`%${locality.trim()}%`);
    }

    // 6. Property Type Filter (supports array or comma-separated)
    if (propertyType) {
      const types = Array.isArray(propertyType)
        ? propertyType
        : propertyType.split(',').map((t) => t.trim().toLowerCase()).filter(Boolean);
      if (types.length > 0) {
        baseWhere += ` AND p.property_type IN (${types.map(() => '?').join(', ')})`;
        params.push(...types);
      }
    }

    // 7. Gender Preference Filter (supports 'male', 'female', 'any')
    if (genderPreference && genderPreference !== 'all') {
      const gender = genderPreference.trim().toLowerCase();
      if (gender === 'male') {
        baseWhere += " AND p.gender_preference IN ('male', 'any')";
      } else if (gender === 'female') {
        baseWhere += " AND p.gender_preference IN ('female', 'any')";
      } else if (gender === 'any' || gender === 'unisex') {
        baseWhere += " AND p.gender_preference = 'any'";
      }
    }

    // 8. Base Rent Filtering (minRent, maxRent)
    if (minRent !== null && minRent !== undefined && !isNaN(Number(minRent))) {
      baseWhere += ' AND p.max_rent >= ?';
      params.push(Number(minRent));
    }
    if (maxRent !== null && maxRent !== undefined && !isNaN(Number(maxRent))) {
      baseWhere += ' AND p.min_rent <= ?';
      params.push(Number(maxRent));
    }

    // 9. Total Monthly Living Cost Filtering
    const totalCostExpr = `(p.min_rent + p.estimated_maintenance + (CASE WHEN p.food_available THEN p.estimated_food_charge ELSE 0 END) + p.estimated_electricity_charge)`;
    if (minTotalCost !== null && minTotalCost !== undefined && !isNaN(Number(minTotalCost))) {
      baseWhere += ` AND ${totalCostExpr} >= ?`;
      params.push(Number(minTotalCost));
    }
    if (maxTotalCost !== null && maxTotalCost !== undefined && !isNaN(Number(maxTotalCost))) {
      baseWhere += ` AND ${totalCostExpr} <= ?`;
      params.push(Number(maxTotalCost));
    }

    // 10. Food / Meals Available Filter
    if (foodAvailable !== null && foodAvailable !== undefined && foodAvailable !== '') {
      const foodVal = foodAvailable === true || foodAvailable === 'true' || foodAvailable === 1 || foodAvailable === '1';
      baseWhere += ' AND p.food_available = ?';
      params.push(foodVal);
    }

    // 11. Room Configuration Filters
    // 11.1 Room Type (e.g. single, double, triple, four_plus)
    if (roomType) {
      const roomTypes = Array.isArray(roomType)
        ? roomType
        : roomType.split(',').map((rt) => rt.trim().toLowerCase()).filter(Boolean);
      if (roomTypes.length > 0) {
        baseWhere += ` AND EXISTS (SELECT 1 FROM rooms r WHERE r.property_id = p.id AND r.room_type IN (${roomTypes.map(() => '?').join(', ')}))`;
        params.push(...roomTypes);
      }
    }

    // 11.2 Air Conditioned (isAc)
    if (isAc !== null && isAc !== undefined && isAc !== '') {
      const acVal = isAc === true || isAc === 'true' || isAc === 1 || isAc === '1';
      baseWhere += ' AND EXISTS (SELECT 1 FROM rooms r WHERE r.property_id = p.id AND r.is_ac = ?)';
      params.push(acVal);
    }

    // 11.3 Furnished (isFurnished)
    if (isFurnished !== null && isFurnished !== undefined && isFurnished !== '') {
      const furnVal = isFurnished === true || isFurnished === 'true' || isFurnished === 1 || isFurnished === '1';
      baseWhere += ' AND EXISTS (SELECT 1 FROM rooms r WHERE r.property_id = p.id AND r.is_furnished = ?)';
      params.push(furnVal);
    }

    // 11.4 Available Vacancy Only (availableOnly / hasVacancy)
    if (availableOnly === true || availableOnly === 'true' || availableOnly === 1 || availableOnly === '1') {
      baseWhere += " AND EXISTS (SELECT 1 FROM rooms r WHERE r.property_id = p.id AND r.status = 'available' AND r.available_capacity > 0)";
    }

    // 12. Amenities Filter (Properties having ALL specified amenities)
    if (amenities) {
      const amenityList = Array.isArray(amenities)
        ? amenities
        : String(amenities).split(',').map((a) => a.trim().toLowerCase()).filter(Boolean);
      if (amenityList.length > 0) {
        const placeholders = amenityList.map(() => '?').join(', ');
        baseWhere += ` AND (
          SELECT COUNT(DISTINCT pa.amenity_id)
          FROM property_amenities pa
          JOIN amenities a ON pa.amenity_id = a.id
          WHERE pa.property_id = p.id AND (LOWER(a.slug) IN (${placeholders}) OR CAST(pa.amenity_id AS CHAR) IN (${placeholders}))
        ) = ?`;
        params.push(...amenityList, ...amenityList, amenityList.length);
      }
    }

    // 13. Minimum Rating Filter
    if (minRating !== null && minRating !== undefined && !isNaN(Number(minRating))) {
      baseWhere += ' AND p.average_rating >= ?';
      params.push(Number(minRating));
    }

    // Count Total Matching Records for Pagination
    const countSql = `SELECT COUNT(*) AS total FROM properties p JOIN users u ON p.owner_id = u.id ${baseWhere}`;
    const [countRows] = await pool.query(countSql, params);
    const total = countRows[0]?.total || 0;

    // Sorting
    let orderBySql = ' ORDER BY p.created_at DESC, p.id DESC';
    switch (sortBy) {
      case 'price_asc':
      case 'price_low':
        orderBySql = ' ORDER BY p.min_rent ASC, p.id ASC';
        break;
      case 'price_desc':
      case 'price_high':
        orderBySql = ' ORDER BY p.min_rent DESC, p.id ASC';
        break;
      case 'rating':
        orderBySql = ' ORDER BY p.average_rating DESC, p.total_reviews DESC, p.id ASC';
        break;
      case 'popular':
      case 'views':
        orderBySql = ' ORDER BY p.total_views DESC, p.id ASC';
        break;
      case 'newest':
      default:
        orderBySql = ' ORDER BY p.created_at DESC, p.id DESC';
        break;
    }

    // Data SQL
    let dataSql = `
      SELECT 
        p.id, p.owner_id, p.title, p.property_type, p.gender_preference,
        p.city, p.locality, p.address, p.description,
        p.min_rent, p.max_rent, p.security_deposit,
        p.estimated_maintenance, p.estimated_food_charge, p.estimated_electricity_charge,
        p.food_available, p.verification_status, p.average_rating, p.total_reviews, p.total_views,
        p.is_active, p.created_at, p.updated_at,
        u.name AS owner_name,
        u.email AS owner_email,
        (SELECT image_url FROM property_images pi WHERE pi.property_id = p.id AND pi.is_primary = true LIMIT 1) AS primary_image_url,
        (SELECT COUNT(*) FROM rooms r WHERE r.property_id = p.id) AS room_count,
        (SELECT COUNT(*) FROM rooms r WHERE r.property_id = p.id AND r.status = 'available' AND r.available_capacity > 0) AS available_room_count
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      ${baseWhere}
      ${orderBySql}
    `;

    // Pagination
    const queryParams = [...params];
    const pageNum = page ? Math.max(1, parseInt(page, 10)) : null;
    const limitNum = limit ? Math.max(1, parseInt(limit, 10)) : null;

    if (pageNum && limitNum) {
      const offset = (pageNum - 1) * limitNum;
      dataSql += ' LIMIT ? OFFSET ?';
      queryParams.push(limitNum, offset);
    }

    const [rows] = await pool.query(dataSql, queryParams);

    return {
      properties: rows,
      total,
      page: pageNum || 1,
      limit: limitNum || total,
      totalPages: limitNum ? Math.ceil(total / limitNum) : 1,
      hasNextPage: pageNum && limitNum ? pageNum * limitNum < total : false,
      hasPrevPage: pageNum ? pageNum > 1 : false,
    };
  },

  /**
   * Get metadata and aggregations for dynamic search filters
   */
  async getFilterMeta() {
    const [cities] = await pool.query(
      `SELECT DISTINCT city FROM properties WHERE verification_status = 'verified' AND is_active = TRUE ORDER BY city ASC`
    );
    const [localities] = await pool.query(
      `SELECT DISTINCT city, locality FROM properties WHERE verification_status = 'verified' AND is_active = TRUE ORDER BY city ASC, locality ASC`
    );
    const [priceRange] = await pool.query(
      `SELECT MIN(min_rent) AS minRent, MAX(max_rent) AS maxRent FROM properties WHERE verification_status = 'verified' AND is_active = TRUE`
    );
    const [amenities] = await pool.query(
      `SELECT id, name, slug, icon, category FROM amenities ORDER BY category, name ASC`
    );

    return {
      cities: cities.map((c) => c.city),
      localities,
      propertyTypes: ['pg', 'hostel', 'flat', 'coliving'],
      genderPreferences: ['any', 'male', 'female'],
      roomTypes: ['single', 'double', 'triple', 'four_plus'],
      priceRange: {
        minRent: Number(priceRange[0]?.minRent || 5000),
        maxRent: Number(priceRange[0]?.maxRent || 30000),
      },
      amenities,
    };
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