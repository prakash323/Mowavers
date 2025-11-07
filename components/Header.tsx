
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { LogoIcon, LogoutIcon, UserCircleIcon } from './icons';

const Header: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-brand-dark shadow-md p-4 flex justify-between items-center z-10">
      <div className="flex items-center space-x-2">
        <LogoIcon className="h-8 w-8 text-brand-primary" />
        <h1 className="text-xl font-bold text-brand-light">MOWAERS</h1>
      </div>
      {user && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <UserCircleIcon className="h-6 w-6 text-gray-400" />
            <span className="hidden sm:inline text-brand-text">{user.name}</span>
            <span className="text-xs text-gray-400 bg-brand-dark-accent px-2 py-1 rounded">{user.role}</span>
          </div>
          <button
            onClick={logout}
            className="p-2 rounded-full text-gray-400 hover:bg-brand-dark-accent hover:text-white transition-colors"
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
