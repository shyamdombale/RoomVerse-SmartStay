const apiResponse = require('../utils/apiResponse');

const getHealthStatus = (req, res) => {
  const healthData = {
    service: 'RoomVerse Backend REST API',
    status: 'operational',
    timestamp: new Date().toISOString(),
    uptime: `${Math.floor(process.uptime())}s`,
    environment: process.env.NODE_ENV || 'development',
    version: '1.0.0',
  };

  return apiResponse.success(res, healthData, 'RoomVerse API is running smoothly', 200);
};

module.exports = {
  getHealthStatus,
};