
import React, { useState } from 'react';
import { MOCK_MEDICATIONS, MOCK_MED_LOGS } from '../../constants';
import { Medication, MedicationLog } from '../../types';
import { PillIcon, CheckCircleIcon, XCircleIcon } from '../icons';
import Button from '../ui/Button';

const MedicationPanel: React.FC<{ patientId: string }> = ({ patientId }) => {
    const medications = MOCK_MEDICATIONS[patientId] || [];
    const [medLogs, setMedLogs] = useState<MedicationLog[]>(MOCK_MED_LOGS[patientId] || []);

    const handleLog = (med: Medication, status: 'taken' | 'skipped') => {
        const newLog: MedicationLog = {
            id: `ml-${Date.now()}`,
            medicationId: med.id,
            medicationName: med.name,
            timestamp: new Date(),
            status,
        };
        setMedLogs(prev => [newLog, ...prev]);
    };

    const getLastTaken = (medId: string) => {
        const lastLog = medLogs.find(log => log.medicationId === medId && log.status === 'taken');
        return lastLog ? `Last taken: ${lastLog.timestamp.toLocaleString()}` : 'No record of last dose.';
    }

    return (
        <div className="bg-brand-dark-accent p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold text-white mb-4">Medication Reminders</h3>
            {medications.length === 0 ? (
                <p className="text-gray-400">No medications prescribed.</p>
            ) : (
                <div className="space-y-4">
                    {medications.map(med => (
                        <div key={med.id} className="bg-brand-dark p-4 rounded-lg flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <PillIcon className="h-8 w-8 text-brand-primary flex-shrink-0" />
                                <div>
                                    <p className="font-bold text-white">{med.name} <span className="text-sm font-normal text-gray-300">{med.dosage}</span></p>
                                    <p className="text-xs text-gray-400">{med.schedule}</p>
                                    <p className="text-xs text-gray-500 mt-1">{getLastTaken(med.id)}</p>
                                </div>
                            </div>
                            <div className="flex space-x-2 flex-shrink-0">
                                <Button onClick={() => handleLog(med, 'taken')} size="sm" className="flex items-center gap-1">
                                    <CheckCircleIcon className="h-4 w-4" /> Taken
                                </Button>
                                <Button onClick={() => handleLog(med, 'skipped')} variant="secondary" size="sm" className="flex items-center gap-1">
                                    <XCircleIcon className="h-4 w-4" /> Skipped
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MedicationPanel;
