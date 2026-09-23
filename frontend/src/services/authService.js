import api from './api';

const authService = {
  /**
   * Register a new tenant or owner account
   */
  async register(userData) {
    const res = await api.post('/auth/register', userData);
    if (res.data?.token) {
      localStorage.setItem('roomverse_token', res.data.token);
      localStorage.setItem('roomverse_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  /**
   * Log in user with email & password
   */
  async login(email, password) {
    const res = await api.post('/auth/login', { email, password });
    if (res.data?.token) {
      localStorage.setItem('roomverse_token', res.data.token);
      localStorage.setItem('roomverse_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  /**
   * Fetch current authenticated user session from database
   */
  async getMe() {
    const res = await api.get('/auth/me');
    return res.data?.user || null;
  },

  /**
   * Clear local session storage
   */
  logout() {
    localStorage.removeItem('roomverse_token');
    localStorage.removeItem('roomverse_user');
  },

  /**
   * Get cached token
   */
  getToken() {
    return localStorage.getItem('roomverse_token');
  },

  /**
   * Get cached user info
   */
  getCachedUser() {
    try {
      const stored = localStorage.getItem('roomverse_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
};

export default authService;