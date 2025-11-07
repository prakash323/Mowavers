import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMockVitals } from '../hooks/useMockVitals';
import VitalCard from '../components/VitalCard';
import AlertBanner from '../components/AlertBanner';
import Button from '../components/ui/Button';
import { Alert, VitalType, VitalStatus, Patient } from '../types';
import WeeklyCheckinModal from '../components/WeeklyCheckinModal';
import { WaveformCard, ecgGenerator, ppgGenerator, respGenerator } from '../components/WaveformCard';
import SymptomTimeline from '../components/SymptomTimeline';
import HealthProfilePage from './patient/HealthProfilePage';
import MoodTracker from '../components/patient/MoodTracker';
import MedicationPanel from '../components/patient/MedicationPanel';
import VoiceNoteRecorder from '../components/patient/VoiceNoteRecorder';
import LifestyleSuggestions from '../components/patient/LifestyleSuggestions';
import EWSIndicator from '../components/EWSIndicator';
import { MOCK_EWS, MOCK_PATIENTS } from '../constants';
import NearbyPlaces from '../components/NearbyPlaces';
import SuggestionsPanel from '../components/SuggestionsPanel';

type PatientView = 'overview' | 'timeline' | 'profile';

const PatientDashboard: React.FC = () => {
    const { user, alerts, addAlert, acknowledgeAlert } = useAuth();
    const patientId = user?.id || '';
    const patient = MOCK_PATIENTS[patientId] as Patient;
    const { vitals, loading } = useMockVitals(patientId);
    const [isCheckinOpen, setIsCheckinOpen] = useState(false);
    const [view, setView] = useState<PatientView>('overview');

    const handleSOS = () => {
        const newAlert: Alert = {
            id: `sos-${Date.now()}`,
            patientId,
            patientName: user?.name || 'Unknown',
            message: 'SOS button pressed by patient. Immediate attention required.',
            timestamp: new Date(),
            acknowledged: false,
            type: 'sos',
        };
        addAlert(newAlert);
        alert("SOS Alert Sent! This is a demo, no emergency services have been contacted.");
    };

    const handleFallDetection = () => {
        const newAlert: Alert = {
            id: `fall-${Date.now()}`,
            patientId,
            patientName: user?.name || 'Unknown',
            message: 'Potential fall detected. Please check on the patient.',
            timestamp: new Date(),
            acknowledged: false,
            type: 'fall',
        };
        addAlert(newAlert);
        alert("Fall Detection Alert Sent! This is a simulation.");
    }

    const getVital = (type: VitalType) => vitals.find(v => v.type === type);
    const patientAlerts = alerts.filter(a => a.patientId === patientId);
    const isEmergency = vitals.some(v => v.status === VitalStatus.Critical);

    const renderView = () => {
        switch(view) {
            case 'timeline': return <SymptomTimeline patientId={patientId} />;
            case 'profile': return <HealthProfilePage />;
            case 'overview':
            default:
                 return (
                    <div className="space-y-6 animate-fade-in">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <EWSIndicator ews={MOCK_EWS[patientId]} />
                             <div className="lg:col-span-3">
                                <AlertBanner alerts={patientAlerts} onAcknowledge={acknowledgeAlert} />
                             </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                            {vitals.map(vital => <VitalCard key={vital.type} vital={vital} />)}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <WaveformCard label="ECG" color="#4ade80" generator={ecgGenerator(getVital(VitalType.HeartRate)?.value || 75, getVital(VitalType.HeartRate)?.status || VitalStatus.Normal)} value={getVital(VitalType.HeartRate)?.value.toString()} unit={getVital(VitalType.HeartRate)?.unit} />
                            <WaveformCard label="SpO2" color="#38bdf8" generator={ppgGenerator(getVital(VitalType.HeartRate)?.value || 75, getVital(VitalType.SpO2)?.status || VitalStatus.Normal)} value={getVital(VitalType.SpO2)?.value.toString()} unit={getVital(VitalType.SpO2)?.unit} />
                            <WaveformCard label="Respiration" color="#f87171" generator={respGenerator(getVital(VitalType.RespirationRate)?.value || 16, getVital(VitalType.RespirationRate)?.status || VitalStatus.Normal)} value={getVital(VitalType.RespirationRate)?.value.toString()} unit={getVital(VitalType.RespirationRate)?.unit} />
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                                <MoodTracker patientId={patientId} />
                                <VoiceNoteRecorder patientId={patientId} />
                                <div className="md:col-span-2">
                                     <LifestyleSuggestions patientId={patientId} />
                                </div>
                            </div>
                            <div className="lg:col-span-1">
                                {patient?.coordinates && <NearbyPlaces patientLocation={patient.coordinates} isEmergency={isEmergency} />}
                            </div>
                        </div>
                         <MedicationPanel patientId={patientId} />
                         <SuggestionsPanel vitals={vitals} />
                    </div>
                 );
        }
    };

    if (loading) return <div className="text-white text-center p-8">Loading patient data...</div>;

    const tabButtonClasses = (isActive: boolean) =>
    `px-4 py-2 font-semibold text-sm rounded-md transition-colors focus:outline-none ${
      isActive
        ? 'bg-brand-primary text-white'
        : 'bg-brand-dark-accent text-gray-300 hover:bg-gray-700'
    }`;


    return (
        <div>
            <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
                <h2 className="text-3xl font-bold text-white">Patient Dashboard</h2>
                <div className="flex items-center space-x-2 flex-wrap gap-2">
                    <Button onClick={() => setIsCheckinOpen(true)} size="sm">Weekly Check-in</Button>
                    <Button onClick={handleFallDetection} variant="secondary" size="sm">Simulate Fall Alert</Button>
                    <Button onClick={handleSOS} variant="danger" size="sm">SOS</Button>
                </div>
            </div>

            <div className="flex space-x-2 mb-6 border-b border-gray-700">
                <button onClick={() => setView('overview')} className={tabButtonClasses(view === 'overview')}>Overview</button>
                <button onClick={() => setView('timeline')} className={tabButtonClasses(view === 'timeline')}>Symptom Timeline</button>
                <button onClick={() => setView('profile')} className={tabButtonClasses(view === 'profile')}>Profile</button>
            </div>

            {renderView()}

            <WeeklyCheckinModal isOpen={isCheckinOpen} onClose={() => setIsCheckinOpen(false)} />
        </div>
    );
};

export default PatientDashboard;