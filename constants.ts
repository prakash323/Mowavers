import { User, UserRole, Patient, Vital, VitalType, VitalStatus, HistoricalVitalReading, Alert, Medication, MoodLog, StressLevel, MedicationLog, VoiceNote, CollaborationNote, EWScore, TimelineEvent, Place, Coordinates } from './types';

export const MOCK_USERS: Record<UserRole, User> = {
  [UserRole.Patient]: { id: 'p1', name: 'Alex Johnson', role: UserRole.Patient },
  [UserRole.Caretaker]: { id: 'c1', name: 'Brenda Smith', role: UserRole.Caretaker, patients: ['p1'] },
  [UserRole.Doctor]: { id: 'd1', name: 'Dr. Evelyn Reed', role: UserRole.Doctor, patients: ['p1', 'p2'] },
};

export const MOCK_PATIENTS: Record<string, Patient> = {
    'p1': { 
        id: 'p1', name: 'Alex Johnson', role: UserRole.Patient, 
        conditions: ['Hypertension', 'Asthma'], 
        healthNotes: 'Patient manages hypertension with daily medication and uses an inhaler as needed for asthma.',
        coordinates: { latitude: 34.0522, longitude: -118.2437 } // Los Angeles
    },
    'p2': { 
        id: 'p2', name: 'John Appleseed', role: UserRole.Patient, 
        conditions: ['Diabetes Type 2'], 
        healthNotes: 'Recently diagnosed. Monitoring blood glucose levels closely.',
        coordinates: { latitude: 34.1522, longitude: -118.3437 } // Near LA
    },
};

export const MOCK_CARETAKER_LOCATION: Coordinates = { latitude: 34.0522, longitude: -118.4437 }; // Santa Monica
export const MOCK_DOCTOR_LOCATION: Coordinates = { latitude: 33.9522, longitude: -118.2437 }; // South LA

export const VITAL_THRESHOLDS: Record<VitalType, { warning: [number, number], critical: [number, number] }> = {
    [VitalType.HeartRate]: { warning: [55, 100], critical: [45, 120] },
    [VitalType.SpO2]: { warning: [92, 100], critical: [0, 90] },
    [VitalType.BloodPressure]: { warning: [90, 139], critical: [70, 180] }, // Systolic
    [VitalType.RespirationRate]: { warning: [10, 22], critical: [8, 28] },
    [VitalType.Temperature]: { warning: [99.5, 101], critical: [95, 103] },
};

export const INITIAL_VITALS: Record<string, Vital[]> = {
    'p1': [
        { type: VitalType.HeartRate, value: 72, unit: 'bpm', status: VitalStatus.Normal, trend: 'stable', baseline: 75 },
        { type: VitalType.SpO2, value: 98, unit: '%', status: VitalStatus.Normal, trend: 'stable', baseline: 97 },
        { type: VitalType.BloodPressure, value: 135, unit: 'mmHg', status: VitalStatus.Warning, trend: 'up', baseline: 125 },
        { type: VitalType.RespirationRate, value: 16, unit: 'rpm', status: VitalStatus.Normal, trend: 'stable', baseline: 16 },
    ],
    'p2': [
        { type: VitalType.HeartRate, value: 85, unit: 'bpm', status: VitalStatus.Normal, trend: 'up', baseline: 80 },
        { type: VitalType.SpO2, value: 96, unit: '%', status: VitalStatus.Normal, trend: 'stable', baseline: 98 },
        { type: VitalType.BloodPressure, value: 125, unit: 'mmHg', status: VitalStatus.Normal, trend: 'stable', baseline: 130 },
        { type: VitalType.RespirationRate, value: 18, unit: 'rpm', status: VitalStatus.Normal, trend: 'stable', baseline: 17 },
    ]
};

export const MOCK_ALERTS: Alert[] = [
    { id: 'a1', patientId: 'p2', patientName: 'John Appleseed', message: 'Critical: Heart rate dropped to 38 bpm.', timestamp: new Date(Date.now() - 5 * 60 * 1000), acknowledged: false, type: 'vitals' },
    { id: 'a2', patientId: 'p1', patientName: 'Alex Johnson', message: 'Warning: SpO2 fell to 91%.', timestamp: new Date(Date.now() - 10 * 60 * 1000), acknowledged: true, type: 'vitals' },
    { id: 'a3', patientId: 'p1', patientName: 'Alex Johnson', message: 'SOS button pressed by patient.', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), acknowledged: true, type: 'sos'},
    { id: 'a4', patientId: 'p1', patientName: 'Alex Johnson', message: 'High symptom severity reported in weekly check-in.', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), acknowledged: true, type: 'check-in'},
];

export const MOCK_MEDICATIONS: Record<string, Medication[]> = {
    'p1': [
        { id: 'med1', name: 'Lisinopril', dosage: '10mg', schedule: 'Once daily in the morning' },
        { id: 'med2', name: 'Albuterol Inhaler', dosage: '2 puffs', schedule: 'As needed for shortness of breath' },
    ],
    'p2': [
        { id: 'med3', name: 'Metformin', dosage: '500mg', schedule: 'Twice daily with meals' },
    ]
};

export const MOCK_MED_LOGS: Record<string, MedicationLog[]> = {
    'p1': [
        { id: 'ml1', medicationId: 'med1', medicationName: 'Lisinopril', timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), status: 'taken'},
        { id: 'ml2', medicationId: 'med1', medicationName: 'Lisinopril', timestamp: new Date(Date.now() - 28 * 60 * 60 * 1000), status: 'taken'},
        { id: 'ml3', medicationId: 'med2', medicationName: 'Albuterol Inhaler', timestamp: new Date(Date.now() - 48 * 60 * 60 * 1000), status: 'taken'},
    ]
};

export const MOCK_MOOD_LOGS: Record<string, MoodLog[]> = {
    'p1': [
        { id: 'mood1', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), mood: 'Content', stress: StressLevel.Low },
        { id: 'mood2', timestamp: new Date(Date.now() - 30 * 60 * 60 * 1000), mood: 'Anxious', stress: StressLevel.High },
    ]
};

export const MOCK_VOICE_NOTES: Record<string, VoiceNote[]> = {
    'p1': [
        { id: 'vn1', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000), summary: 'Patient reported feeling light-headed after walking up the stairs, but it subsided after a few minutes of rest.'}
    ]
};

export const MOCK_COLLAB_NOTES: Record<string, CollaborationNote[]> = {
    'p1': [
        { id: 'cn1', authorName: 'Brenda Smith', authorRole: UserRole.Caretaker, timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), note: 'Alex seemed a bit tired today but spirits are good. Ensured he took his morning medication.'}
    ]
};

export const MOCK_EWS: Record<string, EWScore> = {
    'p1': { score: 3, level: 'Medium', timestamp: new Date() },
    'p2': { score: 1, level: 'Low', timestamp: new Date() },
};

export const MOCK_TIMELINE: Record<string, TimelineEvent[]> = {
    'p1': [
// FIX: Added `as const` to eventType properties to ensure TypeScript infers the literal types, resolving the assignment error.
        { eventType: 'alert' as const, ...MOCK_ALERTS[1] },
        { eventType: 'mood' as const, ...MOCK_MOOD_LOGS['p1'][0] },
        { eventType: 'medication' as const, ...MOCK_MED_LOGS['p1'][0] },
        { eventType: 'note' as const, ...MOCK_COLLAB_NOTES['p1'][0] },
        { eventType: 'voice' as const, ...MOCK_VOICE_NOTES['p1'][0] },
    ].sort((a,b) => b.timestamp.getTime() - a.timestamp.getTime())
};

export const MOCK_PLACES: Place[] = [
    { id: 'h1', name: 'Cedars-Sinai Medical Center', type: 'hospital', address: '8700 Beverly Blvd, Los Angeles', phone: '(310) 423-3277', coordinates: { latitude: 34.0760, longitude: -118.3813 }},
    { id: 'h2', name: 'UCLA Medical Center', type: 'hospital', address: '757 Westwood Plaza, Los Angeles', phone: '(310) 825-9111', coordinates: { latitude: 34.0648, longitude: -118.4442 }},
    { id: 's1', name: 'CVS Pharmacy', type: 'store', address: '8490 Beverly Blvd, Los Angeles', phone: '(310) 659-3957', coordinates: { latitude: 34.0765, longitude: -118.3753 }},
    { id: 's2', name: 'Walgreens Pharmacy', type: 'store', address: '1234 N La Brea Ave, West Hollywood', phone: '(323) 876-2484', coordinates: { latitude: 34.0950, longitude: -118.3444 }},
];

export const DAILY_SUGGESTIONS = [
  "Remember to stay hydrated! Drinking enough water is key for cardiovascular health.",
  "A short 10-minute walk can boost your mood and improve circulation. Consider a stroll if you're feeling up to it.",
  "Mindful breathing can help lower stress. Try taking 5 deep, slow breaths right now.",
  "Make sure your meals include some leafy greens today. They're packed with essential nutrients.",
  "Getting 7-8 hours of sleep is vital for recovery and overall health. Aim for a consistent bedtime tonight."
];

export const HEALTH_CONDITIONS = [
    "Hypertension", "Asthma", "Diabetes Type 1", "Diabetes Type 2", "Coronary Artery Disease", "COPD", "Atrial Fibrillation", "Sleep Apnea"
];

export const CHECKIN_QUESTIONS: Record<string, { question: string; isCritical: (answer: string) => boolean }> = {
    "Hypertension": { question: "Have you experienced any severe headaches, dizziness, or blurred vision?", isCritical: answer => /yes|severe|dizzy|blurred/i.test(answer) },
    "Asthma": { question: "Have you had to use your rescue inhaler more than usual, or experienced severe shortness of breath?", isCritical: answer => /yes|more|severe|breathless/i.test(answer) },
    "Diabetes Type 2": { question: "Have you had any episodes of extreme thirst, fatigue, or confusion?", isCritical: answer => /yes|extreme|thirst|fatigue|confusion/i.test(answer) },
    "Default": { question: "Have you experienced any new or concerning symptoms this week?", isCritical: answer => /yes|concerning|new|bad/i.test(answer) },
};