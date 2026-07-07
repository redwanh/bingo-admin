import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const TOKEN_REFRESH_BUFFER = 2 * 60 * 1000;
const REFRESH_COOLDOWN_MS = 30000;

const AuthContext = createContext(null);

// Only log in development
const devLog = (...args) => {
  if (process.env.NODE_ENV === 'development') {
    console.log(...args);
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  
  const refreshTimeoutRef = useRef(null);
  const idleTimeoutRef = useRef(null);
  const isRefreshingRef = useRef(false);
  const fetchingRef = useRef(false);
  const logoutRef = useRef(null);
  const refreshTokenRef = useRef(null);

  // Clear auth data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  // Logout
  const logout = useCallback(async () => {
    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (storedRefreshToken) {
        await axios.post(`${API_URL}/auth/logout`, { refreshToken: storedRefreshToken }).catch(() => {});
      }
    } catch (error) {
      // Silently fail
    }

    clearAuthData();
    setToken(null);
    setUser(null);
    setLoading(false);
    
    if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
    if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    
    if (window._authActivityListeners) {
      window._authActivityListeners.forEach(({ event, handler }) => {
        document.removeEventListener(event, handler);
      });
      window._authActivityListeners = null;
    }
  }, [clearAuthData]);

  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

  // Refresh token
  const refreshToken = useCallback(async () => {
    // Prevent refresh more than once every 30 seconds
    const lastRefresh = localStorage.getItem('lastRefreshTime');
    const now = Date.now();
    if (lastRefresh && (now - parseInt(lastRefresh)) < REFRESH_COOLDOWN_MS) {
      return localStorage.getItem('token');
    }
    
    if (isRefreshingRef.current) {
      return new Promise((resolve) => {
        const checkInterval = setInterval(() => {
          if (!isRefreshingRef.current) {
            clearInterval(checkInterval);
            resolve(localStorage.getItem('token'));
          }
        }, 100);
      });
    }

    isRefreshingRef.current = true;
    setIsRefreshing(true);
    localStorage.setItem('lastRefreshTime', now.toString());

    try {
      const storedRefreshToken = localStorage.getItem('refreshToken');
      if (!storedRefreshToken) throw new Error('No refresh token');

      const response = await axios.post(`${API_URL}/auth/refresh-token`, {
        refreshToken: storedRefreshToken
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      if (!accessToken) throw new Error('Invalid refresh response');

      localStorage.setItem('token', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setToken(accessToken);
      
      return accessToken;
    } catch (error) {
      throw error;
    } finally {
      isRefreshingRef.current = false;
      setIsRefreshing(false);
    }
  }, []);

  useEffect(() => {
    refreshTokenRef.current = refreshToken;
  }, [refreshToken]);

  // Schedule token refresh
  const scheduleTokenRefresh = useCallback((currentToken) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    try {
      const decoded = jwtDecode(currentToken);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
      const refreshTime = Math.max(timeUntilExpiry - TOKEN_REFRESH_BUFFER, 5000);
      
      if (refreshTime > 0) {
        refreshTimeoutRef.current = setTimeout(() => {
          refreshTokenRef.current().catch(() => {});
        }, refreshTime);
      } else {
        refreshTokenRef.current().catch(() => {});
      }
    } catch (error) {
      // Silently fail
    }
  }, []);

  // Idle timeout
  const resetIdleTimer = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    
    if (user && token) {
      idleTimeoutRef.current = setTimeout(() => {
        logout();
      }, IDLE_TIMEOUT_MS);
    }
  }, [user, token, logout]);

  const setupActivityListeners = useCallback(() => {
    if (window._authActivityListeners) {
      window._authActivityListeners.forEach(({ event, handler }) => {
        document.removeEventListener(event, handler);
      });
    }

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll'];
    const handlers = events.map(event => {
      const handler = () => resetIdleTimer();
      document.addEventListener(event, handler);
      return { event, handler };
    });

    window._authActivityListeners = handlers;
    resetIdleTimer();
    
    return () => {
      if (window._authActivityListeners) {
        window._authActivityListeners.forEach(({ event, handler }) => {
          document.removeEventListener(event, handler);
        });
        window._authActivityListeners = null;
      }
      if (idleTimeoutRef.current) {
        clearTimeout(idleTimeoutRef.current);
      }
    };
  }, [resetIdleTimer]);

  // Fetch user
  const fetchUser = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    
    try {
      const res = await axios.get(`${API_URL}/auth/me`);
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
      }
    } catch (error) {
      if (error.response?.status === 401) throw error;
    } finally {
      fetchingRef.current = false;
    }
  }, []);

  // Axios interceptors
  useEffect(() => {
    const requestInterceptor = axios.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem('token');
        if (currentToken) {
          config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = axios.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            const newToken = await refreshTokenRef.current();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              return axios(originalRequest);
            }
          } catch (refreshError) {
            if (logoutRef.current) {
              await logoutRef.current();
              window.location.href = '/login';
            }
            return Promise.reject(refreshError);
          }
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(requestInterceptor);
      axios.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  // Initialization
  useEffect(() => {
    const initAuth = async () => {
      const currentToken = localStorage.getItem('token');
      
      if (!currentToken) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(currentToken);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          try {
            await refreshTokenRef.current();
          } catch (refreshError) {
            setLoading(false);
            return;
          }
        } else {
          axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
          scheduleTokenRefresh(currentToken);
        }

        await fetchUser().catch(() => {});
        setupActivityListeners();
      } catch (error) {
        // Silently fail
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, []);

  // Login
  const login = useCallback(async (phone, password) => {
    const response = await axios.post(`${API_URL}/auth/login`, { phone, password });
    const { accessToken, refreshToken: newRefreshToken, user: userData } = response.data;
    
    if (!accessToken) throw new Error('No access token received');
    
    localStorage.setItem('token', accessToken);
    if (newRefreshToken) {
      localStorage.setItem('refreshToken', newRefreshToken);
    }
    
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
    setToken(accessToken);
    setUser(userData);
    
    scheduleTokenRefresh(accessToken);
    setupActivityListeners();
    
    return userData;
  }, [scheduleTokenRefresh, setupActivityListeners]);

  const value = {
    user,
    token,
    loading,
    isRefreshing,
    login,
    logout,
    refreshToken,
    isAuthenticated: !!user && !!token,
    isAdmin: user?.role === 'admin' || user?.role === 'superadmin',
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};