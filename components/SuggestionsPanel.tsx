import React from 'react';
import { Vital, VitalStatus } from '../types';
import { DAILY_SUGGESTIONS } from '../constants';
import { LightBulbIcon, AcademicCapIcon } from './icons';

interface SuggestionsPanelProps {
  vitals: Vital[];
}

const SuggestionsPanel: React.FC<SuggestionsPanelProps> = ({ vitals }) => {
  const dailySuggestion = DAILY_SUGGESTIONS[new Date().getDate() % DAILY_SUGGESTIONS.length];

  const getInstantSuggestion = (): { suggestion: string, isCritical: boolean } => {
    const criticalVital = vitals.find(v => v.status === VitalStatus.Critical);
    if (criticalVital) {
      return { 
        suggestion: `Your ${criticalVital.type} is critical (${criticalVital.value} ${criticalVital.unit}). Please seek immediate medical attention or use the SOS button.`,
        isCritical: true,
      };
    }
    
    const warningVital = vitals.find(v => v.status === VitalStatus.Warning);
    if (warningVital) {
      let suggestion = `Your ${warningVital.type} is in the warning range. Monitor it closely.`;
      if (warningVital.type === 'Heart Rate' && warningVital.trend === 'up') {
        suggestion += ' Try taking a few slow, deep breaths to help lower it.';
      }
      if (warningVital.type === 'Blood Pressure' && warningVital.trend === 'up') {
          suggestion += ' Please rest and avoid strenuous activity.'
      }
      return { suggestion, isCritical: false };
    }

    return { suggestion: 'Your vitals are stable. Keep up the great work!', isCritical: false };
  };

  const { suggestion: instantSuggestion, isCritical } = getInstantSuggestion();

  return (
    <div className="bg-brand-dark-accent p-4 rounded-lg shadow-lg flex flex-col h-full">
      <h3 className="text-lg font-bold text-white mb-3">Suggestions</h3>
      <div className="space-y-3 flex-grow flex flex-col">
        <div className="bg-brand-dark p-3 rounded-md">
            <div className="flex items-center text-xs font-semibold text-brand-primary mb-1">
                <AcademicCapIcon className="h-4 w-4 mr-2" />
                <span>Daily Health Tip</span>
            </div>
          <p className="text-sm text-gray-300">{dailySuggestion}</p>
        </div>
        <div className={`bg-brand-dark p-3 rounded-md flex-grow ${isCritical ? 'border-2 border-status-red animate-pulse' : ''}`}>
            <div className={`flex items-center text-xs font-semibold mb-1 ${isCritical ? 'text-status-red' : 'text-status-amber'}`}>
                <LightBulbIcon className="h-4 w-4 mr-2" />
                <span>Instant Suggestion</span>
            </div>
          <p className="text-sm text-gray-300">{instantSuggestion}</p>
        </div>
      </div>
    </div>
  );
};

export default SuggestionsPanel;