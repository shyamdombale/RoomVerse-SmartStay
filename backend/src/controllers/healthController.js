const apiResponse = require('../utils/apiResponse');
const { checkDatabaseConnection } = require('../config/db');

const getHealthStatus = async (req, res) => {
  const dbHealth = await checkDatabaseConnection();

  const healthData = {
    service: 'RoomVerse Backend REST API',
    status: 'operational',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
    database: {
      connected: dbHealth.connected,
      engine: 'MySQL 8.0',
      name: dbHealth.details?.database || 'roomverse_db',
      status: dbHealth.connected ? 'online' : 'offline',
      version: dbHealth.details?.version || null,
    },
  };

  const statusCode = dbHealth.connected ? 200 : 503;
  const message = dbHealth.connected
    ? 'RoomVerse API and MySQL database are operational'
    : 'RoomVerse API is running but database is unreachable';

  return apiResponse.success(res, healthData, message, statusCode);
};

module.exports = {
  getHealthStatus,
};