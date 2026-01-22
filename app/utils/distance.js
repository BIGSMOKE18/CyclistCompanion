/**
 * Calculate distance between two GPS coordinates using the Haversine formula
 * @param {number} lat1 - Latitude of first point in degrees
 * @param {number} lon1 - Longitude of first point in degrees
 * @param {number} lat2 - Latitude of second point in degrees
 * @param {number} lon2 - Longitude of second point in degrees
 * @returns {number} Distance in kilometers
 */
export function calculateDistance(lat1, lon1, lat2, lon2) {
  // Earth's radius in kilometers
  const R = 6371;

  // Convert degrees to radians
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);

  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  // Distance in kilometers
  return R * c;
}

/**
 * Convert degrees to radians
 * @param {number} degrees - Angle in degrees
 * @returns {number} Angle in radians
 */
function toRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate total distance from an array of GPS coordinates
 * @param {Array<{latitude: number, longitude: number}>} coordinates - Array of coordinate objects
 * @returns {number} Total distance in kilometers
 */
export function calculateTotalDistance(coordinates) {
  if (!coordinates || coordinates.length < 2) {
    return 0;
  }

  let totalDistance = 0;

  for (let i = 1; i < coordinates.length; i++) {
    const prev = coordinates[i - 1];
    const curr = coordinates[i];

    totalDistance += calculateDistance(
      prev.latitude,
      prev.longitude,
      curr.latitude,
      curr.longitude
    );
  }

  return totalDistance;
}

/**
 * Format distance for display
 * @param {number} distanceKm - Distance in kilometers
 * @param {number} decimals - Number of decimal places (default: 2)
 * @returns {string} Formatted distance string
 */
export function formatDistance(distanceKm, decimals = 2) {
  if (distanceKm >= 1) {
    return `${distanceKm.toFixed(decimals)} km`;
  } else {
    // Convert to meters for distances under 1km
    const distanceM = distanceKm * 1000;
    return `${Math.round(distanceM)} m`;
  }
}

// Default export for convenience
export default calculateDistance;