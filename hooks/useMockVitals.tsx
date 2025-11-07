
import { useState, useEffect } from 'react';
import { Vital, VitalStatus, VitalType } from '../types';
import { INITIAL_VITALS, VITAL_THRESHOLDS } from '../constants';

const getStatus = (type: VitalType, value: number): VitalStatus => {
    const thresholds = VITAL_THRESHOLDS[type];
    if (value < thresholds.critical[0] || value > thresholds.critical[1]) {
        return VitalStatus.Critical;
    }
    if (value < thresholds.warning[0] || value > thresholds.warning[1]) {
        return VitalStatus.Warning;
    }
    return VitalStatus.Normal;
}

export const useMockVitals = (patientId: string) => {
  const [vitals, setVitals] = useState<Vital[]>(INITIAL_VITALS[patientId] || []);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    // Simulate initial fetch
    const timer = setTimeout(() => {
        setVitals(INITIAL_VITALS[patientId] || []);
        setLoading(false);
    }, 500);
    return () => clearTimeout(timer);
  }, [patientId]);

  useEffect(() => {
    if (loading) return;

    const interval = setInterval(() => {
      setVitals(currentVitals => 
        currentVitals.map(vital => {
          const change = (Math.random() - 0.5) * (vital.value * 0.02); // +/- 2% change
          const newValue = parseFloat((vital.value + change).toFixed(vital.unit === '%' || vital.unit === 'ratio' ? 1 : 0));
          
          let trend: 'up' | 'down' | 'stable';
          if (change > 0.01) trend = 'up';
          else if (change < -0.01) trend = 'down';
          else trend = 'stable';

          return {
            ...vital,
            value: newValue,
            status: getStatus(vital.type, newValue),
            trend: trend,
          };
        })
      );
    }, 10000); // Update every 10 seconds

    return () => clearInterval(interval);
  }, [patientId, loading]);

  return { vitals, loading };
};
