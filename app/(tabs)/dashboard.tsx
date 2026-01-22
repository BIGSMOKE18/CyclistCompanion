import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LineChart } from 'react-native-chart-kit';
import { DistanceCard } from '@/app/components/DistanceCard';
import { SpeedCard } from '@/app/components/SpeedCard';
import { darkTheme } from '@/app/theme/darkTheme';
import { gpsManager } from '@/app/utils/gps';

const { width: screenWidth } = Dimensions.get('window');

export default function DashboardScreen() {
  const [currentRideData, setCurrentRideData] = useState({
    totalDistance: 0,
    currentSpeed: 0,
    duration: 0,
    averageSpeed: 0,
  });

  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      data: [],
      color: () => darkTheme.colors.primary,
      strokeWidth: 2,
    }],
  });

  // Mock historical data for demonstration
  const totalStats = {
    totalDistance: 245.7,
    totalRides: 18,
    avgSpeed: 18.5,
    totalTime: 1680, // minutes
  };

  const recentRides = [
    { id: 1, date: '2024-01-20', distance: 15.2, duration: 45, avgSpeed: 20.3 },
    { id: 2, date: '2024-01-18', distance: 22.8, duration: 68, avgSpeed: 19.8 },
    { id: 3, date: '2024-01-15', distance: 12.5, duration: 38, avgSpeed: 18.9 },
  ];

  // Update data when component mounts and periodically
  useEffect(() => {
    const updateData = () => {
      const gpsData = gpsManager.getTrackingData();

      setCurrentRideData({
        totalDistance: gpsData.totalDistance,
        currentSpeed: gpsData.currentSpeed,
        duration: gpsData.duration,
        averageSpeed: gpsData.averageSpeed,
      });

      // Generate chart data from location history
      updateChartData(gpsData.locationHistory);
    };

    // Initial update
    updateData();

    // Update every second if tracking
    const interval = setInterval(updateData, 1000);

    return () => clearInterval(interval);
  }, []);

  const updateChartData = (locationHistory) => {
    if (!locationHistory || locationHistory.length < 2) {
      // Show empty chart or mock data
      setChartData({
        labels: ['0:00', '1:00', '2:00', '3:00', '4:00'],
        datasets: [{
          data: [0, 5, 15, 12, 8],
          color: () => darkTheme.colors.primary,
          strokeWidth: 2,
        }],
      });
      return;
    }

    // Create speed vs time data points
    const startTime = locationHistory[0].timestamp;
    const speedPoints = [];
    const timeLabels = [];

    // Sample every 10 seconds to avoid too many data points
    let lastSampleTime = startTime;
    let lastLocation = locationHistory[0];

    locationHistory.forEach((location, index) => {
      const timeDiff = location.timestamp - lastSampleTime;

      if (timeDiff >= 10000 || index === locationHistory.length - 1) { // 10 seconds or last point
        // Calculate speed between last location and current
        const distance = calculateDistance(
          lastLocation.latitude, lastLocation.longitude,
          location.latitude, location.longitude
        );
        const timeHours = timeDiff / (1000 * 60 * 60);
        const speed = timeHours > 0 ? distance / timeHours : 0;

        speedPoints.push(Math.round(speed * 10) / 10); // Round to 1 decimal

        // Create time label (minutes:seconds)
        const totalSeconds = Math.floor((location.timestamp - startTime) / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        timeLabels.push(`${minutes}:${seconds.toString().padStart(2, '0')}`);

        lastSampleTime = location.timestamp;
        lastLocation = location;
      }
    });

    // Limit to last 20 points for better performance
    const maxPoints = 20;
    const startIndex = Math.max(0, speedPoints.length - maxPoints);
    const limitedSpeedPoints = speedPoints.slice(startIndex);
    const limitedLabels = timeLabels.slice(startIndex);

    setChartData({
      labels: limitedLabels,
      datasets: [{
        data: limitedSpeedPoints,
        color: () => darkTheme.colors.primary,
        strokeWidth: 2,
      }],
    });
  };

  // Helper function for distance calculation (simplified version)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Dashboard</Text>
          <Text style={styles.subtitle}>Your cycling performance</Text>
        </View>

        {/* Current Ride Stats */}
        <View style={styles.currentRide}>
          <Text style={styles.sectionTitle}>Current Ride</Text>
          <View style={styles.statsGrid}>
            <DistanceCard
              title="Distance"
              value={currentRideData.totalDistance.toFixed(1)}
              unit="km"
              style={styles.statCard}
            />
            <SpeedCard
              title="Current Speed"
              value={currentRideData.currentSpeed.toFixed(1)}
              unit="km/h"
              style={styles.statCard}
            />
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Duration</Text>
              <Text style={styles.statValue}>{formatDuration(Math.floor(currentRideData.duration / 60))}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Avg Speed</Text>
              <Text style={styles.statValue}>{currentRideData.averageSpeed.toFixed(1)} km/h</Text>
            </View>
          </View>
        </View>

        {/* Speed vs Time Chart */}
        <View style={styles.chartContainer}>
          <Text style={styles.sectionTitle}>Speed vs Time</Text>
          <View style={styles.chartCard}>
            <LineChart
              data={chartData}
              width={screenWidth - 2 * darkTheme.spacing.md}
              height={220}
              chartConfig={{
                backgroundColor: darkTheme.colors.card,
                backgroundGradientFrom: darkTheme.colors.card,
                backgroundGradientTo: darkTheme.colors.card,
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 255, 255, ${opacity})`, // Electric cyan
                labelColor: (opacity = 1) => `rgba(224, 224, 224, ${opacity})`, // High contrast text
                style: {
                  borderRadius: darkTheme.borderRadius.md,
                },
                propsForDots: {
                  r: '4',
                  strokeWidth: '2',
                  stroke: darkTheme.colors.primary,
                  fill: darkTheme.colors.background,
                },
                propsForLabels: {
                  fontSize: 12,
                  color: darkTheme.colors.textSecondary,
                },
              }}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines={false}
              withVerticalLabels={true}
              withHorizontalLabels={true}
              fromZero={true}
            />
          </View>
        </View>

        <View style={styles.totalStats}>
          <Text style={styles.sectionTitle}>Total Statistics</Text>
          <View style={styles.statsGrid}>
            <DistanceCard
              title="Total Distance"
              value={totalStats.totalDistance.toFixed(1)}
              unit="km"
              style={styles.statCard}
            />
            <SpeedCard
              title="Avg Speed"
              value={totalStats.avgSpeed.toFixed(1)}
              unit="km/h"
              style={styles.statCard}
            />
          </View>

          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Rides</Text>
              <Text style={styles.statValue}>{totalStats.totalRides}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Total Time</Text>
              <Text style={styles.statValue}>{formatDuration(totalStats.totalTime)}</Text>
            </View>
          </View>
        </View>

        <View style={styles.recentRides}>
          <Text style={styles.sectionTitle}>Recent Rides</Text>
          {recentRides.map((ride) => (
            <View key={ride.id} style={styles.rideCard}>
              <View style={styles.rideHeader}>
                <Text style={styles.rideDate}>{formatDate(ride.date)}</Text>
                <Text style={styles.rideDistance}>{ride.distance.toFixed(1)} km</Text>
              </View>
              <View style={styles.rideStats}>
                <Text style={styles.rideStat}>
                  {formatDuration(ride.duration)} • {ride.avgSpeed.toFixed(1)} km/h
                </Text>
              </View>
            </View>
          ))}
        </View>

        <View style={styles.insights}>
          <Text style={styles.sectionTitle}>Insights</Text>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>🎯 Goal Progress</Text>
            <Text style={styles.insightText}>You're 67% towards your 400km monthly goal!</Text>
          </View>
          <View style={styles.insightCard}>
            <Text style={styles.insightTitle}>📈 Improvement</Text>
            <Text style={styles.insightText}>Your average speed has increased by 2.1 km/h this month.</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.background,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: darkTheme.spacing.md,
  },
  header: {
    paddingVertical: darkTheme.spacing.xl,
    alignItems: 'center',
  },
  title: {
    fontSize: darkTheme.typography.fontSize.xxxl,
    fontWeight: darkTheme.typography.fontWeight.bold,
    color: darkTheme.colors.primary, // Neon accent
    marginBottom: darkTheme.spacing.sm,
    textShadowColor: darkTheme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 10,
  },
  subtitle: {
    fontSize: darkTheme.typography.fontSize.md,
    color: darkTheme.colors.textSecondary,
  },
  currentRide: {
    marginBottom: darkTheme.spacing.xl,
  },
  chartContainer: {
    marginBottom: darkTheme.spacing.xl,
  },
  chartCard: {
    backgroundColor: darkTheme.colors.card,
    borderRadius: darkTheme.borderRadius.md,
    padding: darkTheme.spacing.md,
    ...darkTheme.shadows.neon, // Neon glow effect for visibility
    borderWidth: 1,
    borderColor: darkTheme.colors.primary,
  },
  chart: {
    borderRadius: darkTheme.borderRadius.md,
    marginVertical: darkTheme.spacing.sm,
  },
  totalStats: {
    marginBottom: darkTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: darkTheme.typography.fontSize.lg,
    fontWeight: darkTheme.typography.fontWeight.semibold,
    color: darkTheme.colors.primary, // Neon accent
    marginBottom: darkTheme.spacing.md,
    textShadowColor: darkTheme.colors.primary,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 6,
  },
  statsGrid: {
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
    ...darkTheme.shadows.neon, // Neon glow for visibility
    borderWidth: 1,
    borderColor: darkTheme.colors.primary,
  },
  statLabel: {
    fontSize: darkTheme.typography.fontSize.sm,
    color: darkTheme.colors.textSecondary,
    marginBottom: darkTheme.spacing.xs,
  },
  statValue: {
    fontSize: darkTheme.typography.fontSize.lg,
    fontWeight: darkTheme.typography.fontWeight.bold,
    color: darkTheme.colors.accent, // Neon yellow accent
    textShadowColor: darkTheme.colors.accent,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  recentRides: {
    marginBottom: darkTheme.spacing.xl,
  },
  rideCard: {
    backgroundColor: darkTheme.colors.card,
    padding: darkTheme.spacing.md,
    borderRadius: darkTheme.borderRadius.md,
    marginBottom: darkTheme.spacing.sm,
    ...darkTheme.shadows.light,
  },
  rideHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: darkTheme.spacing.xs,
  },
  rideDate: {
    fontSize: darkTheme.typography.fontSize.md,
    fontWeight: darkTheme.typography.fontWeight.medium,
    color: darkTheme.colors.text,
  },
  rideDistance: {
    fontSize: darkTheme.typography.fontSize.md,
    fontWeight: darkTheme.typography.fontWeight.bold,
    color: darkTheme.colors.primary,
  },
  rideStats: {
    flexDirection: 'row',
  },
  rideStat: {
    fontSize: darkTheme.typography.fontSize.sm,
    color: darkTheme.colors.textSecondary,
  },
  insights: {
    marginBottom: darkTheme.spacing.xl,
  },
  insightCard: {
    backgroundColor: darkTheme.colors.card,
    padding: darkTheme.spacing.md,
    borderRadius: darkTheme.borderRadius.md,
    marginBottom: darkTheme.spacing.sm,
    ...darkTheme.shadows.light,
    borderWidth: 1,
    borderColor: darkTheme.colors.accent,
    shadowColor: darkTheme.colors.accent,
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  insightTitle: {
    fontSize: darkTheme.typography.fontSize.md,
    fontWeight: darkTheme.typography.fontWeight.semibold,
    color: darkTheme.colors.accent,
    marginBottom: darkTheme.spacing.xs,
  },
  insightText: {
    fontSize: darkTheme.typography.fontSize.sm,
    color: darkTheme.colors.text,
    lineHeight: 20,
  },
});