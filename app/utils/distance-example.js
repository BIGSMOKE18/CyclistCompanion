// Example usage of the distance calculation utility
import { calculateDistance, calculateTotalDistance, formatDistance } from './distance';

// Example 1: Calculate distance between two points
const lat1 = 40.7128; // New York City
const lon1 = -74.0060;
const lat2 = 34.0522; // Los Angeles
const lon2 = -118.2437;

const distance = calculateDistance(lat1, lon1, lat2, lon2);
console.log(`Distance: ${formatDistance(distance)}`);
// Output: Distance: 3941.92 km

// Example 2: Calculate total distance from a path
const pathCoordinates = [
  { latitude: 40.7128, longitude: -74.0060 }, // NYC
  { latitude: 39.9526, longitude: -75.1652 }, // Philadelphia
  { latitude: 38.9072, longitude: -77.0369 }, // Washington DC
];

const totalDistance = calculateTotalDistance(pathCoordinates);
console.log(`Total path distance: ${formatDistance(totalDistance)}`);
// Output: Total path distance: 396.45 km

// Example 3: Real-time distance tracking
let totalRideDistance = 0;
const rideCoordinates = [];

function addLocation(latitude, longitude) {
  rideCoordinates.push({ latitude, longitude });

  if (rideCoordinates.length >= 2) {
    const lastIndex = rideCoordinates.length - 1;
    const newDistance = calculateDistance(
      rideCoordinates[lastIndex - 1].latitude,
      rideCoordinates[lastIndex - 1].longitude,
      rideCoordinates[lastIndex].latitude,
      rideCoordinates[lastIndex].longitude
    );
    totalRideDistance += newDistance;
  }

  console.log(`Current ride distance: ${formatDistance(totalRideDistance)}`);
}