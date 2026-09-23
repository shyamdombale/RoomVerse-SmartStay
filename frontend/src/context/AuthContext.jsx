import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authService.getCachedUser());
  const [token, setToken] = useState(authService.getToken());
  const [isLoading, setIsLoading] = useState(true);

  // Verify session with backend on initial load
  useEffect(() => {
    async function verifySession() {
      const storedToken = authService.getToken();
      if (!storedToken) {
        setIsLoading(false);
        return;
      }

      try {
        const freshUser = await authService.getMe();
        if (freshUser) {
          setUser(freshUser);
          localStorage.setItem('roomverse_user', JSON.stringify(freshUser));
        } else {
          authService.logout();
          setUser(null);
          setToken(null);
        }
      } catch (err) {
        console.warn('[RoomVerse Auth] Session validation failed:', err.message);
        authService.logout();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    }

    verifySession();
  }, []);

  const login = useCallback(async (email, password) => {
    const data = await authService.login(email, password);
    setUser(data.user);
    setToken(data.token);
    return data;
  }, []);

  const register = useCallback(async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    setToken(data.token);
    return data;
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setUser(null);
    setToken(null);
  }, []);

  const hasRole = useCallback((...allowedRoles) => {
    if (!user || !user.role) return false;
    const userRole = user.role.toLowerCase();
    const normalizedUserRoles = [userRole];
    if (userRole === 'customer') normalizedUserRoles.push('tenant');
    if (userRole === 'tenant') normalizedUserRoles.push('customer');

    const normalizedAllowed = allowedRoles.flatMap(r => {
      const lower = r.toLowerCase();
      if (lower === 'tenant') return ['tenant', 'customer'];
      if (lower === 'customer') return ['customer', 'tenant'];
      return [lower];
    });

    return normalizedUserRoles.some(r => normalizedAllowed.includes(r));
  }, [user]);

  const value = {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    isLoading,
    login,
    register,
    logout,
    hasRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}