import React from 'react';
import { Vital, VitalStatus } from '../types';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from './icons';

interface MiniVitalTrendProps {
  vital: Vital;
}

const MiniVitalTrend: React.FC<MiniVitalTrendProps> = ({ vital }) => {
  const statusColors: Record<VitalStatus, string> = {
      [VitalStatus.Normal]: 'text-status-green',
      [VitalStatus.Warning]: 'text-status-amber',
      [VitalStatus.Critical]: 'text-status-red animate-pulse',
  };

  const trendIcon = {
      up: <ArrowUpIcon className="h-3 w-3 text-status-amber" />,
      down: <ArrowDownIcon className="h-3 w-3 text-status-amber" />,
      stable: <MinusIcon className="h-3 w-3 text-gray-500" />,
  }[vital.trend];

  return (
      <div className="bg-brand-dark p-2 rounded-md text-xs">
          <div className="flex justify-between items-center text-gray-400">
              <span>{vital.type}</span>
              {trendIcon}
          </div>
          <div className={`mt-1 text-lg font-bold ${statusColors[vital.status]}`}>
              {vital.value}
              <span className="text-xs ml-1 text-gray-400 font-normal">{vital.unit}</span>
          </div>
      </div>
  );
};

export default MiniVitalTrend;
