import * as Location from 'expo-location';
import { calculateDistance } from './distance';

class GPSManager {
  constructor() {
    this.isTracking = false;
    this.watchId = null;
    this.currentLocation = null;
    this.previousLocation = null;
    this.totalDistance = 0;
    this.startTime = null;
    this.currentSpeed = 0;
    this.locationHistory = [];
    this.callbacks = [];
  }

  // Request location permissions
  async requestPermissions() {
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      throw new Error('Location permission denied');
    }
    return status === 'granted';
  }

  // Calculate distance between two coordinates using Haversine formula
  calculateDistance(lat1, lon1, lat2, lon2) {
    return calculateDistance(lat1, lon1, lat2, lon2);
  }

  // Calculate speed in km/h
  calculateSpeed(distanceKm, timeMs) {
    if (timeMs === 0) return 0;
    const timeHours = timeMs / (1000 * 60 * 60);
    return distanceKm / timeHours;
  }

  // Start GPS tracking
  async startTracking(onLocationUpdate = null) {
    try {
      const hasPermission = await this.requestPermissions();
      if (!hasPermission) {
        throw new Error('Location permission required');
      }

      this.isTracking = true;
      this.startTime = Date.now();
      this.totalDistance = 0;
      this.locationHistory = [];
      this.currentSpeed = 0;

      // Get initial location
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      this.currentLocation = {
        latitude: initialLocation.coords.latitude,
        longitude: initialLocation.coords.longitude,
        timestamp: initialLocation.timestamp,
        accuracy: initialLocation.coords.accuracy,
      };

      this.locationHistory.push(this.currentLocation);

      if (onLocationUpdate) {
        this.callbacks.push(onLocationUpdate);
        onLocationUpdate(this.getTrackingData());
      }

      // Start watching location
      this.watchId = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 1000, // Update every second
          distanceInterval: 5, // Update every 5 meters
        },
        (location) => {
          this.updateLocation(location);
        }
      );

      return true;
    } catch (error) {
      console.error('Error starting GPS tracking:', error);
      return false;
    }
  }

  // Update location and calculate metrics
  updateLocation(location) {
    const newLocation = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      timestamp: location.timestamp,
      accuracy: location.coords.accuracy,
    };

    if (this.currentLocation) {
      this.previousLocation = this.currentLocation;

      // Calculate distance traveled
      const distance = this.calculateDistance(
        this.currentLocation.latitude,
        this.currentLocation.longitude,
        newLocation.latitude,
        newLocation.longitude
      );

      // Only count distance if accuracy is good enough
      if (location.coords.accuracy < 20) { // Within 20 meters accuracy
        this.totalDistance += distance;
      }

      // Calculate speed
      const timeDiff = newLocation.timestamp - this.currentLocation.timestamp;
      if (timeDiff > 0) {
        this.currentSpeed = this.calculateSpeed(distance, timeDiff);
      }
    }

    this.currentLocation = newLocation;
    this.locationHistory.push(newLocation);

    // Notify callbacks
    const trackingData = this.getTrackingData();
    this.callbacks.forEach(callback => callback(trackingData));
  }

  // Stop GPS tracking
  async stopTracking() {
    if (this.watchId) {
      this.watchId.remove();
      this.watchId = null;
    }
    this.isTracking = false;
    this.callbacks = [];
    return this.getTrackingData();
  }

  // Get current tracking data
  getTrackingData() {
    const duration = this.startTime ? (Date.now() - this.startTime) / 1000 : 0; // seconds

    return {
      isTracking: this.isTracking,
      currentLocation: this.currentLocation,
      totalDistance: this.totalDistance,
      currentSpeed: this.currentSpeed,
      duration: Math.floor(duration),
      locationHistory: this.locationHistory,
      averageSpeed: duration > 0 ? this.calculateSpeed(this.totalDistance, duration * 1000) : 0,
    };
  }

  // Add callback for location updates
  addCallback(callback) {
    this.callbacks.push(callback);
  }

  // Remove callback
  removeCallback(callback) {
    this.callbacks = this.callbacks.filter(cb => cb !== callback);
  }

  // Check if GPS is available
  async isLocationAvailable() {
    const isAvailable = await Location.hasServicesEnabledAsync();
    return isAvailable;
  }
}

// Export singleton instance
export const gpsManager = new GPSManager();
export default gpsManager;