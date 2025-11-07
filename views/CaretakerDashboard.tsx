
import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { PATIENTS, MOCK_ALERTS } from '../constants';
import { Patient, Alert } from '../types';
import PatientCard from '../components/PatientCard';
import AlertBanner from '../components/AlertBanner';
import Chatbot from '../components/Chatbot';
import Modal from '../components/Modal';
import { useMockVitals } from '../hooks/useMockVitals';
import VitalCard from '../components/VitalCard';
import Spinner from '../components/ui/Spinner';
import Button from '../components/ui/Button';

const CaretakerDashboard: React.FC = () => {
    const { user } = useAuth();
    const [alerts, setAlerts] = useState<Alert[]>(MOCK_ALERTS);
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);

    const monitoredPatients = useMemo(() => PATIENTS.filter(p => p.caretakerId === user?.id), [user?.id]);
    
    const handleAcknowledge = (alertId: string) => {
        setAlerts(currentAlerts =>
            currentAlerts.map(alert =>
                alert.id === alertId ? { ...alert, acknowledged: true } : alert
            )
        );
    };

    const selectedPatient = PATIENTS.find(p => p.id === selectedPatientId);

    return (
        <div className="container mx-auto">
            <h2 className="text-3xl font-bold text-white mb-6">Family Nexus</h2>
            
            <AlertBanner alerts={alerts} onAcknowledge={handleAcknowledge} />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {monitoredPatients.length > 0 ? (
                    monitoredPatients.map(patient => (
                        <PatientCard key={patient.id} patient={patient} onSelect={setSelectedPatientId} />
                    ))
                ) : (
                    <p className="text-gray-400">No patients are currently assigned to you.</p>
                )}
            </div>

            {selectedPatient && (
                <PatientDetailModal
                    patient={selectedPatient}
                    isOpen={!!selectedPatientId}
                    onClose={() => setSelectedPatientId(null)}
                />
            )}

            <Chatbot />
        </div>
    );
};

interface PatientDetailModalProps {
  patient: Patient;
  isOpen: boolean;
  onClose: () => void;
}

const PatientDetailModal: React.FC<PatientDetailModalProps> = ({ patient, isOpen, onClose }) => {
    const { vitals, loading } = useMockVitals(patient.id);
    const [note, setNote] = useState('');

    const handleAddNote = () => {
        if(note.trim()) {
            console.log(`Note for ${patient.name}: ${note}`); // Mock action
            setNote('');
            alert('Note added successfully!');
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Details for ${patient.name}`}>
            {loading ? <div className="flex justify-center items-center h-64"><Spinner/></div> : (
                <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {vitals.map(vital => <VitalCard key={vital.type} vital={vital} />)}
                    </div>
                    <div className="pt-4 border-t border-gray-700">
                        <h4 className="font-bold text-lg mb-2">Add Note</h4>
                        <textarea
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            className="w-full bg-brand-dark border border-gray-600 rounded-md p-2 h-24 focus:outline-none focus:ring-2 focus:ring-brand-primary"
                            placeholder={`Add an observation for ${patient.name}...`}
                        />
                        <div className="text-right mt-2">
                            <Button onClick={handleAddNote}>Save Note</Button>
                        </div>
                    </div>
                </div>
            )}
        </Modal>
    );
};

export default CaretakerDashboard;
