const app = require('./app');
const config = require('./config/env');
const { checkDatabaseConnection } = require('./config/db');

const PORT = config.port;

// Start Server and verify DB connection
const server = app.listen(PORT, async () => {
  console.log('==================================================');
  console.log(`🚀 RoomVerse Backend API Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`🩺 Health Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`⚙️  Environment: ${config.nodeEnv}`);

  // Test MySQL Connection on Startup
  const dbCheck = await checkDatabaseConnection();
  if (dbCheck.connected) {
    console.log(`🗄️  Database: MySQL 8.0 Connected (${dbCheck.details.database} on ${dbCheck.details.host}:${dbCheck.details.port})`);
  } else {
    console.warn(`⚠️  Database Warning: ${dbCheck.message}`);
  }
  console.log('==================================================');
});

// Graceful Shutdown
const handleGracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Gracefully terminating RoomVerse server...`);
  server.close(() => {
    console.log('HTTP server closed. Exiting process.');
    process.exit(0);
  });

  setTimeout(() => {
    console.error('Forcefully terminating process after timeout.');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => handleGracefulShutdown('SIGTERM'));
process.on('SIGINT', () => handleGracefulShutdown('SIGINT'));

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught Exception:', err);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[FATAL] Unhandled Rejection at:', promise, 'reason:', reason);
});