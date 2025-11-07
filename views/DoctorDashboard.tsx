import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MOCK_PATIENTS } from '../constants';
import PatientCard from '../components/PatientCard';
import AlertBanner from '../components/AlertBanner';
import { User, Patient, Coordinates } from '../types';
import SymptomTimeline from '../components/SymptomTimeline';
import HealthProfilePage from './patient/HealthProfilePage';
import EWSIndicator from '../components/EWSIndicator';
import { MOCK_EWS } from '../constants';
import AIDoctorSummary from '../components/doctor/AIDoctorSummary';
import CollaborationNotes from '../components/caretaker/CollaborationNotes';
import useGeolocation from '../hooks/useGeolocation';

const DoctorDashboard: React.FC = () => {
  const { user, alerts, acknowledgeAlert } = useAuth();
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const location = useGeolocation();
  const doctorLocation = !location.loading && location.latitude ? { latitude: location.latitude, longitude: location.longitude } as Coordinates : null;

  const patientIds = user?.patients || [];
  const patients = patientIds.map(id => MOCK_PATIENTS[id]).filter(Boolean);
  const doctorAlerts = alerts.filter(a => patientIds.includes(a.patientId));

  if (selectedPatientId) {
    const selectedPatient = MOCK_PATIENTS[selectedPatientId] as Patient;
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
              <AIDoctorSummary patient={selectedPatient} />
              <CollaborationNotes patientId={selectedPatientId} />
              <SymptomTimeline patientId={selectedPatientId} />
              <HealthProfilePage />
            </div>
        </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-bold text-white mb-6">Doctor Dashboard</h2>
      <AlertBanner alerts={doctorAlerts} onAcknowledge={acknowledgeAlert}/>
      <h3 className="text-xl font-semibold text-white mb-4 mt-6">Your Patients</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {patients.map((patient: User) => (
          <PatientCard key={patient.id} patient={patient} onSelect={setSelectedPatientId} currentUserLocation={doctorLocation} />
        ))}
      </div>
       {patients.length === 0 && <p className="text-gray-400">You do not have any patients assigned.</p>}
    </div>
  );
};

export default DoctorDashboard;