const app = require('./app');
const config = require('./config/env');

const PORT = config.port;

// Start Server
const server = app.listen(PORT, () => {
  console.log('==================================================');
  console.log(`🚀 RoomVerse Backend API Server running on port ${PORT}`);
  console.log(`🌐 Base URL: http://localhost:${PORT}`);
  console.log(`🩺 Health Endpoint: http://localhost:${PORT}/api/health`);
  console.log(`⚙️  Environment: ${config.nodeEnv}`);
  console.log('==================================================');
});

// Graceful Shutdown
const handleGracefulShutdown = (signal) => {
  console.log(`\nReceived ${signal}. Gracefully terminating RoomVerse server...`);
  server.close(() => {
    console.log('HTTP server closed. Exiting process.');
    process.exit(0);
  });

  // Force close after timeout if hanging
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