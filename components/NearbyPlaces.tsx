import React from 'react';
import { Place, Coordinates } from '../types';
import { MOCK_PLACES } from '../constants';
import { getNearbyPlaces } from '../utils/location';
import { HospitalIcon, PillIcon } from './icons';
import Button from './ui/Button';

interface NearbyPlacesProps {
  patientLocation: Coordinates;
  isEmergency: boolean;
}

const NearbyPlaces: React.FC<NearbyPlacesProps> = ({ patientLocation, isEmergency }) => {
  const nearbyPlaces = getNearbyPlaces(patientLocation, MOCK_PLACES);
  const nearestHospital = nearbyPlaces.find(p => p.type === 'hospital');

  const getIcon = (type: 'hospital' | 'store') => {
    switch (type) {
      case 'hospital': return <HospitalIcon className="h-6 w-6 text-status-red" />;
      case 'store': return <PillIcon className="h-6 w-6 text-brand-secondary" />;
      default: return null;
    }
  };

  return (
    <div className="bg-brand-dark-accent p-4 rounded-lg shadow-lg">
      <h3 className="text-lg font-bold text-white mb-3">Nearby Facilities</h3>
      {isEmergency && nearestHospital && (
        <div className="bg-status-red/20 border border-status-red p-3 rounded-lg mb-4 animate-pulse">
          <h4 className="font-bold text-red-300">Emergency: Nearest Hospital</h4>
          <p className="text-sm text-white">{nearestHospital.name}</p>
          <p className="text-xs text-red-200">{nearestHospital.distance.toFixed(1)} miles away</p>
          <Button size="sm" variant="danger" className="w-full mt-2" onClick={() => alert('This would open map directions.')}>
            Get Directions
          </Button>
        </div>
      )}
      <div className="space-y-3 max-h-60 overflow-y-auto">
        {nearbyPlaces.map(place => (
          <div key={place.id} className="flex items-start space-x-3 bg-brand-dark p-3 rounded-md">
            <div className="flex-shrink-0">{getIcon(place.type)}</div>
            <div>
              <p className="font-semibold text-white text-sm">{place.name}</p>
              <p className="text-xs text-gray-400">{place.address}</p>
              <p className="text-xs text-gray-500">{place.phone} - <span className="font-medium text-brand-primary">{place.distance.toFixed(1)} mi away</span></p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NearbyPlaces;
