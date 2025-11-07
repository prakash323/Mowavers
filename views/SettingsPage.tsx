
import React from 'react';

const SettingsPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Settings</h2>
      <div className="bg-brand-dark-accent p-8 rounded-lg">
        <p className="text-gray-300">This is a placeholder for user settings. Future versions will include options for notification preferences, data management, and profile updates.</p>
        <div className="mt-6 space-y-4">
            <div>
                <label className="block text-gray-400 mb-2" htmlFor="name">Full Name</label>
                <input id="name" type="text" value="Demo User" disabled className="w-full bg-brand-dark border border-gray-600 rounded-md p-2" />
            </div>
            <div>
                <label className="block text-gray-400 mb-2" htmlFor="email">Email</label>
                <input id="email" type="email" value="demo@mowaers.com" disabled className="w-full bg-brand-dark border border-gray-600 rounded-md p-2" />
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
