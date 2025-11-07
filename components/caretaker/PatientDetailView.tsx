import React from 'react';
import { Patient } from '../../types';
import { useMockVitals } from '../../hooks/useMockVitals';
import VitalCard from '../VitalCard';
import CollaborationNotes from './CollaborationNotes';
import SymptomTimeline from '../SymptomTimeline';
import EWSIndicator from '../EWSIndicator';
import { MOCK_EWS } from '../../constants';
import SuggestionsPanel from '../SuggestionsPanel';
import { WaveformCard, ecgGenerator, ppgGenerator, respGenerator } from '../WaveformCard';

interface PatientDetailViewProps {
  patient: Patient;
  onBack: () => void;
}

const PatientDetailView: React.FC<PatientDetailViewProps> = ({ patient, onBack }) => {
  const { vitals } = useMockVitals(patient.id);
  const ews = MOCK_EWS[patient.id];
  
  const heartRateVital = vitals.find(v => v.type === 'Heart Rate');
  const spO2Vital = vitals.find(v => v.type === 'SpO2');
  const respRateVital = vitals.find(v => v.type === 'Respiration Rate');

  return (
    <div className="animate-fade-in space-y-6">
      <button onClick={onBack} className="text-brand-primary hover:underline mb-4">
        &larr; Back to Patient List
      </button>

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
    </div>
  );
};

export default PatientDetailView;
