import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { darkTheme } from '../theme/darkTheme';

export function DistanceCard({ title, value, unit, style }) {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.valueContainer}>
        <Text style={styles.value}>{value}</Text>
        <Text style={styles.unit}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.colors.card,
    padding: darkTheme.spacing.md,
    borderRadius: darkTheme.borderRadius.md,
    alignItems: 'center',
    ...darkTheme.shadows.light,
  },
  title: {
    fontSize: darkTheme.typography.fontSize.sm,
    color: darkTheme.colors.textSecondary,
    marginBottom: darkTheme.spacing.xs,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: darkTheme.typography.fontSize.xxl,
    fontWeight: darkTheme.typography.fontWeight.bold,
    color: darkTheme.colors.primary,
    marginRight: darkTheme.spacing.xs,
  },
  unit: {
    fontSize: darkTheme.typography.fontSize.md,
    color: darkTheme.colors.textSecondary,
    fontWeight: darkTheme.typography.fontWeight.medium,
  },
});