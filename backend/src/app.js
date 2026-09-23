const express = require('express');
const cors = require('cors');
const config = require('./config/env');
const logger = require('./middleware/logger');
const notFoundHandler = require('./middleware/notFoundHandler');
const errorHandler = require('./middleware/errorHandler');

// Route Imports
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const propertyRoutes = require('./routes/propertyRoutes');
const roomRoutes = require('./routes/roomRoutes');
const amenityRoutes = require('./routes/amenityRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Standard Middleware
app.use(cors({
  origin: config.clientUrl || '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logging
app.use(logger);

// Root Index Endpoint
app.get('/', (req, res) => {
  res.json({
    name: 'RoomVerse API Gateway',
    version: '1.0.0',
    description: 'Smart Rental, PG & Accommodation Platform for Students & Professionals',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      properties: '/api/properties',
      rooms: '/api/rooms',
      amenities: '/api/amenities',
      admin: '/api/admin',
    },
  });
});

// Mount Routes
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/rooms', roomRoutes);
app.use('/api/amenities', amenityRoutes);
app.use('/api/admin', adminRoutes);

// 404 Handler for Unmatched API Routes
app.use(notFoundHandler);

// Centralized Error Handler
app.use(errorHandler);

module.exports = app;