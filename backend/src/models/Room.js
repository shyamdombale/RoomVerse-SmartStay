const crypto = require('crypto');
const { pool } = require('../config/db');

const Room = {
  /**
   * Create a new room in a property
   */
  async create(data) {
    const id = data.id || crypto.randomUUID();
    const {
      propertyId,
      roomNumberName,
      roomType = 'single',
      isAc = false,
      isFurnished = true,
      monthlyRent,
      totalCapacity = 1,
      availableCapacity = 1,
      status = 'available',
    } = data;

    const query = `
      INSERT INTO rooms (
        id, property_id, room_number_name, room_type, is_ac, is_furnished,
        monthly_rent, total_capacity, available_capacity, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await pool.query(query, [
      id, propertyId, roomNumberName.trim(), roomType, Boolean(isAc), Boolean(isFurnished),
      monthlyRent, totalCapacity, availableCapacity, status,
    ]);

    return this.findById(id);
  },

  /**
   * Find room by ID with associated property metadata (for ownership checks)
   */
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT r.*, p.owner_id, p.title AS property_title
       FROM rooms r
       JOIN properties p ON r.property_id = p.id
       WHERE r.id = ? LIMIT 1`,
      [id]
    );
    return rows[0] || null;
  },

  /**
   * Find all rooms for a specific property
   */
  async findByPropertyId(propertyId) {
    const [rows] = await pool.query(
      'SELECT * FROM rooms WHERE property_id = ? ORDER BY monthly_rent ASC',
      [propertyId]
    );
    return rows;
  },

  /**
   * Update room details
   */
  async update(id, updates) {
    const allowedFields = [
      'room_number_name', 'room_type', 'is_ac', 'is_furnished',
      'monthly_rent', 'total_capacity', 'available_capacity', 'status',
    ];

    const fields = [];
    const values = [];

    for (const key of allowedFields) {
      const camelKey = key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
      if (updates[key] !== undefined) {
        fields.push(`\`${key}\` = ?`);
        values.push(updates[key]);
      } else if (updates[camelKey] !== undefined) {
        fields.push(`\`${key}\` = ?`);
        values.push(updates[camelKey]);
      }
    }

    if (fields.length === 0) return this.findById(id);

    values.push(id);
    const sql = `UPDATE rooms SET ${fields.join(', ')} WHERE id = ?`;
    await pool.query(sql, values);

    return this.findById(id);
  },

  /**
   * Delete room by ID
   */
  async delete(id) {
    const [result] = await pool.query('DELETE FROM rooms WHERE id = ?', [id]);
    return result.affectedRows > 0;
  },
};

module.exports = Room;