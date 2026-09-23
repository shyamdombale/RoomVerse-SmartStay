const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const config = {
  port: parseInt(process.env.PORT, 10) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  clientUrl: process.env.CLIENT_URL || 'http://localhost:3000',
  isProduction: process.env.NODE_ENV === 'production',

  // Database settings (to be connected in Phase 4)
  db: {
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT, 10) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    name: process.env.DB_NAME || 'roomverse_db',
  },

  // JWT settings (to be used in Phase 5)
  jwt: {
    secret: process.env.JWT_SECRET || 'dev_secret_key_change_in_prod',
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
};

module.exports = config;