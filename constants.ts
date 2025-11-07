
import { UserRole, User, Patient, Alert, VitalStatus, Vital, VitalType } from './types';

export const USERS: User[] = [
  { id: 'p01', name: 'Alex Johnson', role: UserRole.Patient },
  { id: 'c01', name: 'Sarah Miller', role: UserRole.Caretaker },
  { id: 'd01', name: 'Dr. Evelyn Reed', role: UserRole.Doctor },
];

export const PATIENTS: Patient[] = [
  { id: 'p01', name: 'Alex Johnson', age: 68, location: '123 Health St, Medville', status: VitalStatus.Normal, caretakerId: 'c01', doctorId: 'd01' },
  { id: 'p02', name: 'Maria Garcia', age: 75, location: '456 Wellness Ave, Medville', status: VitalStatus.Warning, caretakerId: 'c01', doctorId: 'd01' },
  { id: 'p03', name: 'James Smith', age: 82, location: '789 Life Blvd, Medville', status: VitalStatus.Critical, caretakerId: 'c01', doctorId: 'd01' },
  { id: 'p04', name: 'Chen Wei', age: 65, location: '101 Vitality Rd, Medville', status: VitalStatus.Normal, caretakerId: 'c01', doctorId: 'd01' },
];

export const MOCK_ALERTS: Alert[] = [
    { id: 'a01', patientId: 'p03', patientName: 'James Smith', message: 'Critical Heart Rate Detected: 135 bpm', timestamp: new Date(Date.now() - 5 * 60000), acknowledged: false },
    { id: 'a02', patientId: 'p02', patientName: 'Maria Garcia', message: 'SpO₂ level dropped to 89%', timestamp: new Date(Date.now() - 15 * 60000), acknowledged: true },
];

export const INITIAL_VITALS: Record<string, Vital[]> = {
  p01: [
    { type: VitalType.HeartRate, value: 72, unit: 'bpm', status: VitalStatus.Normal, baseline: 70, trend: 'stable' },
    { type: VitalType.SPO2, value: 98, unit: '%', status: VitalStatus.Normal, baseline: 97, trend: 'stable' },
    { type: VitalType.RespiratoryRate, value: 16, unit: 'br/min', status: VitalStatus.Normal, baseline: 15, trend: 'stable' },
    { type: VitalType.HeartRateVariability, value: 65, unit: 'ms', status: VitalStatus.Normal, baseline: 60, trend: 'up' },
    { type: VitalType.PulseTransitTime, value: 210, unit: 'ms', status: VitalStatus.Normal, baseline: 215, trend: 'down' },
    { type: VitalType.Doppler, value: 1.0, unit: 'ratio', status: VitalStatus.Normal, baseline: 1.0, trend: 'stable' },
  ],
  p02: [
    { type: VitalType.HeartRate, value: 95, unit: 'bpm', status: VitalStatus.Warning, baseline: 80, trend: 'up' },
    { type: VitalType.SPO2, value: 91, unit: '%', status: VitalStatus.Warning, baseline: 95, trend: 'down' },
    { type: VitalType.RespiratoryRate, value: 22, unit: 'br/min', status: VitalStatus.Warning, baseline: 18, trend: 'up' },
    { type: VitalType.HeartRateVariability, value: 40, unit: 'ms', status: VitalStatus.Warning, baseline: 55, trend: 'down' },
    { type: VitalType.PulseTransitTime, value: 190, unit: 'ms', status: VitalStatus.Warning, baseline: 220, trend: 'down' },
    { type: VitalType.Doppler, value: 1.2, unit: 'ratio', status: VitalStatus.Warning, baseline: 1.0, trend: 'up' },
  ],
  p03: [
    { type: VitalType.HeartRate, value: 135, unit: 'bpm', status: VitalStatus.Critical, baseline: 75, trend: 'up' },
    { type: VitalType.SPO2, value: 85, unit: '%', status: VitalStatus.Critical, baseline: 96, trend: 'down' },
    { type: VitalType.RespiratoryRate, value: 28, unit: 'br/min', status: VitalStatus.Critical, baseline: 16, trend: 'up' },
    { type: VitalType.HeartRateVariability, value: 25, unit: 'ms', status: VitalStatus.Critical, baseline: 62, trend: 'down' },
    { type: VitalType.PulseTransitTime, value: 170, unit: 'ms', status: VitalStatus.Critical, baseline: 210, trend: 'down' },
    { type: VitalType.Doppler, value: 1.4, unit: 'ratio', status: VitalStatus.Critical, baseline: 1.0, trend: 'up' },
  ],
   p04: [
    { type: VitalType.HeartRate, value: 68, unit: 'bpm', status: VitalStatus.Normal, baseline: 65, trend: 'stable' },
    { type: VitalType.SPO2, value: 99, unit: '%', status: VitalStatus.Normal, baseline: 98, trend: 'stable' },
    { type: VitalType.RespiratoryRate, value: 14, unit: 'br/min', status: VitalStatus.Normal, baseline: 14, trend: 'stable' },
    { type: VitalType.HeartRateVariability, value: 70, unit: 'ms', status: VitalStatus.Normal, baseline: 72, trend: 'down' },
    { type: VitalType.PulseTransitTime, value: 220, unit: 'ms', status: VitalStatus.Normal, baseline: 220, trend: 'stable' },
    { type: VitalType.Doppler, value: 0.9, unit: 'ratio', status: VitalStatus.Normal, baseline: 1.0, trend: 'down' },
  ],
};

export const VITAL_THRESHOLDS: Record<VitalType, { warning: [number, number], critical: [number, number] }> = {
    [VitalType.HeartRate]: { warning: [50, 100], critical: [40, 130] },
    [VitalType.SPO2]: { warning: [92, 101], critical: [0, 90] },
    [VitalType.RespiratoryRate]: { warning: [10, 20], critical: [8, 25] },
    [VitalType.HeartRateVariability]: { warning: [40, 150], critical: [20, 200] },
    [VitalType.PulseTransitTime]: { warning: [180, 250], critical: [150, 300] },
    [VitalType.Doppler]: { warning: [0.8, 1.2], critical: [0.7, 1.4] },
};
