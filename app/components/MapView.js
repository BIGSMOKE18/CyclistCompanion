import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { darkTheme } from '../theme/darkTheme';

export function MapView({ style }) {
  return (
    <View style={[styles.container, style]}>
      <View style={styles.mapPlaceholder}>
        <Text style={styles.mapText}>🗺️</Text>
        <Text style={styles.placeholderText}>Map View</Text>
        <Text style={styles.subText}>GPS tracking active</Text>
      </View>

      {/* GPS Status Indicator */}
      <View style={styles.gpsIndicator}>
        <View style={styles.gpsDot} />
        <Text style={styles.gpsText}>GPS Active</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: darkTheme.colors.card,
    borderRadius: darkTheme.borderRadius.md,
    overflow: 'hidden',
    position: 'relative',
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: darkTheme.colors.surface,
  },
  mapText: {
    fontSize: 48,
    marginBottom: darkTheme.spacing.sm,
  },
  placeholderText: {
    fontSize: darkTheme.typography.fontSize.lg,
    color: darkTheme.colors.text,
    fontWeight: darkTheme.typography.fontWeight.medium,
  },
  subText: {
    fontSize: darkTheme.typography.fontSize.sm,
    color: darkTheme.colors.textSecondary,
    marginTop: darkTheme.spacing.xs,
  },
  gpsIndicator: {
    position: 'absolute',
    top: darkTheme.spacing.md,
    right: darkTheme.spacing.md,
    backgroundColor: darkTheme.colors.overlay,
    paddingHorizontal: darkTheme.spacing.sm,
    paddingVertical: darkTheme.spacing.xs,
    borderRadius: darkTheme.borderRadius.sm,
    flexDirection: 'row',
    alignItems: 'center',
  },
  gpsDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: darkTheme.colors.success,
    marginRight: darkTheme.spacing.xs,
  },
  gpsText: {
    fontSize: darkTheme.typography.fontSize.xs,
    color: darkTheme.colors.text,
    fontWeight: darkTheme.typography.fontWeight.medium,
  },
});