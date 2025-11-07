import { useState, useEffect } from 'react';
import { Vital, VitalStatus, VitalType } from '../types';
import { INITIAL_VITALS, VITAL_THRESHOLDS } from '../constants';

const getStatus = (type: VitalType, value: number): VitalStatus => {
    const thresholds = VITAL_THRESHOLDS[type];
    if (!thresholds) return VitalStatus.Normal;
    
    // Critical checks for values outside the absolute safe range
    if (value < thresholds.critical[0] || value > thresholds.critical[1]) {
        return VitalStatus.Critical;
    }
    // Warning checks for values outside the normal but not critical range
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
          // Base fluctuation: a small, continuous change
          let change = (Math.random() - 0.5) * (vital.value * 0.015); // +/- 1.5%

          // Introduce a 15% chance of a more significant, random spike or drop
          if (Math.random() < 0.15) {
            const spikeOrDrop = (Math.random() - 0.5) * (vital.value * 0.08); // +/- 8% event
            change += spikeOrDrop;
          }

          const newValue = parseFloat((vital.value + change).toFixed(vital.unit === '%' || vital.unit === 'ratio' ? 1 : 0));
          
          let trend: 'up' | 'down' | 'stable';
          const trendThreshold = vital.value * 0.01; // Trend is 'up' or 'down' if change is > 1% of value
          if (change > trendThreshold) trend = 'up';
          else if (change < -trendThreshold) trend = 'down';
          else trend = 'stable';

          return {
            ...vital,
            value: newValue,
            status: getStatus(vital.type, newValue),
            trend: trend,
            timestamp: new Date(),
          };
        })
      );
    }, 2000); // Update every 2 seconds for a more real-time feel

    return () => clearInterval(interval);
  }, [patientId, loading]);

  return { vitals, loading };
};
