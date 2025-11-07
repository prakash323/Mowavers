
import React from 'react';
import { useAuth } from './hooks/useAuth';
import LandingPage from './views/LandingPage';
import LoginPage from './views/LoginPage';
import PatientDashboard from './views/PatientDashboard';
import CaretakerDashboard from './views/CaretakerDashboard';
import DoctorDashboard from './views/DoctorDashboard';
import Layout from './components/Layout';
import { UserRole } from './types';
import SettingsPage from './views/SettingsPage';
import HelpPage from './views/HelpPage';
import PrivacyPage from './views/PrivacyPage';
import TermsPage from './views/TermsPage';

const App: React.FC = () => {
  const { user, view, setView } = useAuth();

  const renderContent = () => {
    if (!user) {
      if (view === 'login') return <LoginPage />;
      return <LandingPage />;
    }

    switch (view) {
      case 'dashboard':
        if (user.role === UserRole.Patient) return <PatientDashboard />;
        if (user.role === UserRole.Caretaker) return <CaretakerDashboard />;
        if (user.role === UserRole.Doctor) return <DoctorDashboard />;
        return null;
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

  return <Layout>{renderContent()}</Layout>;
};

export default App;
