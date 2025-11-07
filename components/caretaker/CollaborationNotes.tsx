
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { MOCK_COLLAB_NOTES } from '../../constants';
import { CollaborationNote, UserRole } from '../../types';
import Button from '../ui/Button';
import { ChatAltIcon } from '../icons';

const CollaborationNotes: React.FC<{ patientId: string }> = ({ patientId }) => {
    const { user } = useAuth();
    const [notes, setNotes] = useState<CollaborationNote[]>(MOCK_COLLAB_NOTES[patientId] || []);
    const [newNote, setNewNote] = useState('');

    const handleAddNote = () => {
        if (!newNote.trim() || !user) return;
        const note: CollaborationNote = {
            id: `cn-${Date.now()}`,
            authorName: user.name,
            authorRole: user.role,
            timestamp: new Date(),
            note: newNote,
        };
        setNotes(prev => [note, ...prev]);
        setNewNote('');
    };

    return (
        <div className="bg-brand-dark-accent p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Collaboration Notes</h3>
            <div className="space-y-4">
                <div>
                    <textarea
                        value={newNote}
                        onChange={e => setNewNote(e.target.value)}
                        placeholder="Add an observation or update for the care team..."
                        rows={3}
                        className="w-full bg-brand-dark border border-gray-600 rounded-md p-2 text-white focus:outline-none focus:ring-2 focus:ring-brand-primary"
                    />
                    <div className="flex justify-end mt-2">
                        <Button onClick={handleAddNote} size="sm" disabled={!newNote.trim()}>Add Note</Button>
                    </div>
                </div>

                <div className="space-y-4 max-h-60 overflow-y-auto pr-2">
                    {notes.map(note => (
                        <div key={note.id} className="bg-brand-dark p-3 rounded-md">
                            <div className="flex justify-between items-center text-xs text-gray-400 mb-2">
                                <span><strong>{note.authorName}</strong> ({note.authorRole})</span>
                                <span>{note.timestamp.toLocaleString()}</span>
                            </div>
                            <p className="text-sm text-gray-300">{note.note}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CollaborationNotes;
