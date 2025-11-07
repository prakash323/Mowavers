import React from 'react';
import { Vital, VitalStatus } from '../types';
import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from './icons';

interface VitalCardProps {
  vital: Vital;
}

const VitalCard: React.FC<VitalCardProps> = ({ vital }) => {
  const statusColors: Record<VitalStatus, string> = {
    [VitalStatus.Normal]: 'border-status-green',
    [VitalStatus.Warning]: 'border-status-amber',
    [VitalStatus.Critical]: 'border-status-red animate-pulse',
  };

  const trendIcon = {
    up: <ArrowUpIcon className="h-4 w-4 text-status-amber" />,
    down: <ArrowDownIcon className="h-4 w-4 text-status-amber" />,
    stable: <MinusIcon className="h-4 w-4 text-gray-400" />,
  }[vital.trend];

  return (
    <div className={`bg-white dark:bg-brand-dark-accent rounded-lg p-4 border-l-4 ${statusColors[vital.status]} shadow-lg flex flex-col justify-between h-full`}>
      <div>
        <div className="flex justify-between items-center text-sm text-gray-500 dark:text-gray-400">
          <span>{vital.type}</span>
          {trendIcon}
        </div>
        <div className="text-3xl font-bold text-brand-text-light dark:text-white my-2">
          {vital.value}
          <span className="text-lg ml-1 text-gray-600 dark:text-gray-300">{vital.unit}</span>
        </div>
      </div>
      <div className="text-xs text-gray-500">
        Baseline: {vital.baseline} {vital.unit}
      </div>
    </div>
  );
};

export default VitalCard;
