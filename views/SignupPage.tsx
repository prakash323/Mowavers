
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import Button from '../components/ui/Button';
import { LogoIcon } from '../components/icons';
import Spinner from '../components/ui/Spinner';

const SignupPage: React.FC = () => {
  const { login, setView } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Patient);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    // Mock signup and login
    setTimeout(() => {
        login(role);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-dark">
      <div className="max-w-md w-full bg-brand-dark-accent p-8 rounded-lg shadow-2xl">
        <div className="flex justify-center items-center mb-6">
          <LogoIcon className="h-12 w-12 text-brand-primary"/>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Create Account</h2>
        <p className="text-gray-400 mb-8 text-center">Join MOWAERS today.</p>
        
        <form onSubmit={handleSignup} noValidate>
          {error && <p className="bg-status-red/20 text-status-red text-sm p-3 rounded-md mb-4">{error}</p>}
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input type="email" id="email" value={email} onChange={e => setEmail(e.target.value)} required className="w-full bg-brand-dark border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary text-white" />
            </div>
            <div>
              <label htmlFor="password"className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input type="password" id="password" value={password} onChange={e => setPassword(e.target.value)} required className="w-full bg-brand-dark border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary text-white" />
            </div>
            <div>
              <label htmlFor="confirm-password"className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
              <input type="password" id="confirm-password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="w-full bg-brand-dark border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary text-white" />
            </div>
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">I am a...</label>
              <select id="role" value={role} onChange={e => setRole(e.target.value as UserRole)} className="w-full bg-brand-dark border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary text-white">
                <option value={UserRole.Patient}>Patient</option>
                <option value={UserRole.Caretaker}>Caretaker</option>
                <option value={UserRole.Doctor}>Doctor</option>
              </select>
            </div>
            <div>
              <Button type="submit" className="w-full flex justify-center py-3" disabled={isLoading}>
                {isLoading ? <Spinner /> : 'Create Account'}
              </Button>
            </div>
          </div>
        </form>
        <p className="mt-8 text-sm text-center text-gray-400">
            Already have an account?{' '}
            <button onClick={() => setView('login')} className="font-medium text-brand-primary hover:underline">
                Sign In
            </button>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;
