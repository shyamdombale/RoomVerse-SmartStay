/**
 * RoomVerse Input Validators for Authentication & RBAC
 */

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email) {
  if (typeof email !== 'string') return false;
  return EMAIL_REGEX.test(email.trim().toLowerCase());
}

function isStrongPassword(password) {
  if (typeof password !== 'string') return false;
  // Reasonable academic/portfolio password rule: minimum 6 characters
  return password.length >= 6;
}

/**
 * Normalizes input role to database enum ('customer', 'owner', 'admin')
 * Maps 'tenant' -> 'customer' for seamless compatibility
 */
function normalizeRole(role) {
  if (!role || typeof role !== 'string') return null;
  const lower = role.trim().toLowerCase();
  if (lower === 'tenant' || lower === 'customer') return 'customer';
  if (lower === 'owner') return 'owner';
  if (lower === 'admin') return 'admin';
  return null;
}

function validateRegistrationInput({ name, email, password, role }) {
  const errors = [];

  if (!name || typeof name !== 'string' || name.trim().length < 2) {
    errors.push({ field: 'name', message: 'Full name is required (minimum 2 characters)' });
  }

  if (!email || !isValidEmail(email)) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }

  if (!password || !isStrongPassword(password)) {
    errors.push({ field: 'password', message: 'Password must be at least 6 characters long' });
  }

  if (!role) {
    errors.push({ field: 'role', message: 'User role is required (tenant or owner)' });
  } else {
    const rawRole = role.trim().toLowerCase();
    if (rawRole === 'admin') {
      errors.push({ field: 'role', message: 'Public registration for administrator accounts is strictly prohibited' });
    } else if (rawRole !== 'tenant' && rawRole !== 'customer' && rawRole !== 'owner') {
      errors.push({ field: 'role', message: 'Invalid role. Only "tenant" or "owner" can be publicly registered' });
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

function validateLoginInput({ email, password }) {
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push({ field: 'email', message: 'A valid email address is required' });
  }

  if (!password || typeof password !== 'string' || password.length === 0) {
    errors.push({ field: 'password', message: 'Password is required' });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

module.exports = {
  isValidEmail,
  isStrongPassword,
  normalizeRole,
  validateRegistrationInput,
  validateLoginInput,
};