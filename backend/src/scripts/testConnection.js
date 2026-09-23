const { pool, checkDatabaseConnection } = require('../config/db');

async function testDatabase() {
  console.log('==================================================');
  console.log('🔍 Testing RoomVerse MySQL Connection & Integrity...');
  console.log('==================================================');

  // 1. Connection & Health check
  const health = await checkDatabaseConnection();
  if (!health.connected) {
    console.error('❌ Connection check failed:', health.message);
    process.exit(1);
  }
  console.log(`✅ Connection Success: Connected to ${health.details.database} (${health.details.version}) at ${health.details.host}:${health.details.port}`);

  // 2. Relational Query Verification (Join Properties, Owners, and Rooms)
  try {
    const [properties] = await pool.query(`
      SELECT 
        p.id, 
        p.title, 
        p.city, 
        p.locality, 
        p.verification_status,
        u.name AS owner_name,
        u.email AS owner_email,
        COUNT(DISTINCT r.id) AS room_count,
        COUNT(DISTINCT pa.amenity_id) AS amenity_count
      FROM properties p
      JOIN users u ON p.owner_id = u.id
      LEFT JOIN rooms r ON p.id = r.property_id
      LEFT JOIN property_amenities pa ON p.id = pa.property_id
      GROUP BY p.id, u.name, u.email
      ORDER BY p.city, p.title
    `);

    console.log(`\n📋 Relational Query Test: Fetched ${properties.length} properties with owner and room aggregates:`);
    properties.forEach((p, idx) => {
      console.log(`  ${idx + 1}. [${p.verification_status.toUpperCase()}] ${p.title} (${p.city} - ${p.locality}) | Owner: ${p.owner_name} | Rooms: ${p.room_count} | Amenities: ${p.amenity_count}`);
    });

    // 3. Foreign Key Integrity Check (Try inserting invalid foreign key)
    try {
      await pool.query(`
        INSERT INTO rooms (id, property_id, room_number_name, room_type, monthly_rent)
        VALUES ('test-room-fail', 'non-existent-prop-id', 'Test 999', 'single', 5000.00)
      `);
      console.error('❌ Foreign key constraint test failed (invalid insert succeeded)');
      process.exit(1);
    } catch (fkError) {
      if (fkError.code === 'ER_NO_REFERENCED_ROW_2' || fkError.message.includes('foreign key constraint fails')) {
        console.log('\n🔒 Foreign Key Enforcement: VERIFIED (Child insertion without valid parent is correctly rejected)');
      } else {
        throw fkError;
      }
    }

    console.log('\n✨ All Database Tests Passed Successfully!\n');
    process.exit(0);
  } catch (err) {
    console.error('❌ Query execution error:', err);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testDatabase();