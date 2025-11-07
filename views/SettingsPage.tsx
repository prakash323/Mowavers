import React from 'react';
import { useAuth } from '../hooks/useAuth';

const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="container mx-auto animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>
      <div className="bg-brand-dark-accent p-8 rounded-lg space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-brand-primary mb-2">Account Information</h3>
          <p className="text-gray-300">Name: {user?.name}</p>
          <p className="text-gray-300">Role: {user?.role}</p>
        </div>
        <div>
            <h3 className="text-xl font-semibold text-brand-primary mb-2">Notifications</h3>
            <p className="text-gray-300">This is a placeholder for notification settings.</p>
        </div>
        <div>
            <h3 className="text-xl font-semibold text-brand-primary mb-2">Theme</h3>
            <p className="text-gray-300">This is a placeholder for theme settings (e.g., light/dark mode).</p>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
