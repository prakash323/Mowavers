import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MOCK_PATIENTS } from '../constants';
import PatientCard from '../components/PatientCard';
import AlertBanner from '../components/AlertBanner';
import { User, Coordinates } from '../types';
import SymptomTimeline from '../components/SymptomTimeline';
import HealthProfilePage from './patient/HealthProfilePage';
import EWSIndicator from '../components/EWSIndicator';
import { MOCK_EWS } from '../constants';
import CollaborationNotes from '../components/caretaker/CollaborationNotes';
import useGeolocation from '../hooks/useGeolocation';
import NearbyPlaces from '../components/NearbyPlaces';

const CaretakerDashboard: React.FC = () => {
  const { user, alerts, acknowledgeAlert } = useAuth();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const location = useGeolocation();
  const caretakerLocation = !location.loading && location.latitude ? { latitude: location.latitude, longitude: location.longitude } as Coordinates : null;

  const monitoredPatientIds = user?.patients || [];
  const monitoredPatients = monitoredPatientIds.map(id => MOCK_PATIENTS[id]).filter(Boolean);
  const caretakerAlerts = alerts.filter(a => monitoredPatientIds.includes(a.patientId));

  if (selectedPatientId) {
    const selectedPatient = MOCK_PATIENTS[selectedPatientId];
    return (
        <div className="animate-fade-in">
            <button onClick={() => setSelectedPatientId(null)} className="mb-6 bg-brand-dark-accent text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors">
                &larr; Back to Patient List
            </button>
            <div className="flex justify-between items-start mb-6">
                <h2 className="text-3xl font-bold text-white">Patient Details: {selectedPatient.name}</h2>
                <EWSIndicator ews={MOCK_EWS[selectedPatientId]} />
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <CollaborationNotes patientId={selectedPatientId} />
                {selectedPatient.coordinates && <NearbyPlaces patientLocation={selectedPatient.coordinates} isEmergency={false} />}
              </div>
              <SymptomTimeline patientId={selectedPatientId} />
              <HealthProfilePage />
            </div>
        </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-6">Caretaker Dashboard</h2>
      <AlertBanner alerts={caretakerAlerts} onAcknowledge={acknowledgeAlert}/>
      <h3 className="text-xl font-semibold text-white mb-4 mt-6">Monitored Patients</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monitoredPatients.map((patient: User) => (
          <PatientCard key={patient.id} patient={patient} onSelect={setSelectedPatientId} currentUserLocation={caretakerLocation} />
        ))}
      </div>
       {monitoredPatients.length === 0 && <p className="text-gray-400">You are not monitoring any patients.</p>}
    </div>
  );
};

export default CaretakerDashboard;