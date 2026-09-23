const { pool } = require('../config/db');

const User = {
  /**
   * Find user by email (including password_hash for authentication)
   */
  async findByEmail(email) {
    const cleanEmail = email.trim().toLowerCase();
    const [rows] = await pool.query(
      'SELECT id, name, email, password_hash, phone, role, is_active, created_at, updated_at FROM users WHERE email = ? LIMIT 1',
      [cleanEmail]
    );
    return rows[0] || null;
  },

  /**
   * Find safe user by ID (excludes password_hash, includes profile metadata)
   */
  async findById(id) {
    const [rows] = await pool.query(
      `SELECT 
        u.id, 
        u.name, 
        u.email, 
        u.phone, 
        u.role, 
        u.is_active, 
        u.created_at, 
        u.updated_at,
        p.gender,
        p.occupation,
        p.institution_name,
        p.emergency_contact,
        p.bio,
        p.city,
        p.avatar_url
       FROM users u
       LEFT JOIN profiles p ON u.id = p.user_id
       WHERE u.id = ? LIMIT 1`,
      [id]
    );

    if (!rows[0]) return null;

    const row = rows[0];
    return {
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      role: row.role,
      isActive: Boolean(row.is_active),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      profile: {
        gender: row.gender,
        occupation: row.occupation,
        institutionName: row.institution_name,
        emergencyContact: row.emergency_contact,
        bio: row.bio,
        city: row.city,
        avatarUrl: row.avatar_url,
      },
    };
  },

  /**
   * Create a new user with associated profile inside a database transaction
   */
  async create({ id, name, email, passwordHash, role, phone = null }) {
    const cleanEmail = email.trim().toLowerCase();
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Insert into users
      await connection.query(
        'INSERT INTO users (id, name, email, password_hash, phone, role, is_active) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [id, name.trim(), cleanEmail, passwordHash, phone, role, true]
      );

      // 2. Insert corresponding default profile
      await connection.query(
        'INSERT INTO profiles (user_id) VALUES (?)',
        [id]
      );

      await connection.commit();

      return {
        id,
        name: name.trim(),
        email: cleanEmail,
        phone,
        role,
        isActive: true,
      };
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },
};

module.exports = User;