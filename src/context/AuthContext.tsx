import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User } from '../types.js';
import { api } from '../services/api.js';
import { useToast } from './ToastContext.js';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, phone?: string) => Promise<void>;
  logout: () => void;
  updateProfile: (data: Partial<User>) => Promise<void>;
  loginDemo: (role: 'admin' | 'customer') => Promise<void>;
  authModalOpen: boolean;
  setAuthModalOpen: (open: boolean) => void;
  authModalMode: 'login' | 'register';
  setAuthModalMode: (mode: 'login' | 'register') => void;
  openAuthModal: (mode?: 'login' | 'register') => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('luxora_token'));
  const [loading, setLoading] = useState(true);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const { success, error: toastError } = useToast();

  const fetchUser = useCallback(async () => {
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const { user: fetchedUser } = await api.getMe();
      setUser(fetchedUser);
    } catch (err) {
      console.warn('Session expired or invalid token');
      localStorage.removeItem('luxora_token');
      setToken(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.login({ email, password });
      localStorage.setItem('luxora_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setAuthModalOpen(false);
      success(`Welcome back, ${res.user.name}`);
    } catch (err: any) {
      toastError(err.message || 'Login failed');
      throw err;
    }
  };

  const register = async (name: string, email: string, password: string, phone?: string) => {
    try {
      const res = await api.register({ name, email, password, phone });
      localStorage.setItem('luxora_token', res.token);
      setToken(res.token);
      setUser(res.user);
      setAuthModalOpen(false);
      success(`Welcome to LUXORA, ${res.user.name}`);
    } catch (err: any) {
      toastError(err.message || 'Registration failed');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('luxora_token');
    setToken(null);
    setUser(null);
    success('You have been signed out');
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const res = await api.updateProfile(data);
      setUser(res.user);
      success('Profile updated successfully');
    } catch (err: any) {
      toastError(err.message || 'Failed to update profile');
      throw err;
    }
  };

  const loginDemo = async (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      await login('admin@luxora.com', 'admin123');
    } else {
      await login('customer@luxora.com', 'customer123');
    }
  };

  const openAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const value = {
    user,
    token,
    loading,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    updateProfile,
    loginDemo,
    authModalOpen,
    setAuthModalOpen,
    authModalMode,
    setAuthModalMode,
    openAuthModal
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
