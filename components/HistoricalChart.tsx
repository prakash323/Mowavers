import React, { useState, useMemo } from 'react';
import { HistoricalVitalReading, VitalType } from '../types';

interface HistoricalChartProps {
  data: HistoricalVitalReading[];
}

const vitalTypes: VitalType[] = ['Heart Rate', 'SpO2', 'Blood Pressure', 'Respiration Rate'];

const HistoricalChart: React.FC<HistoricalChartProps> = ({ data }) => {
  const [selectedVital, setSelectedVital] = useState<VitalType>('Heart Rate');

  const chartData = useMemo(() => {
    const filtered = data
      .filter(d => d.type === selectedVital)
      .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    if (filtered.length < 2) return null;

    const values = filtered.map(d => d.value);
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const range = maxVal - minVal === 0 ? 1 : maxVal - minVal;

    const points = filtered.map((d, i) => ({
      x: (i / (filtered.length - 1)) * 100,
      y: 100 - ((d.value - minVal) / range) * 90 - 5, // 5% padding top/bottom
      value: d.value,
      timestamp: d.timestamp,
    }));

    const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');

    return { points, path, minVal, maxVal, unit: filtered[0]?.unit };
  }, [data, selectedVital]);

  return (
    <div className="bg-white dark:bg-brand-dark-accent p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-bold text-brand-text-light dark:text-white">Vital Trends</h4>
        <select
          value={selectedVital}
          onChange={e => setSelectedVital(e.target.value as VitalType)}
          className="bg-brand-light-accent dark:bg-brand-dark border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm text-brand-text-light dark:text-white focus:outline-none"
        >
          {vitalTypes.map(vt => <option key={vt} value={vt}>{vt}</option>)}
        </select>
      </div>
      {chartData ? (
        <div className="h-64">
          <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
            {/* Y-Axis Labels */}
            <text x="0" y="10" className="text-xs fill-current text-gray-500 dark:text-gray-400">{chartData.maxVal.toFixed(0)}</text>
            <text x="0" y="95" className="text-xs fill-current text-gray-500 dark:text-gray-400">{chartData.minVal.toFixed(0)}</text>
            
            {/* Grid Lines */}
            <line x1="5" x2="100" y1="10" y2="10" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="0.2"/>
            <line x1="5" x2="100" y1="52.5" y2="52.5" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="0.2"/>
            <line x1="5" x2="100" y1="95" y2="95" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="0.2"/>

            <path d={chartData.path} className="stroke-current text-brand-primary" fill="none" strokeWidth="0.5" />
            
            {/* Data Points */}
            {chartData.points.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="1" className="fill-current text-brand-primary opacity-50 hover:opacity-100 cursor-pointer">
                 <title>{`${selectedVital}: ${p.value.toFixed(1)} ${chartData.unit} on ${p.timestamp.toLocaleDateString()}`}</title>
              </circle>
            ))}
          </svg>
        </div>
      ) : (
        <div className="h-64 flex items-center justify-center text-gray-500 dark:text-gray-400">
          <p>No data available for {selectedVital}.</p>
        </div>
      )}
    </div>
  );
};

export default HistoricalChart;
