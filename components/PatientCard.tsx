import React from 'react';
import { Patient } from '../types';
import { useMockVitals } from '../hooks/useMockVitals';
import { MOCK_EWS } from '../constants';
import MiniVitalTrend from './MiniVitalTrend';
import EWSIndicator from './EWSIndicator';
import { calculateDistance } from '../utils/location';
import { UserCircleIcon } from './icons';

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
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          {patient.avatarUrl ? (
            <img src={patient.avatarUrl} alt={patient.name} className="h-16 w-16 rounded-full object-cover border-2 border-brand-dark" />
          ) : (
            <div className="h-16 w-16 rounded-full bg-brand-dark flex items-center justify-center">
              <UserCircleIcon className="h-10 w-10 text-gray-500" />
            </div>
          )}
        </div>
        <div className="flex-grow min-w-0">
          <h3 className="text-lg font-bold text-white truncate">{patient.name}</h3>
          <p className="text-sm text-gray-400">DOB: {patient.dob}</p>
          <p className="text-xs text-gray-500 truncate">{patient.conditions?.join(', ')}</p>
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