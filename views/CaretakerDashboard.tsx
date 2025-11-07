import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MOCK_PATIENTS, MOCK_EWS } from '../constants';
import PatientCard from '../components/PatientCard';
import AlertBanner from '../components/AlertBanner';
import { Patient } from '../types';
import PatientDetailView from '../components/caretaker/PatientDetailView';
import useGeolocation from '../hooks/useGeolocation';

const CaretakerDashboard: React.FC = () => {
  const { user, alerts, acknowledgeAlert } = useAuth();
  const allPatients: Patient[] = Object.values(MOCK_PATIENTS); // For demo, caretaker sees all patients
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const location = useGeolocation();

  const handleSelectPatient = (patientId: string) => {
      const patient = allPatients.find(p => p.id === patientId);
      if (patient) setSelectedPatient(patient);
  };

  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  const filteredPatients = useMemo(() => {
      return allPatients
      .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
      .sort((a, b) => (MOCK_EWS[b.id]?.score || 0) - (MOCK_EWS[a.id]?.score || 0));
  }, [allPatients, searchTerm]);

  if (selectedPatient) {
      return (
          <PatientDetailView 
              patient={selectedPatient} 
              onBack={() => setSelectedPatient(null)} 
          />
      );
  }

  return (
      <div className="animate-fade-in space-y-6">
          <div>
              <h2 className="text-3xl font-bold text-white">Caretaker Dashboard</h2>
              <p className="text-gray-400">Welcome, {user?.name}. Your assigned patients are listed below.</p>
          </div>
          
          <AlertBanner alerts={unacknowledgedAlerts} onAcknowledge={acknowledgeAlert} />

          <div className="mt-4">
              <input 
                  type="text"
                  placeholder="Search patient name..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full max-w-sm bg-brand-dark-accent border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary"
              />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPatients.map(patient => (
                  <PatientCard 
                      key={patient.id} 
                      patient={patient} 
                      onSelect={handleSelectPatient}
                      currentUserLocation={location}
                  />
              ))}
          </div>
      </div>
  );
};

export default CaretakerDashboard;
