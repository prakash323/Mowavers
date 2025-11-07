
import React from 'react';
import Button from '../components/ui/Button';
import { useAuth } from '../hooks/useAuth';
import { LogoIcon } from '../components/icons';

const LandingPage: React.FC = () => {
    const { setView } = useAuth();

    return (
        <div className="min-h-screen flex flex-col items-center justify-center text-center p-4 bg-brand-dark">
            <div className="max-w-3xl">
                <div className="flex justify-center items-center mb-6">
                    <LogoIcon className="h-16 w-16 text-brand-primary" />
                </div>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
                    Welcome to MOWAERS
                </h1>
                <p className="text-lg md:text-xl text-gray-300 mb-8">
                    Continuous monitoring, intelligent alerts, and peace of mind. Your proactive health partner, connecting patients, caretakers, and doctors in real-time.
                </p>
                
                <div className="bg-brand-dark-accent p-8 rounded-lg shadow-2xl">
                    <h2 className="text-2xl font-bold text-white mb-6">Get Started</h2>
                    <p className="text-gray-400 mb-6">Select your role to access the MOWAERS platform or view a demo.</p>
                    <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
                        <Button onClick={() => setView('login')} className="w-full sm:w-auto">
                            Login / Demo
                        </Button>
                        <Button variant="secondary" className="w-full sm:w-auto">
                            Learn More
                        </Button>
                    </div>
                </div>

                <div className="mt-12 text-gray-500 text-sm">
                    <p>&copy; 2024 MOWAERS HealthTech. All rights reserved.</p>
                    <div className="mt-2">
                        <a href="#" onClick={(e) => { e.preventDefault(); setView('privacy');}} className="hover:underline mx-2">Privacy Policy</a>
                        <span className="mx-1">|</span>
                        <a href="#" onClick={(e) => { e.preventDefault(); setView('terms');}} className="hover:underline mx-2">Terms of Service</a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
