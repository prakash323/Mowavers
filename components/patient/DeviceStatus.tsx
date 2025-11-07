import React, { useState, useEffect } from 'react';
import { BatteryIcon, SignalIcon } from '../icons';

const DeviceStatus: React.FC = () => {
    const [batteryLevel, setBatteryLevel] = useState(92);
    const [isConnected, setIsConnected] = useState(true);

    useEffect(() => {
        // Simulate battery drain
        const batteryInterval = setInterval(() => {
            setBatteryLevel(prev => Math.max(0, prev - 1));
        }, 10 * 60 * 1000); // Drain 1% every 10 minutes

        // Simulate random disconnections
        const connectionInterval = setInterval(() => {
            if (Math.random() < 0.05) { // 5% chance to toggle connection status
                setIsConnected(prev => !prev);
            } else if (!isConnected) {
                // Higher chance to reconnect
                if (Math.random() < 0.5) {
                    setIsConnected(true);
                }
            }
        }, 30000); // Check connection every 30 seconds

        return () => {
            clearInterval(batteryInterval);
            clearInterval(connectionInterval);
        };
    }, [isConnected]);

    const getBatteryColor = () => {
        if (batteryLevel <= 20) return 'text-status-red';
        if (batteryLevel <= 50) return 'text-status-amber';
        return 'text-status-green';
    };

    const connectionColor = isConnected ? 'text-status-green' : 'text-status-red animate-pulse';

    return (
        <div className="flex items-center space-x-4 text-sm text-brand-text-light dark:text-brand-text">
            <div className="flex items-center space-x-1" title={isConnected ? 'Device Connected' : 'Device Disconnected'}>
                <SignalIcon className={`h-5 w-5 ${connectionColor}`} />
            </div>
            <div className="flex items-center space-x-1" title={`Battery: ${batteryLevel}%`}>
                <span className={`font-semibold ${getBatteryColor()}`}>
                    {batteryLevel}%
                </span>
                <BatteryIcon className={`h-5 w-5 ${getBatteryColor()}`} />
            </div>
        </div>
    );
};

export default DeviceStatus;