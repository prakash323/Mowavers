import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { UserRole } from '../types';
import Button from '../components/ui/Button';
import { LogoIcon } from '../components/icons';
import Spinner from '../components/ui/Spinner';

const LoginPage: React.FC = () => {
  const { login, setView } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.Patient);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    // Mock authentication
    setTimeout(() => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(email) && password.length > 0) {
        login(role);
      } else {
        setError('Invalid credentials. Please try again.');
        setIsLoading(false);
      }
    }, 1500); // Simulate network delay
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-brand-dark">
      <div className="max-w-md w-full bg-brand-dark-accent p-8 rounded-lg shadow-2xl">
        <div className="flex justify-center items-center mb-6">
          <LogoIcon className="h-12 w-12 text-brand-primary"/>
        </div>
        <h2 className="text-2xl font-bold text-white mb-2 text-center">Welcome Back</h2>
        <p className="text-gray-400 mb-8 text-center">Sign in to access your dashboard.</p>
        
        <form onSubmit={handleLogin} noValidate>
          {error && (
            <div className="bg-status-red/20 border border-status-red text-status-red px-4 py-3 rounded-md mb-6 text-sm" role="alert">
              {error}
            </div>
          )}
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-brand-dark border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary text-white"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-brand-dark border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary text-white"
              />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-2">Select Your Role</label>
              <select
                id="role"
                name="role"
                value={role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="w-full bg-brand-dark border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary text-white"
              >
                <option value={UserRole.Patient}>Patient</option>
                <option value={UserRole.Caretaker}>Caretaker</option>
                <option value={UserRole.Doctor}>Doctor</option>
              </select>
            </div>

            <div className="flex items-center justify-end">
                <a href="#" onClick={(e) => { e.preventDefault(); alert('Forgot Password functionality coming soon!'); }} className="text-sm text-brand-primary hover:underline">Forgot password?</a>
            </div>

            <div>
              <Button type="submit" className="w-full flex justify-center py-3" disabled={isLoading}>
                {isLoading ? <Spinner /> : 'Login'}
              </Button>
            </div>
          </div>
        </form>
        <p className="mt-8 text-sm text-center text-gray-400">
            Don't have an account?{' '}
            <button onClick={() => setView('signup')} className="font-medium text-brand-primary hover:underline">
                Sign Up
            </button>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
