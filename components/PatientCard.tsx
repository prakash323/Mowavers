
import React from 'react';
import { Patient, Vital, VitalStatus } from '../types';
import { useMockVitals } from '../hooks/useMockVitals';
import Spinner from './ui/Spinner';
import { LocationMarkerIcon, HeartIcon } from './icons';

interface PatientCardProps {
  patient: Patient;
  onSelect: (patientId: string) => void;
}

const PatientCard: React.FC<PatientCardProps> = ({ patient, onSelect }) => {
  const { vitals, loading } = useMockVitals(patient.id);

  const getOverallStatus = (currentVitals: Vital[]): VitalStatus => {
    if (currentVitals.some(v => v.status === VitalStatus.Critical)) return VitalStatus.Critical;
    if (currentVitals.some(v => v.status === VitalStatus.Warning)) return VitalStatus.Warning;
    return VitalStatus.Normal;
  };

  const status = loading ? patient.status : getOverallStatus(vitals);

  const statusClasses: Record<VitalStatus, { bg: string, text: string, border: string }> = {
    [VitalStatus.Normal]: { bg: 'bg-status-green/10', text: 'text-status-green', border: 'border-status-green' },
    [VitalStatus.Warning]: { bg: 'bg-status-amber/10', text: 'text-status-amber', border: 'border-status-amber' },
    [VitalStatus.Critical]: { bg: 'bg-status-red/10', text: 'text-status-red animate-pulse', border: 'border-status-red' },
  };

  const currentStatus = statusClasses[status];
  const heartRate = vitals.find(v => v.type === 'HR');

  return (
    <div
      onClick={() => onSelect(patient.id)}
      className={`bg-brand-dark-accent rounded-lg p-4 shadow-lg border-2 border-transparent hover:border-brand-primary cursor-pointer transition-all duration-300 flex flex-col justify-between ${currentStatus.border}`}
    >
      <div>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-white">{patient.name}</h3>
            <p className="text-sm text-gray-400">Age: {patient.age}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-semibold rounded-full ${currentStatus.bg} ${currentStatus.text}`}>
            {status}
          </span>
        </div>
        <div className="text-sm text-gray-500 mt-2 flex items-center">
          <LocationMarkerIcon className="h-4 w-4 mr-1"/>
          {patient.location}
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700">
        {loading ? <div className="flex justify-center items-center h-8"><Spinner /></div> : (
          <div className="flex justify-between items-center text-sm">
              <div className="flex items-center text-gray-300">
                <HeartIcon className="h-5 w-5 mr-2 text-status-red" />
                <span>{heartRate?.value || 'N/A'} {heartRate?.unit}</span>
              </div>
              <button className="text-brand-primary hover:underline">View Details</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientCard;
