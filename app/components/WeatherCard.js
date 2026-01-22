import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { weatherManager } from '../utils/weather';
import { gpsManager } from '../utils/gps';
import { darkTheme } from '../theme/darkTheme';

export function WeatherCard({ style, showRefresh = true }) {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadWeather();
  }, []);

  const loadWeather = async () => {
    try {
      setLoading(true);
      setError(null);

      const weatherData = await weatherManager.getWeatherForCurrentLocation();
      setWeather(weatherData);
    } catch (err) {
      console.error('Error loading weather:', err);
      setError('Failed to load weather');
      Alert.alert('Weather Error', 'Unable to fetch weather data. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    loadWeather();
  };

  const getWeatherIcon = (condition) => {
    const icons = {
      sunny: '☀️',
      cloudy: '☁️',
      rainy: '🌧️',
      snowy: '❄️',
      stormy: '⛈️',
      foggy: '🌫️',
      windy: '💨',
      perfect: '🌟',
      good: '👍',
      hot: '🔥',
      cold: '🧊',
    };
    return icons[condition] || '🌤️';
  };

  const getConditionColor = (condition) => {
    const colors = {
      perfect: darkTheme.colors.success,
      good: darkTheme.colors.primary,
      sunny: darkTheme.colors.accent,
      cloudy: darkTheme.colors.textSecondary,
      rainy: darkTheme.colors.warning,
      snowy: darkTheme.colors.error,
      stormy: darkTheme.colors.error,
      foggy: darkTheme.colors.textMuted,
      windy: darkTheme.colors.primary,
      hot: darkTheme.colors.warning,
      cold: darkTheme.colors.primary,
    };
    return colors[condition] || darkTheme.colors.text;
  };

  if (loading && !weather) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.loadingText}>Loading weather...</Text>
      </View>
    );
  }

  if (error && !weather) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.errorText}>Weather unavailable</Text>
        <TouchableOpacity style={styles.retryButton} onPress={loadWeather}>
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!weather) {
    return (
      <View style={[styles.container, style]}>
        <Text style={styles.noDataText}>No weather data</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <Text style={styles.title}>Weather</Text>
        {showRefresh && (
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={handleRefresh}
            disabled={loading}
          >
            <Text style={[styles.refreshText, loading && styles.refreshDisabled]}>
              {loading ? '⟳' : '🔄'}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.weatherContent}>
        <View style={styles.mainInfo}>
          <Text style={styles.weatherIcon}>{getWeatherIcon(weather.condition)}</Text>
          <View style={styles.temperatureContainer}>
            <Text style={styles.temperature}>{weather.temperature}°</Text>
            <Text style={styles.unit}>C</Text>
          </View>
        </View>

        <Text style={[styles.condition, { color: getConditionColor(weather.condition) }]}>
          {weather.description}
        </Text>

        <View style={styles.details}>
          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Feels like</Text>
            <Text style={styles.detailValue}>{weather.feelsLike}°C</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Wind</Text>
            <Text style={styles.detailValue}>{weather.windSpeed} km/h</Text>
          </View>

          <View style={styles.detailItem}>
            <Text style={styles.detailLabel}>Humidity</Text>
            <Text style={styles.detailValue}>{weather.humidity}%</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: darkTheme.colors.card,
    borderRadius: darkTheme.borderRadius.md,
    padding: darkTheme.spacing.md,
    ...darkTheme.shadows.light,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: darkTheme.spacing.sm,
  },
  title: {
    fontSize: darkTheme.typography.fontSize.md,
    fontWeight: darkTheme.typography.fontWeight.medium,
    color: darkTheme.colors.text,
  },
  refreshButton: {
    padding: darkTheme.spacing.xs,
  },
  refreshText: {
    fontSize: darkTheme.typography.fontSize.md,
  },
  refreshDisabled: {
    opacity: 0.5,
  },
  weatherContent: {
    alignItems: 'center',
  },
  mainInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: darkTheme.spacing.xs,
  },
  weatherIcon: {
    fontSize: 32,
    marginRight: darkTheme.spacing.sm,
  },
  temperatureContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  temperature: {
    fontSize: darkTheme.typography.fontSize.xxxl,
    fontWeight: darkTheme.typography.fontWeight.bold,
    color: darkTheme.colors.primary,
  },
  unit: {
    fontSize: darkTheme.typography.fontSize.lg,
    color: darkTheme.colors.textSecondary,
    marginLeft: darkTheme.spacing.xs,
  },
  condition: {
    fontSize: darkTheme.typography.fontSize.md,
    fontWeight: darkTheme.typography.fontWeight.medium,
    textAlign: 'center',
    marginBottom: darkTheme.spacing.md,
  },
  details: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  detailItem: {
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: darkTheme.typography.fontSize.xs,
    color: darkTheme.colors.textSecondary,
    marginBottom: darkTheme.spacing.xs,
  },
  detailValue: {
    fontSize: darkTheme.typography.fontSize.sm,
    fontWeight: darkTheme.typography.fontWeight.medium,
    color: darkTheme.colors.text,
  },
  loadingText: {
    color: darkTheme.colors.textSecondary,
    textAlign: 'center',
    padding: darkTheme.spacing.md,
  },
  errorText: {
    color: darkTheme.colors.error,
    textAlign: 'center',
    marginBottom: darkTheme.spacing.sm,
  },
  retryButton: {
    backgroundColor: darkTheme.colors.primary,
    paddingHorizontal: darkTheme.spacing.md,
    paddingVertical: darkTheme.spacing.xs,
    borderRadius: darkTheme.borderRadius.sm,
    alignSelf: 'center',
  },
  retryButtonText: {
    color: darkTheme.colors.text,
    fontSize: darkTheme.typography.fontSize.sm,
    fontWeight: darkTheme.typography.fontWeight.medium,
  },
  noDataText: {
    color: darkTheme.colors.textMuted,
    textAlign: 'center',
    padding: darkTheme.spacing.md,
  },
});