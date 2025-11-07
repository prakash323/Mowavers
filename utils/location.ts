
import { Coordinates, Place } from "../types";

// Haversine formula to calculate distance between two lat/lng points
export const calculateDistance = (coord1: Coordinates, coord2: Coordinates): number => {
    const R = 3959; // Radius of the Earth in miles
    const lat1 = coord1.latitude;
    const lon1 = coord1.longitude;
    const lat2 = coord2.latitude;
    const lon2 = coord2.longitude;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a =
        0.5 - Math.cos(dLat) / 2 +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
        (1 - Math.cos(dLon)) / 2;

    return R * 2 * Math.asin(Math.sqrt(a));
};


// FIX: Updated the function's return type to include the 'distance' property, which is added in the map function.
export const getNearbyPlaces = (currentLocation: Coordinates, places: Place[], limit: number = 5): (Place & { distance: number })[] => {
    return places
        .map(place => ({
            ...place,
            distance: calculateDistance(currentLocation, place.coordinates),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, limit);
};
