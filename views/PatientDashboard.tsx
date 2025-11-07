
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMockVitals } from '../hooks/useMockVitals';
import VitalCard from '../components/VitalCard';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';
import Modal from '../components/Modal';
import Chatbot from '../components/Chatbot';

const PatientDashboard: React.FC = () => {
  const { user } = useAuth();
  const { vitals, loading } = useMockVitals(user?.id || '');
  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [sosSent, setSosSent] = useState(false);

  const handleSos = () => {
    setIsSosModalOpen(false);
    setSosSent(true);
    // In a real app, this would trigger an emergency response
    setTimeout(() => setSosSent(false), 5000); // Reset after 5 seconds
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Spinner />
        <p className="ml-2">Loading Vital Data...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-white">My Vital Orbit</h2>
            <Button variant="danger" onClick={() => setIsSosModalOpen(true)}>
                Initiate SOS
            </Button>
        </div>

        {sosSent && (
            <div className="bg-green-500/20 border border-green-500 text-green-300 p-4 rounded-lg mb-6">
                SOS signal sent. Emergency services and your caretaker have been notified. Help is on the way.
            </div>
        )}
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vitals.map(vital => (
                <VitalCard key={vital.type} vital={vital} />
            ))}
        </div>
        
        <Modal isOpen={isSosModalOpen} onClose={() => setIsSosModalOpen(false)} title="Confirm SOS">
            <p className="text-gray-300 mb-6">Are you sure you want to trigger an SOS? This will immediately alert emergency services and your registered caretakers.</p>
            <div className="flex justify-end space-x-4">
                <Button variant="secondary" onClick={() => setIsSosModalOpen(false)}>Cancel</Button>
                <Button variant="danger" onClick={handleSos}>Confirm SOS</Button>
            </div>
        </Modal>

        <Chatbot />
    </div>
  );
};

export default PatientDashboard;
