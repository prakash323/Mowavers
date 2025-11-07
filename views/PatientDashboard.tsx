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
import Modal from '../components/Modal';
import { PaperAirplaneIcon, PhoneIcon } from '../components/icons';

// Contact Doctor Modal Component
interface ContactDoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName?: string;
}

const ContactDoctorModal: React.FC<ContactDoctorModalProps> = ({ isOpen, onClose, doctorName = "Dr. Evans" }) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [status, setStatus] = useState('');

  const handleSendMessage = () => {
    if (!message.trim()) return;
    setIsSending(true);
    setStatus('Sending message...');
    setTimeout(() => {
      setStatus(`Your message has been sent to ${doctorName}.`);
      setIsSending(false);
      setTimeout(() => {
        handleClose();
      }, 2000);
    }, 1500);
  };

  const handleCall = () => {
    setIsCalling(true);
    setStatus(`Calling ${doctorName}...`);
    setTimeout(() => {
      setStatus('Connecting...');
      setTimeout(() => {
        setStatus('Call connected. This is a simulation.');
        setTimeout(() => {
          setStatus('Call ended.');
          setTimeout(() => {
            handleClose();
          }, 1500);
        }, 3000);
      }, 2000);
    }, 1500);
  };
  
  const handleClose = () => {
    setMessage('');
    setIsSending(false);
    setIsCalling(false);
    setStatus('');
    onClose();
  };
  
  const isActionInProgress = isSending || isCalling;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title={`Contact ${doctorName}`}>
      {status ? (
        <div className="text-center p-4">
            <p className="text-brand-text-light dark:text-white">{status}</p>
            {(isSending || isCalling) && <div className="mt-4"><Spinner /></div>}
        </div>
      ) : (
        <div className="space-y-6">
          <div>
            <h4 className="text-lg font-semibold text-brand-text-light dark:text-white mb-2">Send a Secure Message</h4>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type your non-urgent message here..."
              rows={4}
              className="w-full bg-brand-light-accent dark:bg-brand-dark border border-gray-300 dark:border-gray-600 rounded-md p-2 text-brand-text-light dark:text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              disabled={isActionInProgress}
            />
            <div className="flex justify-end mt-2">
              <Button onClick={handleSendMessage} disabled={isActionInProgress || !message.trim()} className="flex items-center">
                <PaperAirplaneIcon className="h-5 w-5 mr-2" /> Send
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-200 dark:border-gray-700 my-4"></div>

          <div>
            <h4 className="text-lg font-semibold text-brand-text-light dark:text-white mb-2">Initiate a Telehealth Call</h4>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">For urgent matters, you can start a simulated call.</p>
            <Button onClick={handleCall} variant="secondary" className="w-full flex items-center justify-center" disabled={isActionInProgress}>
              <PhoneIcon className="h-5 w-5 mr-2" /> Call {doctorName}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};


const PatientDashboard: React.FC = () => {
    const { user, alerts, addAlert } = useAuth();
    const { vitals, loading } = useMockVitals(user!.id);
    const patient = MOCK_PATIENTS[user!.id] as Patient;
    const [isCheckinModalOpen, setIsCheckinModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
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
            // FIX: Corrected typo from `new date()` to `new Date()`.
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
                    <h2 className="text-3xl font-bold text-brand-text-light dark:text-white">Patient Dashboard</h2>
                    <p className="text-gray-500 dark:text-gray-400">Welcome, {user?.name}. Here is your real-time health overview.</p>
                </div>
                <div className="flex space-x-2">
                    <Button onClick={() => setIsCheckinModalOpen(true)}>Weekly Check-in</Button>
                    <Button variant="secondary" onClick={() => setIsContactModalOpen(true)}>Contact Doctor</Button>
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
                    value={heartRateVital?.value?.toString()}
                    unit={heartRateVital?.unit}
                />
                 <WaveformCard 
                    label="SpO2" 
                    color="#60a5fa" 
                    generator={ppgGenerator(heartRateVital?.value, spO2Vital?.status)}
                    value={spO2Vital?.value?.toString()}
                    unit={spO2Vital?.unit}
                />
                 <WaveformCard 
                    label="Respiration" 
                    color="#facc15" 
                    generator={respGenerator(respRateVital?.value, respRateVital?.status)}
                    value={respRateVital?.value?.toString()}
                    unit={respRateVital?.unit}
                />
            </div>
            
            <MedicationPanel patientId={patient.id} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MoodTracker patientId={patient.id} />
                <VoiceNoteRecorder patientId={patient.id} />
                <LifestyleSuggestions patientId={patient.id} />
            </div>

            <WeeklyCheckinModal isOpen={isCheckinModalOpen} onClose={() => setIsCheckinModalOpen(false)} />
            <ContactDoctorModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
        </div>
    );
};

export default PatientDashboard;