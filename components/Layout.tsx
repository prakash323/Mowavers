
import React, { ReactNode } from 'react';
import Header from './Header';
import Sidebar from './Sidebar';
import { useAuth } from '../hooks/useAuth';

interface LayoutProps {
  children: ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    // For logged-out views (Landing, Login, Signup), we don't need the sidebar/header.
    return (
        <div className="bg-brand-dark text-brand-text min-h-screen">
            {children}
        </div>
    );
  }

  return (
    <div className="flex h-screen bg-brand-dark text-brand-text">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-dark p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
