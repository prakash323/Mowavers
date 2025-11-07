import { Patient, Vital, VitalStatus, VitalType, Place, EWScore, TimelineEvent, Medication, MedicationLog, CollaborationNote, UserRole, Alert, StressLevel, HistoricalVitalReading, MoodLog } from './types';

export const MOCK_PATIENTS: Record<string, Patient> = {
    'patient-1': {
        id: 'patient-1',
        name: 'John Doe',
        role: UserRole.Patient,
        dob: '1960-05-15',
        conditions: ['Hypertension', 'COPD'],
        coordinates: { latitude: 34.0522, longitude: -118.2437 }
    },
    'patient-2': {
        id: 'patient-2',
        name: 'Jane Smith',
        role: UserRole.Patient,
        dob: '1955-08-20',
        conditions: ['Diabetes Type 2'],
        coordinates: { latitude: 34.0622, longitude: -118.2537 }
    },
    'patient-3': {
        id: 'patient-3',
        name: 'Robert Johnson',
        role: UserRole.Patient,
        dob: '1972-01-30',
        conditions: ['Asthma'],
        coordinates: { latitude: 34.0422, longitude: -118.2337 }
    },
};

export const INITIAL_VITALS: Record<string, Vital[]> = {
    'patient-1': [
        { type: 'Heart Rate', value: 78, unit: 'bpm', status: VitalStatus.Normal, trend: 'stable', timestamp: new Date(), baseline: '60-100' },
        { type: 'SpO2', value: 97, unit: '%', status: VitalStatus.Normal, trend: 'stable', timestamp: new Date(), baseline: '95-100' },
        { type: 'Blood Pressure', value: 135, unit: 'mmHg', status: VitalStatus.Warning, trend: 'up', timestamp: new Date(), baseline: '120/80' },
        { type: 'Respiration Rate', value: 16, unit: 'breaths/min', status: VitalStatus.Normal, trend: 'stable', timestamp: new Date(), baseline: '12-20' },
    ],
    'patient-2': [
        { type: 'Heart Rate', value: 85, unit: 'bpm', status: VitalStatus.Normal, trend: 'stable', timestamp: new Date(), baseline: '60-100' },
        { type: 'SpO2', value: 98, unit: '%', status: VitalStatus.Normal, trend: 'stable', timestamp: new Date(), baseline: '95-100' },
        { type: 'Blood Pressure', value: 125, unit: 'mmHg', status: VitalStatus.Normal, trend: 'stable', timestamp: new Date(), baseline: '130/85' },
        { type: 'Respiration Rate', value: 18, unit: 'breaths/min', status: VitalStatus.Normal, trend: 'stable', timestamp: new Date(), baseline: '12-20' },
    ],
    'patient-3': [
        { type: 'Heart Rate', value: 95, unit: 'bpm', status: VitalStatus.Warning, trend: 'up', timestamp: new Date(), baseline: '60-100' },
        { type: 'SpO2', value: 92, unit: '%', status: VitalStatus.Warning, trend: 'down', timestamp: new Date(), baseline: '94-100' },
        { type: 'Blood Pressure', value: 118, unit: 'mmHg', status: VitalStatus.Normal, trend: 'stable', timestamp: new Date(), baseline: '120/80' },
        { type: 'Respiration Rate', value: 22, unit: 'breaths/min', status: VitalStatus.Warning, trend: 'up', timestamp: new Date(), baseline: '12-20' },
    ]
};

export const VITAL_THRESHOLDS: Record<VitalType, { warning: [number, number], critical: [number, number] }> = {
    'Heart Rate': { warning: [50, 110], critical: [40, 130] },
    'SpO2': { warning: [92, 101], critical: [0, 90] },
    'Blood Pressure': { warning: [130, 139], critical: [140, 300] }, // Simplified to systolic
    'Respiration Rate': { warning: [10, 24], critical: [8, 28] },
    'Temperature': { warning: [99.5, 102], critical: [95, 103] },
    'ECG': { warning: [0, 0], critical: [0, 0] }, // Status for ECG is handled differently
};

export const MOCK_EWS: Record<string, EWScore> = {
    'patient-1': { score: 3, level: 'Low', timestamp: new Date() },
    'patient-2': { score: 1, level: 'Low', timestamp: new Date() },
    'patient-3': { score: 7, level: 'High', timestamp: new Date() },
};

export const DAILY_SUGGESTIONS = [
    "Remember to stay hydrated! Drinking enough water is crucial for cardiovascular health.",
    "A short walk can do wonders for your circulation and mood. Aim for 15-20 minutes if you feel up to it.",
    "Make sure you're taking your medications at the same time each day to maintain their effectiveness.",
    "A balanced diet rich in fruits and vegetables supports overall health. What colorful food can you add to your plate today?",
    "Good sleep is essential for recovery and health. Try to create a relaxing bedtime routine tonight."
];

export const MOCK_PLACES: Place[] = [
    { id: 'hosp-1', name: 'St. Jude Medical Center', type: 'hospital', address: '123 Health St, Los Angeles, CA', phone: '(555) 123-4567', coordinates: { latitude: 34.0530, longitude: -118.2450 } },
    { id: 'hosp-2', name: 'Good Samaritan Hospital', type: 'hospital', address: '456 Wellness Ave, Los Angeles, CA', phone: '(555) 987-6543', coordinates: { latitude: 34.0490, longitude: -118.2600 } },
    { id: 'pharm-1', name: 'CVS Pharmacy', type: 'store', address: '789 Cure Blvd, Los Angeles, CA', phone: '(555) 111-2222', coordinates: { latitude: 34.0580, longitude: -118.2400 } },
    { id: 'pharm-2', name: 'Walgreens', type: 'store', address: '101 Remedy Rd, Los Angeles, CA', phone: '(555) 333-4444', coordinates: { latitude: 34.0450, longitude: -118.2390 } },
];


export const CHECKIN_QUESTIONS: Record<string, { question: string, isCritical: (answer: string) => boolean }> = {
    'Hypertension': { question: 'Have you experienced any severe headaches, vision changes, or chest pain this week?', isCritical: (a) => /yes|headache|vision|chest pain/i.test(a) },
    'COPD': { question: 'How has your breathing been? Have you experienced more shortness of breath than usual?', isCritical: (a) => /worse|more short|harder to breathe/i.test(a) },
    'Diabetes Type 2': { question: 'Have you had any issues with your blood sugar levels or noticed any new numbness in your feet?', isCritical: (a) => /high|low|numbness/i.test(a) },
    'Asthma': { question: 'How often have you used your rescue inhaler this week?', isCritical: (a) => (parseInt(a) || 0) > 4 },
    'Default': { question: 'How have you been feeling overall this past week?', isCritical: () => false },
};

export const MOCK_MEDICATIONS: Record<string, Medication[]> = {
    'patient-1': [
        { id: 'med-1', name: 'Lisinopril', dosage: '10mg', schedule: 'Once daily' },
        { id: 'med-2', name: 'Albuterol Inhaler', dosage: 'As needed', schedule: 'For shortness of breath' },
    ],
    'patient-2': [
        { id: 'med-3', name: 'Metformin', dosage: '500mg', schedule: 'Twice daily with meals' },
    ],
    'patient-3': [],
};

export const MOCK_MED_LOGS: Record<string, MedicationLog[]> = {
    'patient-1': [
        { eventType: 'medication', id: 'ml-1', medicationId: 'med-1', medicationName: 'Lisinopril', timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), status: 'taken' },
    ],
    'patient-2': [
        { eventType: 'medication', id: 'ml-2', medicationId: 'med-3', medicationName: 'Metformin', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), status: 'taken' },
    ],
    'patient-3': [],
};

export const MOCK_COLLAB_NOTES: Record<string, CollaborationNote[]> = {
    'patient-1': [
        { eventType: 'note', id: 'cn-1', authorName: 'Sarah Connor', authorRole: UserRole.Caretaker, timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), note: "John seemed a bit more tired than usual yesterday. Monitored his vitals, they were stable." },
        { eventType: 'note', id: 'cn-2', authorName: 'Dr. Evans', authorRole: UserRole.Doctor, timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), note: "Reviewed latest vitals. BP is still slightly elevated. Continue monitoring and encourage adherence to low-sodium diet." },
    ],
    'patient-2': [],
    'patient-3': [],
};


const generateMockHistory = (patientId: string): TimelineEvent[] => {
    const history: TimelineEvent[] = [];
    const now = new Date();
    const meds = MOCK_MEDICATIONS[patientId] || [];
    
    for (let i = 30; i >= 0; i--) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        
        // Vitals (3 times a day)
        for (let j = 0; j < 3; j++) {
            const vitalTime = new Date(date.getTime() + j * 8 * 60 * 60 * 1000);
            history.push({ eventType: 'vital', id: `hv-${i}-${j}-hr`, timestamp: vitalTime, type: 'Heart Rate', value: parseFloat((70 + Math.random() * 20).toFixed(0)), unit: 'bpm', status: VitalStatus.Normal });
            history.push({ eventType: 'vital', id: `hv-${i}-${j}-spo2`, timestamp: vitalTime, type: 'SpO2', value: parseFloat((96 + Math.random() * 3).toFixed(0)), unit: '%', status: VitalStatus.Normal });
            const bpStatus = i % 5 === 0 ? VitalStatus.Warning : VitalStatus.Normal;
            history.push({ eventType: 'vital', id: `hv-${i}-${j}-bp`, timestamp: vitalTime, type: 'Blood Pressure', value: parseFloat((125 + Math.random() * 15).toFixed(0)), unit: 'mmHg', status: bpStatus });
        }
        
        // Mood Log (once a day)
        if (i % 2 === 0) {
            history.push({ eventType: 'mood', id: `mood-${i}`, timestamp: date, mood: ['Content', 'Neutral', 'Happy'][i % 3], stress: ['Low', 'Moderate'][i % 2] as StressLevel });
        }

        // Medication Log
        meds.forEach((med, medIndex) => {
            if (med.schedule.includes('daily')) {
                history.push({ eventType: 'medication', id: `ml-${i}-${medIndex}`, medicationId: med.id, medicationName: med.name, timestamp: new Date(date.getTime() + 8 * 60 * 60 * 1000), status: i % 10 === 0 ? 'skipped' : 'taken' });
            }
        });
    }

    return history;
};

export const MOCK_TIMELINE: Record<string, TimelineEvent[]> = {
    'patient-1': [
        ...generateMockHistory('patient-1'),
        MOCK_COLLAB_NOTES['patient-1'][0],
        MOCK_MED_LOGS['patient-1'][0],
        { eventType: 'mood', id: 'mood-1', timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000), mood: 'Content', stress: 'Low' } as MoodLog,
        MOCK_COLLAB_NOTES['patient-1'][1],
        { eventType: 'alert', id: 'alert-1', patientId: 'patient-1', patientName: 'John Doe', message: 'Blood pressure is high (145 mmHg)', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), acknowledged: true, type: 'vital' } as Alert,
    ].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()),
    'patient-2': [
        MOCK_MED_LOGS['patient-2'][0],
    ].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()),
    'patient-3': [
        { eventType: 'alert', id: 'alert-2', patientId: 'patient-3', patientName: 'Robert Johnson', message: 'SpO2 is critically low (88%)', timestamp: new Date(), acknowledged: false, type: 'vital' } as Alert,
    ].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime()),
};