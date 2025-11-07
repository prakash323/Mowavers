import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogoIcon, LogoutIcon, UserCircleIcon, SunIcon, MoonIcon } from './icons';
import { useTheme } from '../hooks/useTheme';
import { UserRole } from '../types';
import DeviceStatus from './patient/DeviceStatus';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="bg-brand-light dark:bg-brand-dark-accent shadow-md p-4 flex justify-between items-center z-10">
      <div className="flex items-center space-x-2">
        <LogoIcon className="h-8 w-8 text-brand-primary" />
        <h1 className="text-xl font-bold text-brand-text-light dark:text-brand-light">MOWAERS</h1>
      </div>
      {user && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <span className="hidden sm:inline text-brand-text-light dark:text-brand-text">{user.name}</span>
            <span className="text-xs text-gray-500 bg-brand-light-accent dark:bg-brand-dark px-2 py-1 rounded">{user.role}</span>
          </div>

          {user.role === UserRole.Patient && (
            <div className="hidden md:flex items-center border-l border-gray-200 dark:border-gray-700 pl-4">
                <DeviceStatus />
            </div>
          )}

          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-brand-dark hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
          </button>
          <button
            onClick={logout}
            className="p-2 rounded-full text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-brand-dark hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Logout"
          >
            <LogoutIcon className="h-6 w-6" />
          </button>
        </div>
      )}
    </header>
  );
};

export default Header;