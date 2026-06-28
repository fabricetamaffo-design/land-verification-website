import React, { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';
import type { User } from '../shared';
import { authApi, setApiToken } from '../services/api';

const TOKEN_KEY = 'lv_mobile_token';
const USER_KEY = 'lv_mobile_user';

const storage = {
  async getItem(key: string) {
    if (Platform.OS === 'web') return globalThis.localStorage?.getItem(key) || null;
    return SecureStore.getItemAsync(key);
  },
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },
  async deleteItem(key: string) {
    if (Platform.OS === 'web') {
      globalThis.localStorage?.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  },
};

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: { name: string; email: string; password: string }) => Promise<string>;
  logout: () => Promise<void>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function hydrate() {
      try {
        const [storedToken, storedUser] = await Promise.all([
          storage.getItem(TOKEN_KEY),
          storage.getItem(USER_KEY),
        ]);
        if (storedToken && storedUser) {
          const parsed = JSON.parse(storedUser) as User;
          setToken(storedToken);
          setUser(parsed);
          setApiToken(storedToken);
        }
      } catch {
        await Promise.all([
          storage.deleteItem(TOKEN_KEY),
          storage.deleteItem(USER_KEY),
        ]);
        setToken(null);
        setUser(null);
        setApiToken(null);
      } finally {
        setLoading(false);
      }
    }
    hydrate();
  }, []);

  const value = useMemo<AuthContextValue>(() => ({
    user,
    token,
    loading,
    isAuthenticated: !!token,
    isAdmin: user?.role === 'ADMIN',
    login: async (email, password) => {
      const result = await authApi.login({ email, password });
      await storage.setItem(TOKEN_KEY, result.token);
      await storage.setItem(USER_KEY, JSON.stringify(result.user));
      setToken(result.token);
      setUser(result.user);
      setApiToken(result.token);
      return result.user;
    },
    register: async (data) => {
      const result = await authApi.register(data);
      return result.message;
    },
    logout: async () => {
      await storage.deleteItem(TOKEN_KEY);
      await storage.deleteItem(USER_KEY);
      setToken(null);
      setUser(null);
      setApiToken(null);
    },
    changePassword: async (currentPassword, newPassword) => {
      const result = await authApi.changePassword(currentPassword, newPassword);
      return result.message;
    },
  }), [loading, token, user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
}
