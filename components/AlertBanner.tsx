
import React from 'react';
import { Alert, UserRole } from '../types';
import { BellIcon, CheckCircleIcon } from './icons';
import { useAuth } from '../hooks/useAuth';

interface AlertBannerProps {
  alerts: Alert[];
  onAcknowledge?: (alertId: string) => void;
}

const AlertBanner: React.FC<AlertBannerProps> = ({ alerts, onAcknowledge }) => {
  const { user } = useAuth();
  const unacknowledgedAlerts = alerts.filter(a => !a.acknowledged);

  if (unacknowledgedAlerts.length === 0) {
    return null;
  }

  const latestAlert = unacknowledgedAlerts[0];

  return (
    <div className="bg-status-red/20 border border-status-red text-status-red p-4 rounded-lg mb-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <BellIcon className="h-6 w-6 mr-3 animate-bounce" />
          <div>
            <p className="font-bold">Urgent Alert for {latestAlert.patientName}</p>
            <p className="text-sm">{latestAlert.message}</p>
            <p className="text-xs text-red-300/70 mt-1">{latestAlert.timestamp.toLocaleTimeString()}</p>
          </div>
        </div>
        {user?.role !== UserRole.Patient && onAcknowledge && (
          <button 
            onClick={() => onAcknowledge(latestAlert.id)}
            className="flex items-center bg-status-green/80 text-white px-3 py-1 rounded-md hover:bg-status-green transition-colors text-sm"
          >
            <CheckCircleIcon className="h-4 w-4 mr-1"/>
            Acknowledge
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertBanner;
