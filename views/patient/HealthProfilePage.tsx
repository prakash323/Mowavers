
import React from 'react';
import { useAuth } from '../../hooks/useAuth';

const HealthProfilePage: React.FC = () => {
  const { user } = useAuth();
  return (
    <div className="animate-fade-in">
        <h2 className="text-3xl font-bold text-white mb-6">Health Profile</h2>
        <div className="bg-brand-dark-accent p-8 rounded-lg">
            <p className="text-gray-300">This is a placeholder for the patient's detailed health profile. Future versions will include:</p>
            <ul className="list-disc list-inside text-gray-400 mt-4 space-y-2">
                <li>Medical history and conditions</li>
                <li>Current medications</li>
                <li>Allergies</li>
                <li>Emergency contact information</li>
                <li>Personalized vital sign baselines</li>
            </ul>

            <div className="mt-8 border-t border-gray-700 pt-6">
                <p className="text-white font-semibold">Demo User: {user?.name}</p>
                <p className="text-gray-400">Role: {user?.role}</p>
            </div>
        </div>
    </div>
  );
};

export default HealthProfilePage;
