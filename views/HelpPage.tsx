
import React from 'react';

const HelpPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Help & Documentation</h2>
      <div className="bg-brand-dark-accent p-8 rounded-lg space-y-6">
        <div>
          <h3 className="text-xl font-semibold text-brand-primary mb-2">Getting Started</h3>
          <p className="text-gray-300">Welcome to the MOWAERS MVP Demo. Use the login page to select a role (Patient, Caretaker, or Doctor) and explore the corresponding dashboard. Data is simulated and updates every 10 seconds.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-brand-primary mb-2">Patient Dashboard</h3>
          <p className="text-gray-300">The "Vital Orbit" displays your key health metrics in real-time. Cards are color-coded based on your personalized health baseline. The SOS button can be used to simulate an emergency alert.</p>
        </div>
        <div>
          <h3 className="text-xl font-semibold text-brand-primary mb-2">AI Assistant</h3>
          <p className="text-gray-300">Click the chat icon to interact with our AI assistant. You can ask general health questions, but please remember it is not a substitute for professional medical advice.</p>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
