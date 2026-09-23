const mysql = require('mysql2/promise');
const config = require('./env');

// Create MySQL Connection Pool
const pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

/**
 * Perform a database connectivity health check
 * @returns {Promise<{connected: boolean, message: string, details?: object}>}
 */
async function checkDatabaseConnection() {
  try {
    const connection = await pool.getConnection();
    const [rows] = await connection.query('SELECT VERSION() AS mysql_version, DATABASE() AS current_db');
    connection.release();

    return {
      connected: true,
      message: 'Successfully connected to MySQL database engine',
      details: {
        host: config.db.host,
        port: config.db.port,
        database: rows[0].current_db,
        version: rows[0].mysql_version,
      },
    };
  } catch (err) {
    return {
      connected: false,
      message: `Failed to connect to MySQL: ${err.message}`,
      error: err.code || err.message,
    };
  }
}

module.exports = {
  pool,
  checkDatabaseConnection,
};