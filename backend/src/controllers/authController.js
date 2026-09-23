const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('../config/env');
const User = require('../models/User');
const apiResponse = require('../utils/apiResponse');
const {
  validateRegistrationInput,
  validateLoginInput,
  normalizeRole,
} = require('../utils/validators');

/**
 * Generate signed JSON Web Token
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.secret,
    {
      expiresIn: config.jwt.expiresIn,
    }
  );
}

/**
 * POST /api/auth/register
 * Public registration for Tenants and Property Owners
 */
async function register(req, res, next) {
  try {
    const { name, email, password, role, phone } = req.body;

    // 1. Input Validation
    const validation = validateRegistrationInput({ name, email, password, role });
    if (!validation.isValid) {
      return apiResponse.error(res, 'Validation failed: Please verify required fields', 400, validation.errors);
    }

    const normalizedRole = normalizeRole(role);

    // 2. Check for duplicate email
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return apiResponse.error(
        res,
        'An account with this email address already exists',
        409,
        [{ field: 'email', message: 'Email address is already registered' }]
      );
    }

    // 3. Hash Password securely with bcrypt
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);

    // 4. Create User Record in MySQL
    const userId = crypto.randomUUID();
    const newUser = await User.create({
      id: userId,
      name,
      email,
      passwordHash,
      role: normalizedRole,
      phone: phone ? phone.trim() : null,
    });

    // 5. Generate JWT Token
    const token = generateToken(newUser);

    const safeUserData = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
    };

    return apiResponse.success(
      res,
      { user: safeUserData, token },
      'Registration successful. Welcome to RoomVerse!',
      201
    );
  } catch (err) {
    next(err);
  }
}

/**
 * POST /api/auth/login
 * User login with credentials verification
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // 1. Input Validation
    const validation = validateLoginInput({ email, password });
    if (!validation.isValid) {
      return apiResponse.error(res, 'Validation failed: Email and password are required', 400, validation.errors);
    }

    // 2. Lookup User
    const user = await User.findByEmail(email);
    if (!user) {
      // Return generic 401 to prevent account enumeration
      return apiResponse.error(
        res,
        'Invalid email address or password',
        401,
        [{ field: 'credentials', message: 'Authentication credentials do not match our records' }]
      );
    }

    if (!user.is_active) {
      return apiResponse.error(
        res,
        'This account has been deactivated. Please contact support.',
        403,
        [{ field: 'account', message: 'Account suspended or inactive' }]
      );
    }

    // 3. Compare password with bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      return apiResponse.error(
        res,
        'Invalid email address or password',
        401,
        [{ field: 'credentials', message: 'Authentication credentials do not match our records' }]
      );
    }

    // 4. Generate JWT Token
    const token = generateToken(user);

    const safeUserData = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
    };

    return apiResponse.success(
      res,
      { user: safeUserData, token },
      'Authentication successful',
      200
    );
  } catch (err) {
    next(err);
  }
}

/**
 * GET /api/auth/me
 * Fetch current authenticated user session fresh from MySQL
 */
async function getMe(req, res, next) {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user || !user.isActive) {
      return apiResponse.error(
        res,
        'User account not found or has been deactivated',
        401,
        [{ field: 'auth', message: 'Active user record not found' }]
      );
    }

    return apiResponse.success(
      res,
      { user },
      'Current user profile retrieved successfully',
      200
    );
  } catch (err) {
    next(err);
  }
}

module.exports = {
  register,
  login,
  getMe,
};