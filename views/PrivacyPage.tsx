
import React from 'react';

const PrivacyPage: React.FC = () => {
  return (
    <div className="container mx-auto">
      <h2 className="text-3xl font-bold text-white mb-6">Privacy Policy</h2>
      <div className="bg-brand-dark-accent p-8 rounded-lg space-y-4 text-gray-300">
        <p>This document is a placeholder. In a production environment, this page would detail our commitment to protecting user data under HIPAA safeguards.</p>
        <h3 className="text-xl font-semibold text-brand-primary pt-4">Data Collection</h3>
        <p>We collect vital sign data from the wearable device and user-provided information during account setup. All Protected Health Information (PHI) is handled with the utmost security.</p>
        <h3 className="text-xl font-semibold text-brand-primary pt-4">Data Usage</h3>
        <p>Data is used to provide real-time monitoring, generate alerts for users and their care teams, and display health trends. Anonymized data may be used for research and service improvement, with explicit user consent.</p>
        <h3 className="text-xl font-semibold text-brand-primary pt-4">User Rights</h3>
        <p>Users have the right to access, amend, and request deletion of their data. For the purpose of this demo, all data is mocked and not persisted.</p>
      </div>
    </div>
  );
};

export default PrivacyPage;
