
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import Button from '../components/ui/Button';
import { LogoIcon } from '../components/icons';

const LoginPage: React.FC = () => {
  const { login } = useAuth();

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-dark">
      <div className="max-w-md w-full bg-brand-dark-accent p-8 rounded-lg shadow-2xl text-center">
        <div className="flex justify-center items-center mb-6">
            <LogoIcon className="h-12 w-12 text-brand-primary"/>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Select Your Role</h2>
        <p className="text-gray-400 mb-8">Choose a role to begin the demo experience.</p>
        <div className="space-y-4">
          <Button onClick={() => login(UserRole.Patient)} className="w-full text-lg py-3">
            Log in as Patient
          </Button>
          <Button onClick={() => login(UserRole.Caretaker)} className="w-full text-lg py-3">
            Log in as Caretaker
          </Button>
          <Button onClick={() => login(UserRole.Doctor)} className="w-full text-lg py-3">
            Log in as Doctor
          </Button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
