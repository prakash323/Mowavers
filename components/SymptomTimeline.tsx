import React from 'react';
import { MOCK_TIMELINE } from '../constants';
import { TimelineEvent, Alert, HistoricalVitalReading, MoodLog, MedicationLog, VoiceNote, CollaborationNote } from '../types';
import { HeartIcon, BellIcon, EmojiHappyIcon, PillIcon, MicrophoneIcon, ChatAltIcon } from './icons'; // Assuming new icons

const eventConfig = {
    alert: { icon: BellIcon, color: 'text-status-red' },
    vital: { icon: HeartIcon, color: 'text-brand-primary' },
    mood: { icon: EmojiHappyIcon, color: 'text-status-amber' },
    medication: { icon: PillIcon, color: 'text-status-green' },
    voice: { icon: MicrophoneIcon, color: 'text-purple-400' },
    note: { icon: ChatAltIcon, color: 'text-gray-400' },
};

const TimelineItem: React.FC<{ event: TimelineEvent }> = ({ event }) => {
    // Use `eventType` for discrimination to align with the TimelineEvent type.
    const config = eventConfig[event.eventType] || eventConfig.note;
    const Icon = config.icon;

    const renderContent = () => {
        // Switching on `eventType` allows for correct type narrowing, resolving property access errors.
        switch (event.eventType) {
            case 'alert':
                return <p><strong>Alert:</strong> {event.message}</p>;
            case 'vital':
                return <p><strong>Vital Reading:</strong> {event.type} was {event.value} {event.unit} (<span className={event.status === 'Normal' ? 'text-green-400' : 'text-amber-400'}>{event.status}</span>)</p>;
            case 'mood':
                return <p><strong>Mood Log:</strong> Feeling {event.mood}, Stress Level: {event.stress}.</p>;
            case 'medication':
                return <p><strong>Medication:</strong> {event.medicationName} marked as {event.status}.</p>;
            case 'voice':
                return <p><strong>Voice Note Summary:</strong> "{event.summary}"</p>;
            case 'note':
                return <>
                    <p><strong>Note from {event.authorName} ({event.authorRole}):</strong></p>
                    <p className="italic text-gray-400">"{event.note}"</p>
                </>;
            default:
                return null;
        }
    };

    return (
        <div className="flex items-start space-x-4">
            <div className={`relative flex-shrink-0 w-10 h-10 rounded-full bg-brand-dark flex items-center justify-center ${config.color}`}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-grow pb-8 border-l-2 border-gray-700 ml-5 pl-8 relative">
                 <div className="absolute -left-[9px] top-2 w-4 h-4 bg-brand-primary rounded-full border-2 border-brand-dark-accent"></div>
                <div className="bg-brand-dark p-4 rounded-lg shadow-md">
                    <p className="text-xs text-gray-400 mb-2">{event.timestamp.toLocaleString()}</p>
                    <div className="text-sm text-gray-200">{renderContent()}</div>
                </div>
            </div>
        </div>
    );
};

const SymptomTimeline: React.FC<{ patientId: string }> = ({ patientId }) => {
    const timelineEvents = MOCK_TIMELINE[patientId] || [];

    if (timelineEvents.length === 0) {
        return (
            <div className="bg-brand-dark-accent p-6 rounded-lg text-center">
                <p className="text-gray-400">No timeline events recorded for this patient yet.</p>
            </div>
        );
    }

    return (
        <div>
            <h3 className="text-2xl font-bold text-white mb-6">Patient Timeline</h3>
            <div className="relative">
                {timelineEvents.map((event, index) => (
                    <TimelineItem key={`${event.eventType}-${(event as any).id || index}`} event={event} />
                ))}
            </div>
        </div>
    );
};

export default SymptomTimeline;