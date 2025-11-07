import React, { useRef, useEffect, useCallback } from 'react';
import { VitalStatus } from '../types';

// --- Waveform Generator Functions ---

/**
 * Generates a simulated ECG (PQRST) waveform.
 * @param bpm - Beats per minute to control the frequency.
 * @param status - The vital's status, used to adjust signal noise.
 */
const ecgGenerator = (bpm = 75, status: VitalStatus = VitalStatus.Normal) => {
    const beatInterval = (60 / bpm) * 60; // in frames (assuming 60fps)
    const pqrstDuration = beatInterval * 0.25;
    const noiseLevel = status === VitalStatus.Normal ? 1.5 : (status === VitalStatus.Warning ? 3 : 5);

    return (time: number) => {
        const timeInBeat = time % beatInterval;
        let val = 50; // Baseline at 50% height

        if (timeInBeat <= pqrstDuration) {
            const phase = timeInBeat / pqrstDuration;
            if (phase < 0.1) val += 5 * Math.sin(phase * 10 * Math.PI); // P wave
            else if (phase < 0.2) val -= 15 * Math.sin((phase - 0.1) * 10 * Math.PI); // Q wave
            else if (phase < 0.4) val += 45 * Math.sin((phase - 0.2) * 5 * Math.PI); // R wave
            else if (phase < 0.5) val -= 25 * Math.sin((phase - 0.4) * 10 * Math.PI); // S wave
            else if (phase >= 0.7) val += 10 * Math.sin((phase - 0.7) * 3.33 * Math.PI); // T wave
        }
        
        val += (Math.random() - 0.5) * noiseLevel;
        return Math.max(0, Math.min(100, val));
    };
};

/**
 * Generates a simulated SpO2 PPG waveform.
 * @param bpm - Beats per minute to sync with the heart rate.
 * @param status - The vital's status, used to adjust signal noise.
 */
const ppgGenerator = (bpm = 75, status: VitalStatus = VitalStatus.Normal) => {
    const beatInterval = (60 / bpm) * 60;
    const noiseLevel = status === VitalStatus.Normal ? 1 : (status === VitalStatus.Warning ? 2 : 3);
    return (time: number) => {
        const timeInBeat = time % beatInterval;
        const phase = (timeInBeat / beatInterval) * 2 * Math.PI;
        // Combination of sines to create a more realistic shape with a dicrotic notch
        let val = 50 - Math.sin(phase) * 15 - Math.sin(phase * 2) * 3;
        val += (Math.random() - 0.5) * noiseLevel;
        return Math.max(0, Math.min(100, val));
    };
};

/**
 * Generates a simulated respiration waveform.
 * @param rpm - Respirations per minute.
 * @param status - The vital's status, used to adjust signal noise.
 */
const respGenerator = (rpm = 16, status: VitalStatus = VitalStatus.Normal) => {
    const breathInterval = (60 / rpm) * 60;
    const noiseLevel = status === VitalStatus.Normal ? 0.5 : (status === VitalStatus.Warning ? 1 : 1.5);
    return (time: number) => {
        const val = 50 + Math.sin(time * 2 * Math.PI / breathInterval) * 20;
        return val + (Math.random() - 0.5) * noiseLevel;
    };
};


interface WaveformCardProps {
  label: string;
  color: string;
  generator: (time: number) => number;
  value: string | undefined;
  unit: string | undefined;
}

const WaveformCard: React.FC<WaveformCardProps> = ({ label, color, generator, value, unit }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const dataRef = useRef<number[]>([]);
    const animationFrameId = useRef<number>();
    const timeRef = useRef(0);

    const animate = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        const data = dataRef.current;

        // Fix: Pass the current time to the generator to create a moving waveform.
        const newValue = generator(timeRef.current);
        data.push(newValue);
        timeRef.current += 1;
        
        while (data.length > width) {
            data.shift();
        }

        ctx.clearRect(0, 0, width, height);
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        
        const gradient = ctx.createLinearGradient(0, 0, 0, height);
        gradient.addColorStop(0, `${color}80`); // 50% opacity
        gradient.addColorStop(1, `${color}00`); // 0% opacity
        
        ctx.beginPath();
        for (let i = 0; i < data.length; i++) {
            const x = width - data.length + i;
            const y = height - (data[i] / 100) * height * 0.8 - (height * 0.1); // Use 80% of height, centered
            if (i === 0) {
                ctx.moveTo(x, y);
            } else {
                ctx.lineTo(x, y);
            }
        }
        ctx.stroke();

        ctx.lineTo(width, height);
        ctx.lineTo(0, height);
        ctx.closePath();
        ctx.fillStyle = gradient;
        ctx.fill();

        animationFrameId.current = requestAnimationFrame(animate);
    }, [generator, color]);

    useEffect(() => {
        animationFrameId.current = requestAnimationFrame(animate);
        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [animate]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const parent = canvas.parentElement;
        if (!parent) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                const { width, height } = entry.contentRect;
                canvas.width = width;
                canvas.height = height;
                // FIX: Ensure width is a non-negative integer before creating an array.
                // This prevents a RangeError if the width is fractional or negative during render.
                const safeWidth = Math.max(0, Math.floor(width));
                dataRef.current = Array(safeWidth).fill(50);
            }
        });
        resizeObserver.observe(parent);

        return () => resizeObserver.disconnect();
    }, []);


    return (
        <div className="bg-white dark:bg-brand-dark-accent rounded-lg p-4 shadow-lg flex flex-col h-40 md:h-48">
            <div className="flex justify-between items-baseline">
                <span className="text-sm font-bold" style={{ color }}>{label}</span>
                <span className="text-xl font-bold text-brand-text-light dark:text-white">{value || '...'} <span className="text-sm text-gray-500 dark:text-gray-400">{unit}</span></span>
            </div>
            <div className="flex-grow relative mt-2 min-h-0">
                <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full" />
            </div>
        </div>
    );
};

export { WaveformCard, ecgGenerator, ppgGenerator, respGenerator };