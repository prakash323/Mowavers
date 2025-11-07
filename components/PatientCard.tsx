import React from 'react';
import { User, VitalStatus, Coordinates } from '../types';
import { useMockVitals } from '../hooks/useMockVitals';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon, MapIcon } from './icons';
import { MOCK_EWS, MOCK_PATIENTS } from '../constants';
import { calculateDistance } from '../utils/location';

interface PatientCardProps {
  patient: User;
  onSelect: (patientId: string) => void;
  currentUserLocation?: Coordinates | null;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onSelect, currentUserLocation }) => {
  const { vitals } = useMockVitals(patient.id);
  const ews = MOCK_EWS[patient.id];
  const patientData = MOCK_PATIENTS[patient.id];
  
  const statusClasses = {
      Low: { bg: 'bg-status-green/10', text: 'text-status-green', border: 'border-status-green/30' },
      Medium: { bg: 'bg-status-amber/10', text: 'text-status-amber', border: 'border-status-amber/30' },
      High: { bg: 'bg-status-red/10', text: 'text-status-red', border: 'border-status-red/30 animate-pulse' },
  };

  const currentStatus = ews?.level || 'Low';
  
  const trendIcon = (trend: 'up' | 'down' | 'stable') => {
    switch (trend) {
        case 'up': return <ArrowUpIcon className="h-4 w-4" />;
        case 'down': return <ArrowDownIcon className="h-4 w-4" />;
        default: return <MinusIcon className="h-4 w-4" />;
    }
  }

  const distance = currentUserLocation && patientData?.coordinates 
    ? calculateDistance(currentUserLocation, patientData.coordinates).toFixed(1)
    : null;

  return (
    <div className={`bg-brand-dark-accent rounded-lg shadow-lg p-4 border-l-4 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] cursor-pointer ${statusClasses[currentStatus].border}`} onClick={() => onSelect(patient.id)}>
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-white">{patient.name}</h3>
        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusClasses[currentStatus].bg} ${statusClasses[currentStatus].text}`}>
          EWS: {currentStatus} ({ews?.score})
        </span>
      </div>
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-400">Patient ID: {patient.id}</p>
        {distance && (
            <div className="flex items-center space-x-1 text-xs text-brand-primary">
                <MapIcon className="h-4 w-4" />
                <span>{distance} mi away</span>
            </div>
        )}
      </div>
      
      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        {vitals.slice(0, 4).map(vital => (
          <div key={vital.type} className="flex items-center justify-between text-gray-300">
            <span className="text-gray-400">{vital.type.replace(' Rate', '')}:</span>
            <div className="flex items-center space-x-1">
                <span>{vital.value} <span className="text-xs text-gray-500">{vital.unit}</span></span>
                <span className={vital.status !== VitalStatus.Normal ? 'text-status-amber' : 'text-gray-500'}>{trendIcon(vital.trend)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientCard;