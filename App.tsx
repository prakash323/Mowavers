
import React from 'react';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import LandingPage from './views/LandingPage';
import LoginPage from './views/LoginPage';
import SignupPage from './views/SignupPage';
import PatientDashboard from './views/PatientDashboard';
import CaretakerDashboard from './views/CaretakerDashboard';
import DoctorDashboard from './views/DoctorDashboard';
import SettingsPage from './views/SettingsPage';
import HelpPage from './views/HelpPage';
import PrivacyPage from './views/PrivacyPage';
import TermsPage from './views/TermsPage';
import { UserRole } from './types';
import Chatbot from './components/Chatbot';

const App: React.FC = () => {
    const { user, view } = useAuth();

    const renderDashboard = () => {
        if (!user) return <LoginPage />;
        switch (user.role) {
            case UserRole.Patient:
                return <PatientDashboard />;
            case UserRole.Caretaker:
                return <CaretakerDashboard />;
            case UserRole.Doctor:
                return <DoctorDashboard />;
            default:
                return <LoginPage />;
        }
    };

    const renderContent = () => {
        switch (view) {
            case 'landing':
                return <LandingPage />;
            case 'login':
                return <LoginPage />;
            case 'signup':
                return <SignupPage />;
            case 'dashboard':
                return renderDashboard();
            case 'settings':
                return <SettingsPage />;
            case 'help':
                return <HelpPage />;
            case 'privacy':
                return <PrivacyPage />;
            case 'terms':
                return <TermsPage />;
            default:
                return <LandingPage />;
        }
    };

    return (
        <>
            <Layout>
                {renderContent()}
            </Layout>
            {user && <Chatbot />}
        </>
    );
};

export default App;
