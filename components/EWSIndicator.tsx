
import React from 'react';
import { EWScore } from '../types';

interface EWSIndicatorProps {
  ews: EWScore;
}

const EWSIndicator: React.FC<EWSIndicatorProps> = ({ ews }) => {
  const { score, level, timestamp } = ews;

  const levelConfig = {
    Low: { barColor: 'bg-status-green', textColor: 'text-status-green', label: 'Low Risk' },
    Medium: { barColor: 'bg-status-amber', textColor: 'text-status-amber', label: 'Medium Risk' },
    High: { barColor: 'bg-status-red', textColor: 'text-status-red', label: 'High Risk' },
  };

  const config = levelConfig[level] || levelConfig.Low;

  return (
    <div className="bg-brand-dark-accent p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-2">
        <h4 className="text-sm font-bold text-gray-300">Early Warning Score (EWS)</h4>
        <span className={`font-bold text-lg ${config.textColor}`}>{score}</span>
      </div>
      <div className="w-full bg-brand-dark rounded-full h-2.5">
        <div 
          className={`${config.barColor} h-2.5 rounded-full`} 
          style={{ width: `${Math.min(100, (score / 10) * 100)}%` }} // Assuming max score of 10
        ></div>
      </div>
      <div className="flex justify-between items-center mt-2 text-xs">
        <span className={`font-semibold ${config.textColor}`}>{config.label}</span>
        <span className="text-gray-500">Last updated: {new Date(timestamp).toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default EWSIndicator;
