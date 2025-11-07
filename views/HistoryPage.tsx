import React, { useState, useMemo } from 'react';
import { useAuth } from '../hooks/useAuth';
import { MOCK_TIMELINE } from '../constants';
import { TimelineEvent, HistoricalVitalReading } from '../types';
import HistoricalChart from '../components/HistoricalChart';
import { HeartIcon, BellIcon, EmojiHappyIcon, PillIcon, MicrophoneIcon, ChatAltIcon, SparklesIcon } from '../components/icons';

const eventConfig: Record<string, { icon: React.FC<any>, color: string, label: string }> = {
    all: { icon: SparklesIcon, color: 'text-brand-primary', label: 'All Events' },
    alert: { icon: BellIcon, color: 'text-status-red', label: 'Alerts' },
    vital: { icon: HeartIcon, color: 'text-brand-primary', label: 'Vitals' },
    mood: { icon: EmojiHappyIcon, color: 'text-status-amber', label: 'Moods' },
    medication: { icon: PillIcon, color: 'text-status-green', label: 'Medications' },
    voice: { icon: MicrophoneIcon, color: 'text-purple-400', label: 'Voice Notes' },
    note: { icon: ChatAltIcon, color: 'text-gray-400', label: 'Notes' },
};

const HistoryTimelineItem: React.FC<{ event: TimelineEvent }> = ({ event }) => {
    const config = eventConfig[event.eventType];
    const Icon = config.icon;

    const renderContent = () => {
        switch (event.eventType) {
            case 'alert': return <p><strong>Alert:</strong> {event.message}</p>;
            case 'vital': return <p><strong>Vital Reading:</strong> {event.type} was {event.value} {event.unit} ({event.status})</p>;
            case 'mood': return <p><strong>Mood Log:</strong> Feeling {event.mood}, Stress: {event.stress}.</p>;
            case 'medication': return <p><strong>Medication:</strong> {event.medicationName} marked as {event.status}.</p>;
            case 'voice': return <p><strong>Voice Note:</strong> "{event.summary}"</p>;
            case 'note': return <p><strong>Note from {event.authorRole} {event.authorName}:</strong> "{event.note}"</p>;
            default: return null;
        }
    };
    
    return (
        <div className="flex items-center space-x-4 p-3 bg-white dark:bg-brand-dark-accent rounded-lg shadow">
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${config.color} bg-opacity-20`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-grow text-sm text-brand-text-light dark:text-gray-300">
                {renderContent()}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                {event.timestamp.toLocaleDateString()}
            </div>
        </div>
    );
};


const HistoryPage: React.FC = () => {
    const { user } = useAuth();
    const [filter, setFilter] = useState('all');

    if (!user) {
        return <div>Loading...</div>; // Should not happen if page is protected
    }
    
    if (user.role === 'Caretaker' || user.role === 'Doctor') {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold text-brand-text-light dark:text-white">Patient History</h2>
                <p className="mt-4 text-gray-500 dark:text-gray-400">Please select a patient from your dashboard to view their detailed history and timeline.</p>
            </div>
        );
    }
    
    // For Patient role
    const patientId = user.id;
    const allEvents = MOCK_TIMELINE[patientId] || [];
    const vitalEvents = allEvents.filter(e => e.eventType === 'vital') as HistoricalVitalReading[];

    const filteredEvents = useMemo(() => {
        if (filter === 'all') return allEvents;
        return allEvents.filter(e => e.eventType === filter);
    }, [allEvents, filter]);


    return (
        <div className="animate-fade-in space-y-6">
            <h2 className="text-3xl font-bold text-brand-text-light dark:text-white">Your Health History</h2>
            
            <HistoricalChart data={vitalEvents} />

            <div>
                <h3 className="text-xl font-bold text-brand-text-light dark:text-white mb-4">Event Timeline</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                    {Object.entries(eventConfig).map(([key, config]) => (
                        <button 
                            key={key}
                            onClick={() => setFilter(key)}
                            className={`px-3 py-1 text-sm rounded-full flex items-center gap-2 transition-colors ${filter === key ? 'bg-brand-primary text-white' : 'bg-white dark:bg-brand-dark-accent text-brand-text-light dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-brand-dark'}`}
                        >
                           <config.icon className="w-4 h-4" /> 
                           {config.label}
                        </button>
                    ))}
                </div>
                <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
                    {filteredEvents.length > 0 ? (
                        filteredEvents.map((event, index) => <HistoryTimelineItem key={`${event.eventType}-${(event as any).id || index}`} event={event} />)
                    ) : (
                        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                            No events found for this filter.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HistoryPage;
