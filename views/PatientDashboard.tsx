
import React, { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useMockVitals } from '../hooks/useMockVitals';
import VitalCard from '../components/VitalCard';
import AlertBanner from '../components/AlertBanner';
import Spinner from '../components/ui/Spinner';
import NearbyPlaces from '../components/NearbyPlaces';
import { MOCK_PATIENTS } from '../constants';
import { Patient, Alert } from '../types';
import WeeklyCheckinModal from '../components/WeeklyCheckinModal';
import Button from '../components/ui/Button';
import { WaveformCard, ecgGenerator, ppgGenerator, respGenerator } from '../components/WaveformCard';
import MoodTracker from '../components/patient/MoodTracker';
import VoiceNoteRecorder from '../components/patient/VoiceNoteRecorder';
import LifestyleSuggestions from '../components/patient/LifestyleSuggestions';
import MedicationPanel from '../components/patient/MedicationPanel';


const PatientDashboard: React.FC = () => {
    const { user, alerts, addAlert } = useAuth();
    const { vitals, loading } = useMockVitals(user!.id);
    const patient = MOCK_PATIENTS[user!.id] as Patient;
    const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
    const [sosMode, setSosMode] = useState(false);

    const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged && a.patientId === user!.id);

    const handleSOS = () => {
        setSosMode(true);
        const newAlert: Alert = {
            id: `sos-${Date.now()}`,
            eventType: 'alert',
            patientId: user!.id,
            patientName: user!.name,
            message: 'SOS button activated by patient!',
            timestamp: new Date(),
            acknowledged: false,
            type: 'sos'
        };
        addAlert(newAlert);
        setTimeout(() => setSosMode(false), 30000); // SOS mode lasts 30s
    };

    if (loading || !patient) {
        return <div className="flex justify-center items-center h-full"><Spinner /></div>;
    }

    const heartRateVital = vitals.find(v => v.type === 'Heart Rate');
    const spO2Vital = vitals.find(v => v.type === 'SpO2');
    const respRateVital = vitals.find(v => v.type === 'Respiration Rate');

    return (
        <div className="animate-fade-in space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-white">Patient Dashboard</h2>
                    <p className="text-gray-400">Welcome, {user?.name}. Here is your real-time health overview.</p>
                </div>
                <div className="flex space-x-2">
                    <Button onClick={() => setIsCheckinModalOpen(true)}>Weekly Check-in</Button>
                    <Button variant="danger" onClick={handleSOS} className={sosMode ? 'animate-pulse' : ''}>
                        SOS
                    </Button>
                </div>
            </div>

            <AlertBanner alerts={unacknowledgedAlerts} />
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {vitals.filter(v => ['Heart Rate', 'SpO2', 'Blood Pressure', 'Respiration Rate'].includes(v.type)).map(vital => (
                        <VitalCard key={vital.type} vital={vital} />
                    ))}
                </div>
                 <div className="grid grid-cols-1 gap-6">
                    {patient.coordinates && <NearbyPlaces patientLocation={patient.coordinates} isEmergency={sosMode} />}
                 </div>
            </div>
            
             <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <WaveformCard 
                    label="ECG" 
                    color="#4ade80" 
                    generator={ecgGenerator(heartRateVital?.value, heartRateVital?.status)}
                    value={heartRateVital?.value.toString()}
                    unit={heartRateVital?.unit}
                />
                 <WaveformCard 
                    label="SpO2" 
                    color="#60a5fa" 
                    generator={ppgGenerator(heartRateVital?.value, spO2Vital?.status)}
                    value={spO2Vital?.value.toString()}
                    unit={spO2Vital?.unit}
                />
                 <WaveformCard 
                    label="Respiration" 
                    color="#facc15" 
                    generator={respGenerator(respRateVital?.value, respRateVital?.status)}
                    value={respRateVital?.value.toString()}
                    unit={respRateVital?.unit}
                />
            </div>
            
            <MedicationPanel patientId={patient.id} />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <MoodTracker patientId={patient.id} />
                <VoiceNoteRecorder patientId={patient.id} />
                <LifestyleSuggestions patientId={patient.id} />
            </div>

            <WeeklyCheckinModal isOpen={isCheckinModalOpen} onClose={() => setIsCheckinModalOpen(false)} />
        </div>
    );
};

export default PatientDashboard;
