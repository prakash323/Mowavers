
export enum UserRole {
  Patient = 'Patient',
  Caretaker = 'Caretaker',
  Doctor = 'Doctor',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  patients?: string[]; // For caretakers and doctors
}

export interface Patient extends User {
    conditions?: string[];
    healthNotes?: string;
    coordinates?: Coordinates;
}

export enum VitalType {
  HeartRate = 'Heart Rate',
  SpO2 = 'SpO2',
  BloodPressure = 'Blood Pressure',
  RespirationRate = 'Respiration Rate',
  Temperature = 'Temperature',
}

export enum VitalStatus {
  Normal = 'Normal',
  Warning = 'Warning',
  Critical = 'Critical',
}

export interface Vital {
  type: VitalType;
  value: number;
  unit: string;
  status: VitalStatus;
  trend: 'up' | 'down' | 'stable';
  baseline: number;
}

export interface HistoricalVitalReading extends Omit<Vital, 'trend'> {
    timestamp: Date;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
  type: 'sos' | 'vitals' | 'fall' | 'check-in';
}

export enum StressLevel {
    Low = 'Low',
    Moderate = 'Moderate',
    High = 'High',
    VeryHigh = 'Very High'
}

export interface MoodLog {
    id: string;
    timestamp: Date;
    mood: 'Happy' | 'Content' | 'Neutral' | 'Sad' | 'Anxious';
    stress: StressLevel;
}

export interface Medication {
    id: string;
    name: string;
    dosage: string;
    schedule: string; // e.g., "Daily at 9:00 AM"
}

export interface MedicationLog {
    id: string;
    medicationId: string;
    medicationName: string;
    timestamp: Date;
    status: 'taken' | 'skipped' | 'missed';
}

export interface VoiceNote {
    id: string;
    timestamp: Date;
    audioUrl?: string; // a mock url
    summary: string;
}

export interface CollaborationNote {
    id: string;
    authorName: string;
    authorRole: UserRole;
    timestamp: Date;
    note: string;
}

export interface EWScore {
    score: number;
    level: 'Low' | 'Medium' | 'High';
    timestamp: Date;
}

// FIX: Renamed `type` to `eventType` to avoid conflict with `type` property in `Alert` and `HistoricalVitalReading`.
export type TimelineEvent = (HistoricalVitalReading | Alert | MoodLog | MedicationLog | VoiceNote | CollaborationNote) & { eventType: 'vital' | 'alert' | 'mood' | 'medication' | 'voice' | 'note' };

export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Place {
    id: string;
    name: string;
    type: 'hospital' | 'store';
    address: string;
    phone: string;
    coordinates: Coordinates;
}