import React from 'react';
import { Patient, Coordinates } from '../types';
import { useMockVitals } from '../hooks/useMockVitals';
import { MOCK_EWS } from '../constants';
import MiniVitalTrend from './MiniVitalTrend';
import EWSIndicator from './EWSIndicator';
import { calculateDistance } from '../utils/location';

interface PatientCardProps {
  patient: Patient;
  onSelect: (patientId: string) => void;
  currentUserLocation?: { latitude: number | null, longitude: number | null };
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onSelect, currentUserLocation }) => {
  const { vitals } = useMockVitals(patient.id);
  const ews = MOCK_EWS[patient.id];

  const patientDistance = () => {
    if (currentUserLocation?.latitude && currentUserLocation?.longitude && patient.coordinates) {
      return calculateDistance(
        { latitude: currentUserLocation.latitude, longitude: currentUserLocation.longitude },
        patient.coordinates
      ).toFixed(1);
    }
    return null;
  }

  const ewsLevel = ews?.level || 'Low';
  const cardBorderColor = {
      High: 'border-status-red',
      Medium: 'border-status-amber',
      Low: 'border-brand-dark-accent',
  }[ewsLevel];

  return (
    <div 
      onClick={() => onSelect(patient.id)}
      className={`bg-brand-dark-accent rounded-lg p-4 shadow-lg cursor-pointer hover:shadow-2xl hover:border-brand-primary transition-all border-l-4 ${cardBorderColor}`}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-bold text-white">{patient.name}</h3>
          <p className="text-sm text-gray-400">DOB: {patient.dob}</p>
          <p className="text-xs text-gray-500">{patient.conditions?.join(', ')}</p>
          {patientDistance() && <p className="text-xs text-brand-primary mt-1">{patientDistance()} miles away</p>}
        </div>
      </div>

      {ews && <div className="mt-4"><EWSIndicator ews={ews} /></div>}

      <div className="mt-4 grid grid-cols-2 gap-2">
          {vitals.slice(0, 4).map(vital => (
              <MiniVitalTrend key={vital.type} vital={vital} />
          ))}
      </div>
    </div>
  );
};

export default PatientCard;
