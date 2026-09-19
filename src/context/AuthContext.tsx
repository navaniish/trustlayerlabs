import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { apiClient, setAccessToken, getAccessToken } from '../services/apiClient';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'SUPER_ADMIN' | 'ADMIN' | 'SALES' | 'FINANCE' | 'STAFF' | 'CLIENT';
  mfa_enabled?: boolean;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  accessToken: string | null;
  login: (email: string, pass: string, totpCode?: string) => Promise<void>;
  register: (fullName: string, email: string, pass: string, role?: string) => Promise<void>;
  logout: () => Promise<void>;
  logoutAll: () => Promise<void>;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: string[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setLocalAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const updateToken = (token: string | null) => {
    setAccessToken(token);
    setLocalAccessToken(token);
  };

  // Check existing session via HttpOnly Refresh Cookie on app boot
  const initAuth = useCallback(async () => {
    setIsLoading(true);
    const hasSession =
      document.cookie.includes('trustlayer_refresh_token') ||
      sessionStorage.getItem('trustlayer_active_session') === 'true';

    if (!hasSession) {
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await apiClient.post('/api/v1/auth/refresh');
      updateToken(data.access_token);
      setUser(data.user);
    } catch (e) {
      updateToken(null);
      setUser(null);
      sessionStorage.removeItem('trustlayer_active_session');
      window.dispatchEvent(new CustomEvent('trustlayer:auth_expired'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    initAuth();

    const handleAuthExpired = () => {
      updateToken(null);
      setUser(null);
    };

    window.addEventListener('trustlayer:auth_expired', handleAuthExpired);
    return () => window.removeEventListener('trustlayer:auth_expired', handleAuthExpired);
  }, [initAuth]);

  const login = async (email: string, pass: string, totpCode?: string) => {
    sessionStorage.setItem('trustlayer_active_session', 'true');
    const { data } = await apiClient.post('/api/v1/auth/login', {
      email,
      password: pass,
      totp_code: totpCode,
    });
    updateToken(data.access_token);
    setUser(data.user);
  };

  const register = async (fullName: string, email: string, pass: string, role: string = 'STAFF') => {
    sessionStorage.setItem('trustlayer_active_session', 'true');
    const { data } = await apiClient.post('/api/v1/auth/register', {
      full_name: fullName,
      email,
      password: pass,
      role,
    });
    updateToken(data.access_token);
    setUser(data.user);
  };

  const logout = async () => {
    sessionStorage.removeItem('trustlayer_active_session');
    try {
      await apiClient.post('/api/v1/auth/logout');
    } catch (e) {
      // Ignore logout errors
    } finally {
      updateToken(null);
      setUser(null);
    }
  };

  const logoutAll = async () => {
    sessionStorage.removeItem('trustlayer_active_session');
    try {
      await apiClient.post('/api/v1/auth/logout-all');
    } finally {
      updateToken(null);
      setUser(null);
    }
  };

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role === 'SUPER_ADMIN') return true;

    const rolePermissions: Record<string, string[]> = {
      ADMIN: [
        'quotation:create', 'quotation:read', 'quotation:update', 'quotation:delete',
        'invoice:create', 'invoice:read', 'invoice:update', 'invoice:delete',
        'client:create', 'client:read', 'client:update', 'client:delete',
        'user:read', 'settings:update', 'audit:read'
      ],
      SALES: [
        'quotation:create', 'quotation:read', 'quotation:update',
        'client:create', 'client:read', 'client:update', 'invoice:read'
      ],
      FINANCE: [
        'invoice:create', 'invoice:read', 'invoice:update', 'invoice:delete',
        'quotation:read', 'client:read', 'audit:read'
      ],
      STAFF: ['quotation:read', 'invoice:read', 'client:read'],
      CLIENT: ['quotation:read', 'invoice:read'],
    };

    const userPerms = rolePermissions[user.role] || [];
    return userPerms.includes(permission);
  };

  const hasRole = (roles: string[]): boolean => {
    if (!user) return false;
    return roles.map(r => r.toUpperCase()).includes(user.role.toUpperCase());
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        accessToken,
        login,
        register,
        logout,
        logoutAll,
        hasPermission,
        hasRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
