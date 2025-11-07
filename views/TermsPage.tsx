
import React from 'react';

const TermsPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Terms of Service</h2>
      <div className="bg-brand-dark-accent p-8 rounded-lg space-y-4 text-gray-300">
        <p>This document is a placeholder for the full Terms of Service.</p>
        <h3 className="text-xl font-semibold text-brand-primary pt-4">Disclaimer</h3>
        <p>MOWAERS is a monitoring and alert system and is NOT intended for self-diagnosis or as a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.</p>
        <h3 className="text-xl font-semibold text-brand-primary pt-4">Emergency Services</h3>
        <p>The SOS feature is designed to contact emergency services. In this demo, it is a simulation and does not contact real emergency responders.</p>
        <h3 className="text-xl font-semibold text-brand-primary pt-4">Data Accuracy</h3>
        <p>While we strive for accuracy, the data provided by the device and displayed on this platform is for informational purposes only. For this MVP, all data is simulated.</p>
      </div>
    </div>
  );
};

export default TermsPage;
