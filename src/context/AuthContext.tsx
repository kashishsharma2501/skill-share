import React, { createContext, useContext, useState, useCallback } from 'react';
import type { AuthUser, UserRole } from '@/types';
import { mockAuthUser } from '@/data/mockUsers';

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, _password: string, role?: UserRole) => Promise<void>;
  logout: () => void;
  switchRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  const login = useCallback(async (email: string, _password: string, role: UserRole = 'learner') => {
    // Mock login — replace with real API call later
    await new Promise((resolve) => setTimeout(resolve, 800));
    setUser({
      ...mockAuthUser,
      email,
      role,
      isAuthenticated: true,
    });
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUser((prev) => prev ? { ...prev, role } : null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
