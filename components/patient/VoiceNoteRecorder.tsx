
import React, { useState } from 'react';
import { MicrophoneIcon } from '../icons';
import Button from '../ui/Button';
import { summarizeVoiceNote } from '../../services/geminiService';
import Spinner from '../ui/Spinner';

const VoiceNoteRecorder: React.FC<{ patientId: string }> = ({ patientId }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [summary, setSummary] = useState('');

    const handleRecord = async () => {
        if (isRecording) {
            // Stop recording
            setIsRecording(false);
            setIsProcessing(true);
            
            // Simulate API call with mock transcription
            const mockTranscription = "I felt a bit dizzy after standing up too quickly this morning, but it passed after a moment. Also, my breathing feels a little tight today.";
            const generatedSummary = await summarizeVoiceNote(mockTranscription);
            
            setSummary(generatedSummary);
            setIsProcessing(false);
        } else {
            // Start recording
            setSummary('');
            setIsRecording(true);
        }
    };

    return (
        <div className="bg-brand-dark-accent p-4 rounded-lg shadow-lg flex flex-col items-center justify-center text-center h-full">
            <h4 className="text-base font-bold text-white mb-3">Leave a Voice Note</h4>
            <p className="text-xs text-gray-400 mb-4">Record a short message about your symptoms for your doctor.</p>
            <Button onClick={handleRecord} variant={isRecording ? 'danger' : 'primary'} className="rounded-full w-20 h-20 flex items-center justify-center">
                {isRecording ? <div className="w-8 h-8 bg-white rounded-md"></div> : <MicrophoneIcon className="h-10 w-10" />}
            </Button>
            <p className={`mt-3 text-sm font-semibold ${isRecording ? 'text-status-red animate-pulse' : 'text-gray-400'}`}>
                {isRecording ? 'Recording...' : 'Tap to Record'}
            </p>

            {isProcessing && <div className="mt-4"><Spinner /> <p className="text-xs text-gray-400">Generating summary...</p></div>}

            {summary && (
                <div className="mt-4 text-left w-full bg-brand-dark p-3 rounded-md">
                    <p className="text-xs font-bold text-gray-300">AI Summary:</p>
                    <p className="text-xs text-gray-400 italic">"{summary}"</p>
                </div>
            )}
        </div>
    );
};

export default VoiceNoteRecorder;
