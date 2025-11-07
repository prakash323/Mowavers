
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { USERS } from '../constants';

type View = 'landing' | 'login' | 'dashboard' | 'settings' | 'help' | 'privacy' | 'terms';

interface AuthContextType {
  user: User | null;
  view: View;
  login: (role: UserRole) => void;
  logout: () => void;
  setView: (view: View) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('landing');

  const login = (role: UserRole) => {
    const mockUser = USERS.find(u => u.role === role);
    if (mockUser) {
      setUser(mockUser);
      setView('dashboard');
    }
  };

  const logout = () => {
    setUser(null);
    setView('landing');
  };

  return (
    <AuthContext.Provider value={{ user, view, login, logout, setView }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
