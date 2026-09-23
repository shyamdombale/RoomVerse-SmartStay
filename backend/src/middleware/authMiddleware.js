const jwt = require('jsonwebtoken');
const config = require('../config/env');
const apiResponse = require('../utils/apiResponse');

/**
 * Reusable JWT Authentication Middleware
 * Reads and verifies Bearer token from Authorization header
 */
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return apiResponse.error(
      res,
      'Authentication token is required to access this resource',
      401,
      [{ field: 'authorization', message: 'Missing or malformed Authorization header (format: Bearer <token>)' }]
    );
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return apiResponse.error(
        res,
        'Authentication token has expired. Please log in again.',
        401,
        [{ field: 'token', message: 'Token expired at ' + err.expiredAt }]
      );
    }

    return apiResponse.error(
      res,
      'Invalid authentication token.',
      401,
      [{ field: 'token', message: 'Token verification failed: ' + err.message }]
    );
  }
}

/**
 * Reusable Role-Based Access Control (RBAC) Middleware
 * Normalizes 'tenant' and 'customer' interchangeably to respect existing database terminology
 * @param {...string} allowedRoles - List of authorized roles (e.g. 'tenant', 'owner', 'admin')
 */
function requireRole(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return apiResponse.error(
        res,
        'Access denied: User authentication required before role evaluation',
        401,
        [{ field: 'auth', message: 'Unauthenticated context' }]
      );
    }

    const userRole = req.user.role.toLowerCase();

    // Map 'tenant' <-> 'customer'
    const normalizedUserRoles = [userRole];
    if (userRole === 'customer') normalizedUserRoles.push('tenant');
    if (userRole === 'tenant') normalizedUserRoles.push('customer');

    const normalizedAllowedRoles = allowedRoles.flatMap(r => {
      const lower = r.toLowerCase();
      if (lower === 'tenant') return ['tenant', 'customer'];
      if (lower === 'customer') return ['customer', 'tenant'];
      return [lower];
    });

    const hasPermission = normalizedUserRoles.some(r => normalizedAllowedRoles.includes(r));

    if (!hasPermission) {
      return apiResponse.error(
        res,
        'Access forbidden: Insufficient permissions for this resource',
        403,
        [{
          field: 'role',
          message: `Your account role (${userRole}) is not permitted. Required role: ${allowedRoles.join(' or ')}`,
        }]
      );
    }

    next();
  };
}

module.exports = {
  authenticateJWT,
  requireRole,
};