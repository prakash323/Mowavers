import React, { useState } from 'react';
import { Patient } from '../../types';
import { useMockVitals } from '../../hooks/useMockVitals';
import VitalCard from '../VitalCard';
import CollaborationNotes from './CollaborationNotes';
import SymptomTimeline from '../SymptomTimeline';
import EWSIndicator from '../EWSIndicator';
import { MOCK_EWS } from '../../constants';
import SuggestionsPanel from '../SuggestionsPanel';
import { WaveformCard, ecgGenerator, ppgGenerator, respGenerator } from '../WaveformCard';
import Button from '../ui/Button';
import Modal from '../Modal';
import Spinner from '../ui/Spinner';
import { PaperAirplaneIcon, PhoneIcon } from '../icons';

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
              className="w-full bg-brand-dark border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
              disabled={isActionInProgress}
            />
            <div className="flex justify-end mt-2">
              <Button onClick={handleSendMessage} disabled={isActionInProgress || !message.trim()} className="flex items-center">
                <PaperAirplaneIcon className="h-5 w-5 mr-2" /> Send
              </Button>
            </div>
          </div>

          <div className="border-t border-gray-700 my-4"></div>

          <div>
            <h4 className="text-lg font-semibold text-brand-text-light dark:text-white mb-2">Initiate a Telehealth Call</h4>
            <p className="text-sm text-gray-400 mb-4">For urgent matters, you can start a simulated call.</p>
            <Button onClick={handleCall} variant="secondary" className="w-full flex items-center justify-center" disabled={isActionInProgress}>
              <PhoneIcon className="h-5 w-5 mr-2" /> Call {doctorName}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
};

interface PatientDetailViewProps {
  patient: Patient;
  onBack: () => void;
}

const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient, onBack }) => {
  const { vitals } = useMockVitals(patient.id);
  const ews = MOCK_EWS[patient.id];
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  
  const heartRateVital = vitals.find(v => v.type === 'Heart Rate');
  const spO2Vital = vitals.find(v => v.type === 'SpO2');
  const respRateVital = vitals.find(v => v.type === 'Respiration Rate');

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex justify-between items-center">
        <button onClick={onBack} className="text-brand-primary hover:underline">
          &larr; Back to Patient List
        </button>
        <Button variant="secondary" onClick={() => setIsContactModalOpen(true)}>
            Contact Doctor
        </Button>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white">{patient.name}</h2>
          <p className="text-gray-400">DOB: {patient.dob} | Conditions: {patient.conditions?.join(', ')}</p>
        </div>
        <div className="w-full md:w-1/3">
          {ews && <EWSIndicator ews={ews} />}
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {vitals.filter(v => ['Heart Rate', 'SpO2', 'Blood Pressure', 'Respiration Rate'].includes(v.type)).map(vital => (
          <VitalCard key={vital.type} vital={vital} />
        ))}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SymptomTimeline patientId={patient.id} />
        </div>
        <div className="space-y-6">
          <SuggestionsPanel vitals={vitals} />
          <CollaborationNotes patientId={patient.id} />
        </div>
      </div>
      <ContactDoctorModal isOpen={isContactModalOpen} onClose={() => setIsContactModalOpen(false)} />
    </div>
  );
};

export default PatientDetailView;