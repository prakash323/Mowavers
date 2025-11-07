
import { useState, useEffect } from 'react';

interface GeolocationState {
  loading: boolean;
  accuracy: number | null;
  altitude: number | null;
  altitudeAccuracy: number | null;
  heading: number | null;
  latitude: number | null;
  longitude: number | null;
  speed: number | null;
  timestamp: number | null;
  error: GeolocationPositionError | null;
}

const useGeolocation = (options?: PositionOptions) => {
  const [state, setState] = useState<GeolocationState>({
    loading: true,
    accuracy: null,
    altitude: null,
    altitudeAccuracy: null,
    heading: null,
    latitude: null,
    longitude: null,
    speed: null,
    timestamp: Date.now(),
    error: null,
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState(s => ({...s, loading: false, error: { code: 0, message: "Geolocation not supported", PERMISSION_DENIED: 1, POSITION_UNAVAILABLE: 2, TIMEOUT: 3}}))
      return;
    }

    const onEvent = ({ coords, timestamp }: GeolocationPosition) => {
      setState({
        loading: false,
        accuracy: coords.accuracy,
        altitude: coords.altitude,
        altitudeAccuracy: coords.altitudeAccuracy,
        heading: coords.heading,
        latitude: coords.latitude,
        longitude: coords.longitude,
        speed: coords.speed,
        timestamp,
        error: null,
      });
    };

    const onEventError = (error: GeolocationPositionError) => {
      setState(s => ({ ...s, loading: false, error }));
    };

    navigator.geolocation.getCurrentPosition(onEvent, onEventError, options);
    const watchId = navigator.geolocation.watchPosition(onEvent, onEventError, options);

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, [options]);

  return state;
};

export default useGeolocation;
