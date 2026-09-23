const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
const config = require('../config/env');

async function initializeDatabase() {
  console.log('==================================================');
  console.log('🔄 Initializing RoomVerse MySQL Database...');
  console.log(`Connecting to MySQL host: ${config.db.host}:${config.db.port} as user: ${config.db.user}`);
  console.log('==================================================');

  // Step 1: Connect to server without DB to ensure database exists
  let connection;
  try {
    connection = await mysql.createConnection({
      host: config.db.host,
      port: config.db.port,
      user: config.db.user,
      password: config.db.password,
      multipleStatements: true,
    });
    console.log('✅ Connected to MySQL server.');

    console.log(`Creating database "${config.db.name}" if not exists...`);
    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${config.db.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await connection.query(`USE \`${config.db.name}\`;`);
    console.log(`✅ Using database "${config.db.name}".`);

    // Step 2: Read and execute schema.sql
    const schemaPath = path.resolve(__dirname, '../../../database/schema.sql');
    console.log(`Executing schema DDL from: ${schemaPath}`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await connection.query(schemaSql);
    console.log('✅ Schema tables, constraints, and indexes created successfully.');

    // Step 3: Read and execute seed.sql
    const seedPath = path.resolve(__dirname, '../../../database/seed.sql');
    console.log(`Executing seed data from: ${seedPath}`);
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await connection.query(seedSql);
    console.log('✅ Seed dataset populated successfully.');

    // Step 4: Verify entity counts
    const tables = [
      'users',
      'profiles',
      'properties',
      'rooms',
      'amenities',
      'property_amenities',
      'property_images',
      'favorites',
      'bookings',
      'reviews',
      'property_views',
      'verification_logs',
    ];

    console.log('\n📊 Database Entity Verification Summary:');
    console.log('--------------------------------------------------');
    for (const table of tables) {
      const [rows] = await connection.query(`SELECT COUNT(*) AS count FROM \`${table}\``);
      console.log(`  Table [${table.padEnd(20)}] : ${rows[0].count} records`);
    }
    console.log('--------------------------------------------------');
    console.log('🎉 RoomVerse Database Setup & Verification Complete!\n');
  } catch (err) {
    console.error('❌ Database initialization error:', err.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

if (require.main === module) {
  initializeDatabase();
}

module.exports = initializeDatabase;