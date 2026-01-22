import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { DistanceCard } from '@/app/components/DistanceCard';
import { SpeedCard } from '@/app/components/SpeedCard';
import { WeatherCard } from '@/app/components/WeatherCard';
import { darkTheme } from '@/app/theme/darkTheme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.title}>Cyclist Companion</Text>
          <Text style={styles.subtitle}>Your cycling adventure starts here</Text>
        </View>

        <View style={styles.quickStats}>
          <Text style={styles.sectionTitle}>Today's Stats</Text>
          <View style={styles.statsGrid}>
            <DistanceCard
              title="Distance"
              value="0.0"
              unit="km"
              style={styles.statCard}
            />
            <SpeedCard
              title="Avg Speed"
              value="0.0"
              unit="km/h"
              style={styles.statCard}
            />
          </View>
        </View>

        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionButtons}>
            <View style={styles.actionButton}>
              <Text style={styles.actionButtonText}>Start Ride</Text>
            </View>
            <View style={[styles.actionButton, styles.secondaryButton]}>
              <Text style={[styles.actionButtonText, styles.secondaryButtonText]}>View Routes</Text>
            </View>
          </View>
        </View>

        <View style={styles.weatherSection}>
          <WeatherCard />
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
    color: darkTheme.colors.primary,
    marginBottom: darkTheme.spacing.sm,
  },
  subtitle: {
    fontSize: darkTheme.typography.fontSize.md,
    color: darkTheme.colors.textSecondary,
    textAlign: 'center',
  },
  quickStats: {
    marginBottom: darkTheme.spacing.xl,
  },
  sectionTitle: {
    fontSize: darkTheme.typography.fontSize.lg,
    fontWeight: darkTheme.typography.fontWeight.semibold,
    color: darkTheme.colors.text,
    marginBottom: darkTheme.spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    marginHorizontal: darkTheme.spacing.xs,
  },
  quickActions: {
    marginBottom: darkTheme.spacing.xl,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    backgroundColor: darkTheme.colors.primary,
    paddingVertical: darkTheme.spacing.md,
    paddingHorizontal: darkTheme.spacing.lg,
    borderRadius: darkTheme.borderRadius.md,
    flex: 1,
    marginHorizontal: darkTheme.spacing.xs,
    alignItems: 'center',
  },
  actionButtonText: {
    color: darkTheme.colors.text,
    fontSize: darkTheme.typography.fontSize.md,
    fontWeight: darkTheme.typography.fontWeight.medium,
  },
  secondaryButton: {
    backgroundColor: darkTheme.colors.surface,
    borderWidth: 1,
    borderColor: darkTheme.colors.border,
  },
  secondaryButtonText: {
    color: darkTheme.colors.primary,
  },
  weatherSection: {
    marginBottom: darkTheme.spacing.xl,
  },
});