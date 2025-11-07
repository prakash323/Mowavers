
import React, { useState } from 'react';
import { StressLevel } from '../../types';
import Button from '../ui/Button';

const moods = [
    { mood: 'Happy', emoji: '😊' },
    { mood: 'Content', emoji: '🙂' },
    { mood: 'Neutral', emoji: '😐' },
    { mood: 'Sad', emoji: '😔' },
    { mood: 'Anxious', emoji: '😟' },
] as const;

type Mood = typeof moods[number]['mood'];

const MoodTracker: React.FC<{ patientId: string }> = ({ patientId }) => {
    const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
    const [stressLevel, setStressLevel] = useState<StressLevel>(StressLevel.Low);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = () => {
        if (!selectedMood) return;
        console.log(`Submitted for patient ${patientId}: Mood - ${selectedMood}, Stress - ${stressLevel}`);
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setSelectedMood(null);
        }, 3000);
    }

    if (submitted) {
        return (
             <div className="bg-brand-dark-accent p-4 rounded-lg shadow-lg flex flex-col justify-center items-center h-full">
                <p className="text-status-green font-semibold">Thank you!</p>
                <p className="text-gray-400 text-sm">Your feelings have been logged.</p>
            </div>
        )
    }

    return (
        <div className="bg-brand-dark-accent p-4 rounded-lg shadow-lg">
            <h4 className="text-base font-bold text-white mb-3">How are you feeling now?</h4>
            <div className="flex justify-around items-center mb-4">
                {moods.map(({ mood, emoji }) => (
                    <button 
                        key={mood}
                        onClick={() => setSelectedMood(mood)}
                        className={`text-3xl p-2 rounded-full transition-transform duration-200 ${selectedMood === mood ? 'bg-brand-primary/30 scale-125' : 'hover:scale-110'}`}
                        aria-label={mood}
                    >
                        {emoji}
                    </button>
                ))}
            </div>
            <div className="mb-4">
                 <label className="block text-sm text-gray-400 mb-2">Stress Level</label>
                 <select 
                    value={stressLevel} 
                    onChange={e => setStressLevel(e.target.value as StressLevel)}
                    className="w-full bg-brand-dark border border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-primary text-white text-sm"
                >
                    {Object.values(StressLevel).map(level => <option key={level} value={level}>{level}</option>)}
                 </select>
            </div>
            <Button onClick={handleSubmit} disabled={!selectedMood} className="w-full" size="sm">Log Feelings</Button>
        </div>
    );
};

export default MoodTracker;
