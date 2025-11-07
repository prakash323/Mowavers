import React, { useState } from 'react';
import Modal from './Modal';
import Button from './ui/Button';
import Spinner from './ui/Spinner';
import { summarizeVoiceNote } from '../services/geminiService'; // Reusing for summary
import { useAuth } from '../hooks/useAuth';
import { MOCK_PATIENTS, CHECKIN_QUESTIONS } from '../constants';
import { Patient, Alert } from '../types';

interface WeeklyCheckinModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const WeeklyCheckinModal: React.FC<WeeklyCheckinModalProps> = ({ isOpen, onClose }) => {
  const { user, addAlert } = useAuth();
  const patient = user ? (MOCK_PATIENTS[user.id] as Patient) : null;
  
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const questions = patient?.conditions?.map(condition => ({
      condition,
      ...CHECKIN_QUESTIONS[condition]
  })) || [{ condition: 'Default', ...CHECKIN_QUESTIONS['Default'] }];

  const handleAnswerChange = (condition: string, value: string) => {
    setAnswers(prev => ({ ...prev, [condition]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    let hasCriticalSymptom = false;
    let summaryText = `Patient ${user?.name} weekly check-in:\n`;

    for (const q of questions) {
        const answer = answers[q.condition] || 'No answer provided.';
        summaryText += `- ${q.question}: ${answer}\n`;
        if (q.isCritical(answer)) {
            hasCriticalSymptom = true;
        }
    }
    
    if (hasCriticalSymptom) {
        const aiSummary = await summarizeVoiceNote(`The patient reported the following during their weekly check-in: ${summaryText}`);
        // FIX: Add missing eventType property to align with the Alert type.
        const newAlert: Alert = {
            id: `checkin-${Date.now()}`,
            eventType: 'alert',
            patientId: user!.id,
            patientName: user!.name,
            message: `High symptom severity reported. AI Summary: ${aiSummary}`,
            timestamp: new Date(),
            acknowledged: false,
            type: 'check-in'
        };
        addAlert(newAlert);
    }
    
    setIsLoading(false);
    setSubmitted(true);
  };
  
  const handleClose = () => {
    setAnswers({});
    setSubmitted(false);
    onClose();
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Weekly Check-in">
        {!submitted ? (
            <div className="space-y-4">
                <p className="text-gray-400 text-sm">Please answer the following questions based on your health over the past week.</p>
                {questions.map(({ condition, question }) => (
                    <div key={condition}>
                        <label htmlFor={condition} className="block text-sm font-medium text-gray-300 mb-2">{question}</label>
                        <textarea 
                            id={condition} 
                            value={answers[condition] || ''}
                            onChange={e => handleAnswerChange(condition, e.target.value)}
                            rows={3} 
                            className="w-full bg-brand-dark border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary" 
                        />
                    </div>
                ))}
                <div className="flex justify-end pt-4">
                    <Button onClick={handleSubmit} disabled={isLoading}>
                    {isLoading ? <Spinner/> : 'Submit Check-in'}
                    </Button>
                </div>
            </div>
        ) : (
            <div>
                <h3 className="text-lg font-semibold text-white mb-2 text-center">Thank You!</h3>
                <p className="text-gray-300 text-center mb-6">Your weekly check-in has been submitted and sent to your care team. If you reported any serious symptoms, your doctor and caretaker have been alerted.</p>
                <div className="flex justify-center">
                    <Button onClick={handleClose}>Close</Button>
                </div>
            </div>
        )}
    </Modal>
  );
};

export default WeeklyCheckinModal;