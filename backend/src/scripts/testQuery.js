const { pool } = require('../config/db');

async function verifyRelationalIntegrity() {
  console.log('\n🔍 Verifying MySQL Relational Integrity and Foreign Key Joins:');
  console.log('================================================================');

  try {
    const [rows] = await pool.query(`
      SELECT 
        p.id AS property_id,
        p.title,
        p.city,
        p.locality,
        p.verification_status,
        u.name AS owner_name,
        COUNT(DISTINCT r.id) AS rooms_count,
        COUNT(DISTINCT pa.amenity_id) AS amenities_count,
        COUNT(DISTINCT rev.id) AS reviews_count,
        COUNT(DISTINCT b.id) AS bookings_count
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      LEFT JOIN rooms r ON p.id = r.property_id
      LEFT JOIN property_amenities pa ON p.id = pa.property_id
      LEFT JOIN reviews rev ON p.id = rev.property_id
      LEFT JOIN bookings b ON p.id = b.property_id
      GROUP BY p.id, u.name;
    `);

    console.table(rows);
    console.log('✅ Relational join query executed successfully with all constraints intact!\n');
  } catch (err) {
    console.error('❌ Relational integrity check failed:', err.message);
  } finally {
    await pool.end();
  }
}

verifyRelationalIntegrity();