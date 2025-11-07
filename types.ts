
export enum UserRole {
  Patient = 'Patient',
  Caretaker = 'Caretaker',
  Doctor = 'Doctor',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
}

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Patient extends User {
  role: UserRole.Patient;
  dob: string;
  conditions?: string[];
  coordinates?: Coordinates;
  avatarUrl?: string;
}

export enum VitalStatus {
    Normal = 'Normal',
    Warning = 'Warning',
    Critical = 'Critical',
}

export type VitalType = 'Heart Rate' | 'SpO2' | 'Blood Pressure' | 'Respiration Rate' | 'Temperature' | 'ECG';

export interface Vital {
    type: VitalType;
    value: number;
    unit: string;
    status: VitalStatus;
    trend: 'up' | 'down' | 'stable';
    timestamp: Date;
    baseline: string;
}

export interface HistoricalVitalReading {
    eventType: 'vital';
    id: string;
    timestamp: Date;
    type: VitalType;
    value: number;
    unit: string;
    status: VitalStatus;
}

export interface Alert {
    id: string;
    eventType: 'alert';
    patientId: string;
    patientName: string;
    message: string;
    timestamp: Date;
    acknowledged: boolean;
    type: 'vital' | 'sos' | 'check-in';
}

export enum StressLevel {
    Low = "Low",
    Moderate = "Moderate",
    High = "High",
    VeryHigh = "Very High",
}

export interface MoodLog {
    eventType: 'mood';
    id: string;
    timestamp: Date;
    mood: string;
    stress: StressLevel;
}

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    schedule: string;
}

export interface MedicationLog {
    eventType: 'medication';
    id: string;
    medicationId: string;
    medicationName: string;
    timestamp: Date;
    status: 'taken' | 'skipped';
}

export interface VoiceNote {
    eventType: 'voice';
    id: string;
    timestamp: Date;
    summary: string;
}

export interface CollaborationNote {
    eventType: 'note';
    id: string;
    timestamp: Date;
    authorName: string;
    authorRole: UserRole;
    note: string;
}


export type TimelineEvent = Alert | HistoricalVitalReading | MoodLog | MedicationLog | VoiceNote | CollaborationNote;

export interface Place {
    id: string;
    name: string;
    type: 'hospital' | 'store';
    address: string;
    phone: string;
    coordinates: Coordinates;
}

export interface EWScore {
    score: number;
    level: 'Low' | 'Medium' | 'High';
    timestamp: Date;
}