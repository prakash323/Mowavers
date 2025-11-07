
import React, { createContext, useState, useContext, ReactNode, useCallback } from 'react';
import { User, UserRole, Alert } from '../types';
import { MOCK_USERS, MOCK_ALERTS } from '../constants';

type View = 'landing' | 'login' | 'signup' | 'dashboard' | 'settings' | 'help' | 'privacy' | 'terms';

interface AuthContextType {
  user: User | null;
  view: View;
  alerts: Alert[];
  login: (role: UserRole) => void;
  logout: () => void;
  setView: (view: View) => void;
  addAlert: (alert: Alert) => void;
  acknowledgeAlert: (alertId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('landing');
  const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);

  const login = useCallback((role: UserRole) => {
    const mockUser = MOCK_USERS[role];
    setUser(mockUser);
    setView('dashboard');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setView('landing');
  }, []);

  const addAlert = useCallback((newAlert: Alert) => {
    setAlerts(prevAlerts => [newAlert, ...prevAlerts]);
  }, []);

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts(prevAlerts => prevAlerts.map(alert => alert.id === alertId ? { ...alert, acknowledged: true } : alert));
  }, []);

  const value = { user, view, alerts, login, logout, setView, addAlert, acknowledgeAlert };

// FIX: Corrected typo from `Auth.Provider` to `AuthContext.Provider`.
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};