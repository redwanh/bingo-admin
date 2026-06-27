import React, { createContext, useState, useContext, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';
const IDLE_TIMEOUT_MS = 15 * 60 * 1000;
const TOKEN_REFRESH_BUFFER = 2 * 60 * 1000;

const AuthContext = createContext(null);

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

  // ============================================
  // 1. CORE AUTH FUNCTIONS
  // ============================================

  const clearAuthData = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    delete axios.defaults.headers.common['Authorization'];
  }, []);

  const logout = useCallback(async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (refreshToken) {
        await axios.post(`${API_URL}/auth/logout`, { refreshToken });
      }
    } catch (error) {
      console.log('Logout error:', error.message);
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

  // Store logout reference for use in other functions
  useEffect(() => {
    logoutRef.current = logout;
  }, [logout]);

  // ============================================
  // 2. TOKEN REFRESH WITH BETTER ERROR HANDLING
  // ============================================

  const refreshToken = useCallback(async () => {
    // Prevent multiple concurrent refresh requests
    if (isRefreshingRef.current) {
      console.log('⏳ Refresh already in progress, waiting...');
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

    try {
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        console.log('⚠️ No refresh token found');
        throw new Error('No refresh token');
      }

      console.log('🔄 Attempting token refresh...');
      const response = await axios.post(`${API_URL}/auth/refresh-token`, {
        refreshToken
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;
      
      if (!accessToken) {
        console.log('⚠️ No access token in refresh response');
        throw new Error('Invalid refresh response');
      }

      // Update tokens
      localStorage.setItem('token', accessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setToken(accessToken);
      
      // Schedule next refresh
      scheduleTokenRefresh(accessToken);
      
      console.log('✅ Token refreshed successfully');
      return accessToken;
    } catch (error) {
      console.error('❌ Token refresh failed:', error);
      
      // Don't logout immediately on refresh failure
      // Let the interceptor handle it
      throw error;
    } finally {
      isRefreshingRef.current = false;
      setIsRefreshing(false);
    }
  }, []);

  // ============================================
  // 3. TOKEN SCHEDULING
  // ============================================

  const scheduleTokenRefresh = useCallback((currentToken) => {
    if (refreshTimeoutRef.current) {
      clearTimeout(refreshTimeoutRef.current);
    }

    try {
      const decoded = jwtDecode(currentToken);
      const currentTime = Date.now() / 1000;
      const timeUntilExpiry = (decoded.exp - currentTime) * 1000;
      
      // Refresh 2 minutes before expiry
      const refreshTime = Math.max(timeUntilExpiry - TOKEN_REFRESH_BUFFER, 5000);
      
      console.log(`⏰ Token expires in ${Math.round(timeUntilExpiry / 60000)} minutes, refreshing in ${Math.round(refreshTime / 60000)} minutes`);
      
      if (refreshTime > 0) {
        refreshTimeoutRef.current = setTimeout(() => {
          refreshToken().catch(err => {
            console.warn('⚠️ Background refresh failed:', err.message);
            // Don't logout on background refresh failure
          });
        }, refreshTime);
      } else {
        // Token already expired or about to expire
        refreshToken().catch(err => {
          console.warn('⚠️ Immediate refresh failed:', err.message);
        });
      }
    } catch (error) {
      console.error('Failed to decode token:', error);
    }
  }, [refreshToken]);

  // ============================================
  // 4. IDLE TIMEOUT
  // ============================================

  const resetIdleTimer = useCallback(() => {
    if (idleTimeoutRef.current) {
      clearTimeout(idleTimeoutRef.current);
    }
    
    if (user && token) {
      idleTimeoutRef.current = setTimeout(() => {
        console.log('⏰ Session expired due to inactivity');
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

    const events = ['mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
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

  // ============================================
  // 5. FETCH USER
  // ============================================

  const fetchUser = useCallback(async () => {
    if (user) {
      return user;
    }
    
    if (fetchingRef.current) {
      return;
    }
    
    fetchingRef.current = true;
    
    try {
      console.log('📡 Fetching user data...');
      const res = await axios.get(`${API_URL}/auth/me`);
      if (res.data.success && res.data.user) {
        setUser(res.data.user);
        console.log('✅ User data loaded');
        return res.data.user;
      }
      throw new Error('Invalid user data');
    } catch (error) {
      console.error('Failed to fetch user:', error);
      if (error.response?.status === 401) {
        // Don't logout immediately, let the interceptor handle it
        console.warn('⚠️ 401 on user fetch, will retry with refreshed token');
        throw error;
      }
      throw error;
    } finally {
      fetchingRef.current = false;
    }
  }, [user]);

  // ============================================
  // 6. AXIOS INTERCEPTORS (IMPROVED)
  // ============================================

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
        
        // Skip refresh for auth endpoints
        const skipRefresh = [
          '/auth/refresh-token',
          '/auth/login',
          '/auth/logout',
          '/auth/me'
        ];
        
        if (skipRefresh.some(url => originalRequest.url?.includes(url))) {
          // For /auth/me failure, try to refresh silently
          if (originalRequest.url?.includes('/auth/me') && 
              error.response?.status === 401 && 
              !originalRequest._retry) {
            originalRequest._retry = true;
            try {
              const newToken = await refreshToken();
              if (newToken) {
                originalRequest.headers.Authorization = `Bearer ${newToken}`;
                return axios(originalRequest);
              }
            } catch (refreshError) {
              // If refresh fails, logout
              if (logoutRef.current) {
                await logoutRef.current();
                window.location.href = '/login';
              }
              return Promise.reject(refreshError);
            }
          }
          return Promise.reject(error);
        }

        // Handle 401 with retry
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          
          try {
            console.log('🔄 Interceptor: Attempting token refresh...');
            const newToken = await refreshToken();
            if (newToken) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
              console.log('✅ Interceptor: Retrying original request with new token');
              return axios(originalRequest);
            }
          } catch (refreshError) {
            console.error('❌ Interceptor: Refresh failed, logging out');
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
  }, [refreshToken]);

  // ============================================
  // 7. INITIALIZATION
  // ============================================

  useEffect(() => {
    const initAuth = async () => {
      const currentToken = localStorage.getItem('token');
      
      console.log('🔍 Initializing auth...');
      console.log('📌 Token exists:', !!currentToken);
      
      if (!currentToken) {
        setLoading(false);
        return;
      }

      try {
        const decoded = jwtDecode(currentToken);
        const currentTime = Date.now() / 1000;
        
        if (decoded.exp < currentTime) {
          console.log('⏰ Token expired on init, attempting refresh...');
          try {
            const newToken = await refreshToken();
            if (!newToken) {
              console.log('⚠️ Refresh failed on init, clearing auth');
              setLoading(false);
              return;
            }
          } catch (refreshError) {
            console.warn('⚠️ Refresh failed, but keeping session alive');
            // Don't logout on init refresh failure
            // The user might have a valid refresh token
          }
        } else {
          console.log('✅ Token valid on init');
          axios.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
          scheduleTokenRefresh(currentToken);
        }

        // Try to fetch user, but don't fail if it doesn't work
        try {
          await fetchUser();
        } catch (fetchError) {
          console.warn('⚠️ Could not fetch user on init');
        }
        
        setupActivityListeners();
      } catch (error) {
        console.error('Auth initialization failed:', error);
        // Don't logout on init errors
      } finally {
        setLoading(false);
      }
    };

    initAuth();

    return () => {
      if (refreshTimeoutRef.current) clearTimeout(refreshTimeoutRef.current);
      if (idleTimeoutRef.current) clearTimeout(idleTimeoutRef.current);
    };
  }, [fetchUser, refreshToken, scheduleTokenRefresh, setupActivityListeners]);

  // ============================================
  // 8. LOGIN
  // ============================================

  const login = useCallback(async (phone, password) => {
    try {
      console.log('📡 Attempting login...');
      const response = await axios.post(`${API_URL}/auth/login`, { phone, password });
      const { accessToken, refreshToken, user: userData } = response.data;
      
      if (!accessToken) {
        throw new Error('No access token received');
      }
      
      localStorage.setItem('token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      
      axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      setToken(accessToken);
      setUser(userData);
      
      scheduleTokenRefresh(accessToken);
      setupActivityListeners();
      
      console.log('✅ Login successful');
      return userData;
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    }
  }, [scheduleTokenRefresh, setupActivityListeners]);

  // ============================================
  // 9. CONTEXT VALUE
  // ============================================

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