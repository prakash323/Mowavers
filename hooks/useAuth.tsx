
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, Alert } from '../types';
import { MOCK_TIMELINE } from '../constants';

type View = 'landing' | 'login' | 'signup' | 'dashboard' | 'settings' | 'help' | 'privacy' | 'terms';

interface AuthContextType {
  user: User | null;
  view: View;
  alerts: Alert[];
  login: (role: UserRole) => void;
  logout: () => void;
  setView: (view: View) => void;
  acknowledgeAlert: (alertId: string) => void;
  addAlert: (alert: Alert) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<UserRole, User> = {
  [UserRole.Patient]: { id: 'patient-1', name: 'John Doe', role: UserRole.Patient },
  [UserRole.Caretaker]: { id: 'caretaker-1', name: 'Sarah Connor', role: UserRole.Caretaker },
  [UserRole.Doctor]: { id: 'doctor-1', name: 'Dr. Evans', role: UserRole.Doctor },
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [view, setView] = useState<View>('landing');
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    // Initialize alerts from mock data
    const initialAlerts = Object.values(MOCK_TIMELINE)
        .flat()
        .filter(event => event.eventType === 'alert') as Alert[];
    setAlerts(initialAlerts.sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()));
  }, []);

  const login = (role: UserRole) => {
    const mockUser = mockUsers[role];
    // In a real app, you would fetch user data after authentication
    setUser(mockUser);
    setView('dashboard');
  };

  const logout = () => {
    setUser(null);
    setView('landing');
  };
  
  const acknowledgeAlert = (alertId: string) => {
    setAlerts(prevAlerts => 
      prevAlerts.map(alert => 
        alert.id === alertId ? { ...alert, acknowledged: true } : alert
      )
    );
  };

  const addAlert = (alert: Alert) => {
    setAlerts(prevAlerts => [alert, ...prevAlerts]);
  }

  const value = { user, view, alerts, login, logout, setView, acknowledgeAlert, addAlert };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
