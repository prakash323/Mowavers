
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

export enum VitalType {
  HeartRate = 'HR',
  SPO2 = 'SpO₂',
  RespiratoryRate = 'RR',
  HeartRateVariability = 'HRV',
  PulseTransitTime = 'PTT',
  Doppler = 'Doppler',
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
  baseline: number;
  trend: 'up' | 'down' | 'stable';
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  location: string;
  status: VitalStatus;
  caretakerId: string;
  doctorId: string;
}

export interface Alert {
  id: string;
  patientId: string;
  patientName: string;
  message: string;
  timestamp: Date;
  acknowledged: boolean;
}
