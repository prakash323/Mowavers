
import React, { useState, useEffect } from 'react';
import { getLifestyleSuggestion } from '../../services/geminiService';
import { MOCK_PATIENTS, DAILY_SUGGESTIONS } from '../../constants';
import { Patient } from '../../types';
import Spinner from '../ui/Spinner';
import { RefreshIcon } from '../icons';
import Button from '../ui/Button';

const LifestyleSuggestions: React.FC<{ patientId: string }> = ({ patientId }) => {
    const patient = MOCK_PATIENTS[patientId] as Patient;
    const [aiSuggestion, setAiSuggestion] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    
    const dailySuggestion = DAILY_SUGGESTIONS[new Date().getDate() % DAILY_SUGGESTIONS.length];

    const fetchSuggestion = async () => {
        setIsLoading(true);
        const suggestion = await getLifestyleSuggestion(patient.conditions || []);
        setAiSuggestion(suggestion);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchSuggestion();
    }, [patientId]);

    return (
        <div className="bg-brand-dark-accent p-4 rounded-lg shadow-lg h-full flex flex-col">
            <h4 className="text-base font-bold text-white mb-3">Daily Suggestions</h4>
            <div className="flex-grow space-y-3 text-sm">
                <div className="bg-brand-dark p-3 rounded-md">
                    <p className="font-semibold text-brand-primary text-xs mb-1">Daily Tip</p>
                    <p className="text-gray-300">{dailySuggestion}</p>
                </div>
                <div className="bg-brand-dark p-3 rounded-md">
                    <div className="flex justify-between items-center mb-1">
                        <p className="font-semibold text-brand-secondary text-xs">Personalized Suggestion</p>
                        <Button onClick={fetchSuggestion} disabled={isLoading} size="sm" variant="secondary" className="p-1 h-6 w-6">
                            <RefreshIcon className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                    {isLoading ? <Spinner /> : <p className="text-gray-300">{aiSuggestion}</p>}
                </div>
            </div>
        </div>
    );
};

export default LifestyleSuggestions;
