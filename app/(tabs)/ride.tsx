import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DistanceCard } from '@/app/components/DistanceCard';
import { SpeedCard } from '@/app/components/SpeedCard';
import { MapView } from '@/app/components/MapView';
import { darkTheme } from '@/app/theme/darkTheme';
import { gpsManager } from '@/app/utils/gps';

export default function RideScreen() {
  const [isRiding, setIsRiding] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState('unknown'); // 'unknown', 'granted', 'denied'
  const [rideData, setRideData] = useState({
    distance: 0,
    speed: 0,
    duration: 0,
    calories: 0,
  });

  // Callback for GPS updates
  const handleLocationUpdate = useCallback((data) => {
    setRideData({
      distance: data.totalDistance,
      speed: data.currentSpeed,
      duration: data.duration,
      calories: Math.round(data.totalDistance * 50), // Rough estimate: 50 calories per km
    });
  }, []);

  // Check location permissions on mount
  useEffect(() => {
    checkPermissions();
  }, []);

  // Real-time updates while riding
  useEffect(() => {
    if (isRiding) {
      const interval = setInterval(() => {
        const data = gpsManager.getTrackingData();
        handleLocationUpdate(data);
      }, 1000); // Update every second

      return () => clearInterval(interval);
    }
  }, [isRiding, handleLocationUpdate]);

  const checkPermissions = async () => {
    try {
      const isAvailable = await gpsManager.isLocationAvailable();
      if (!isAvailable) {
        setPermissionStatus('denied');
        Alert.alert(
          'GPS Unavailable',
          'Location services are not enabled. Please enable GPS to track your rides.',
          [{ text: 'OK' }]
        );
        return;
      }

      const hasPermission = await gpsManager.requestPermissions();
      setPermissionStatus(hasPermission ? 'granted' : 'denied');
    } catch (error) {
      console.error('Permission check failed:', error);
      setPermissionStatus('denied');
    }
  };

  const startRide = async () => {
    if (permissionStatus !== 'granted') {
      Alert.alert(
        'Location Permission Required',
        'GPS permission is needed to track your ride. Please grant location access.',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Settings', onPress: checkPermissions }
        ]
      );
      return;
    }

    try {
      const success = await gpsManager.startTracking(handleLocationUpdate);
      if (success) {
        setIsRiding(true);
      } else {
        Alert.alert(
          'GPS Error',
          'Unable to start GPS tracking. Please check your location settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error starting ride:', error);
      Alert.alert(
        'Error',
        'Failed to start ride tracking. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const stopRide = async () => {
    try {
      const finalData = await gpsManager.stopTracking();
      setIsRiding(false);

      // Show ride summary
      Alert.alert(
        'Ride Completed!',
        `Distance: ${finalData.totalDistance.toFixed(2)} km\n` +
        `Duration: ${formatDuration(finalData.duration)}\n` +
        `Avg Speed: ${finalData.averageSpeed.toFixed(1)} km/h`,
        [{ text: 'OK' }]
      );

      // Reset ride data
      setRideData({
        distance: 0,
        speed: 0,
        duration: 0,
        calories: 0,
      });
    } catch (error) {
      console.error('Error stopping ride:', error);
      setIsRiding(false);
    }
  };

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getStatusText = () => {
    if (permissionStatus === 'unknown') return 'Checking permissions...';
    if (permissionStatus === 'denied') return 'GPS permission required';
    if (isRiding) return 'Riding - GPS Active';
    return 'Ready to ride';
  };

  const getStatusColor = () => {
    if (permissionStatus === 'denied') return darkTheme.colors.error;
    if (isRiding) return darkTheme.colors.success;
    if (permissionStatus === 'granted') return darkTheme.colors.primary;
    return darkTheme.colors.textSecondary;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Ride Tracker</Text>
        <View style={styles.statusContainer}>
          <View style={[styles.statusDot, { backgroundColor: getStatusColor() }]} />
          <Text style={styles.status}>
            {getStatusText()}
          </Text>
        </View>
      </View>

      <View style={styles.mapContainer}>
        <MapView />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statsRow}>
          <DistanceCard
            title="Distance"
            value={rideData.distance.toFixed(1)}
            unit="km"
            style={styles.statCard}
          />
          <SpeedCard
            title="Speed"
            value={rideData.speed.toFixed(1)}
            unit="km/h"
            style={styles.statCard}
          />
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Duration</Text>
            <Text style={styles.statValue}>{formatDuration(rideData.duration)}</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Calories</Text>
            <Text style={styles.statValue}>{rideData.calories}</Text>
          </View>
        </View>
      </View>

      <View style={styles.controls}>
        {!isRiding ? (
          <TouchableOpacity
            style={[styles.startButton, permissionStatus !== 'granted' && styles.disabledButton]}
            onPress={startRide}
            disabled={permissionStatus !== 'granted'}
          >
            <Text style={[styles.startButtonText, permissionStatus !== 'granted' && styles.disabledButtonText]}>
              {permissionStatus === 'denied' ? 'Grant GPS Permission' : 'Start Ride'}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.stopButton} onPress={stopRide}>
            <Text style={styles.stopButtonText}>Stop Ride</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  header: {
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.md,
    alignItems: 'center',
  },
  title: {
    fontSize: darkTheme.typography.fontSize.xl,
    fontWeight: darkTheme.typography.fontWeight.bold,
    color: darkTheme.colors.text,
    marginBottom: darkTheme.spacing.xs,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: darkTheme.spacing.sm,
  },
  status: {
    fontSize: darkTheme.typography.fontSize.md,
    color: darkTheme.colors.textSecondary,
  },
  mapContainer: {
    flex: 1,
    marginHorizontal: darkTheme.spacing.md,
    marginBottom: darkTheme.spacing.md,
    borderRadius: darkTheme.borderRadius.md,
    overflow: 'hidden',
  },
  statsContainer: {
    paddingHorizontal: darkTheme.spacing.md,
    paddingBottom: darkTheme.spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: darkTheme.spacing.md,
  },
  statCard: {
    backgroundColor: darkTheme.colors.card,
    padding: darkTheme.spacing.md,
    borderRadius: darkTheme.borderRadius.md,
    flex: 1,
    marginHorizontal: darkTheme.spacing.xs,
    alignItems: 'center',
    ...darkTheme.shadows.light,
  },
  statLabel: {
    fontSize: darkTheme.typography.fontSize.sm,
    color: darkTheme.colors.textSecondary,
    marginBottom: darkTheme.spacing.xs,
  },
  statValue: {
    fontSize: darkTheme.typography.fontSize.lg,
    fontWeight: darkTheme.typography.fontWeight.bold,
    color: darkTheme.colors.primary,
  },
  controls: {
    paddingHorizontal: darkTheme.spacing.md,
    paddingBottom: darkTheme.spacing.lg,
  },
  startButton: {
    backgroundColor: darkTheme.colors.success,
    paddingVertical: darkTheme.spacing.lg,
    borderRadius: darkTheme.borderRadius.md,
    alignItems: 'center',
  },
  startButtonText: {
    color: darkTheme.colors.text,
    fontSize: darkTheme.typography.fontSize.lg,
    fontWeight: darkTheme.typography.fontWeight.bold,
  },
  stopButton: {
    backgroundColor: darkTheme.colors.error,
    paddingVertical: darkTheme.spacing.lg,
    borderRadius: darkTheme.borderRadius.md,
    alignItems: 'center',
  },
  stopButtonText: {
    color: darkTheme.colors.text,
    fontSize: darkTheme.typography.fontSize.lg,
    fontWeight: darkTheme.typography.fontWeight.bold,
  },
  disabledButton: {
    backgroundColor: darkTheme.colors.surface,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  disabledButtonText: {
    color: darkTheme.colors.textSecondary,
  },
});