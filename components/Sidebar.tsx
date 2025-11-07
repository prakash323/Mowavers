
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { DashboardIcon, SettingsIcon, HelpIcon, PrivacyIcon, TermsIcon, LogoIcon } from './icons';

const Sidebar: React.FC = () => {
  const { view, setView } = useAuth();

  const navItems = [
    { name: 'Dashboard', icon: DashboardIcon, view: 'dashboard' as const },
    { name: 'Settings', icon: SettingsIcon, view: 'settings' as const },
    { name: 'Help/Docs', icon: HelpIcon, view: 'help' as const },
    { name: 'Privacy Policy', icon: PrivacyIcon, view: 'privacy' as const },
    { name: 'Terms of Service', icon: TermsIcon, view: 'terms' as const },
  ];

  return (
    <aside className="w-16 md:w-64 bg-brand-dark p-2 md:p-4 flex flex-col justify-between transition-all duration-300">
        <div>
            <nav className="mt-4">
                <ul>
                {navItems.map(item => (
                    <li key={item.name} className="mb-2">
                    <button
                        onClick={() => setView(item.view)}
                        className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                        view === item.view 
                            ? 'bg-brand-primary text-white' 
                            : 'text-gray-400 hover:bg-brand-dark-accent hover:text-white'
                        }`}
                    >
                        <item.icon className="h-6 w-6" />
                        <span className="ml-4 hidden md:inline">{item.name}</span>
                    </button>
                    </li>
                ))}
                </ul>
            </nav>
        </div>
        <div className="pb-4 flex items-center justify-center md:justify-start">
             <div className="flex items-center space-x-2 text-gray-500">
                <LogoIcon className="h-6 w-6" />
                <span className="hidden md:inline text-xs">MOWAERS v1.0</span>
            </div>
        </div>
    </aside>
  );
};

export default Sidebar;
