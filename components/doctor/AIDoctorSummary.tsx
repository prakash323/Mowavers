
import React, { useState, useEffect } from 'react';
import { Patient } from '../../types';
import { generateDoctorSummary } from '../../services/geminiService';
import { useMockVitals } from '../../hooks/useMockVitals';
import { MOCK_TIMELINE } from '../../constants';
import Spinner from '../ui/Spinner';
import { SparklesIcon } from '../icons';

interface AIDoctorSummaryProps {
  patient: Patient;
}

const AIDoctorSummary: React.FC<AIDoctorSummaryProps> = ({ patient }) => {
  const [summary, setSummary] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { vitals } = useMockVitals(patient.id);
  const timeline = MOCK_TIMELINE[patient.id] || [];

  useEffect(() => {
    const fetchSummary = async () => {
      if (vitals.length > 0) {
        setIsLoading(true);
        const result = await generateDoctorSummary(patient, vitals, timeline);
        setSummary(result);
        setIsLoading(false);
      }
    };
    fetchSummary();
  }, [patient, vitals]);

  return (
    <div className="bg-brand-dark-accent p-6 rounded-lg shadow-lg">
      <div className="flex items-center mb-4">
        <SparklesIcon className="h-6 w-6 text-brand-primary mr-3" />
        <h3 className="text-xl font-bold text-white">AI Clinical Summary</h3>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center p-8">
          <Spinner />
          <span className="ml-3 text-gray-400">Analyzing patient data...</span>
        </div>
      ) : (
        <div className="text-gray-300 text-sm whitespace-pre-wrap font-mono">
            {summary}
        </div>
      )}
    </div>
  );
};

export default AIDoctorSummary;
