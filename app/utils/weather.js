// Weather utility for cyclist weather information
// Integrated with OpenWeatherMap API with battery-efficient caching

import { WEATHER_CONFIG } from '../config/weather';

class WeatherManager {
  constructor() {
    this.apiKey = WEATHER_CONFIG.API_KEY;
    this.baseUrl = WEATHER_CONFIG.BASE_URL;

    // Battery optimization: Caching system
    this.weatherCache = {
      data: null,
      location: null,
      timestamp: null,
      expiresAt: null,
    };

    // Cache settings for battery efficiency
    this.cacheDuration = WEATHER_CONFIG.CACHE_DURATION_MINUTES * 60 * 1000;
    this.locationThreshold = WEATHER_CONFIG.LOCATION_THRESHOLD_METERS;

    this.currentWeather = null;
    this.forecast = null;
  }

  // Set API key (you would get this from a secure source)
  setApiKey(key) {
    this.apiKey = key;
  }

  // Battery optimization: Check if we should fetch new weather data
  shouldFetchWeather(latitude, longitude) {
    const now = Date.now();

    // No cached data - fetch
    if (!this.weatherCache.data || !this.weatherCache.location) {
      return true;
    }

    // Cache expired - fetch
    if (now > this.weatherCache.expiresAt) {
      return true;
    }

    // Check if location changed significantly (more than threshold)
    if (this.weatherCache.location) {
      const { calculateDistance } = require('./distance');
      const distanceMoved = calculateDistance(
        this.weatherCache.location.latitude,
        this.weatherCache.location.longitude,
        latitude,
        longitude
      );

      if (distanceMoved > (this.locationThreshold / 1000)) { // Convert meters to km
        return true;
      }
    }

    // Use cached data
    return false;
  }

  // Update cache with new weather data
  updateCache(weatherData, latitude, longitude) {
    const now = Date.now();

    this.weatherCache = {
      data: weatherData,
      location: { latitude, longitude },
      timestamp: now,
      expiresAt: now + this.cacheDuration,
    };
  }

  // Get cached weather if available and valid
  getCachedWeather() {
    if (this.weatherCache.data && Date.now() < this.weatherCache.expiresAt) {
      return this.weatherCache.data;
    }
    return null;
  }

  // Get current weather for location with battery optimization
  async getCurrentWeather(latitude, longitude) {
    try {
      // Battery optimization: Check if we need to fetch new data
      if (!this.shouldFetchWeather(latitude, longitude)) {
        console.log('Using cached weather data for battery efficiency');
        return this.getCachedWeather();
      }

      // No API key - use mock data
      if (!this.apiKey) {
        console.log('No API key - using mock weather data');
        const mockData = this.getMockWeather();
        this.updateCache(mockData, latitude, longitude);
        return mockData;
      }

      console.log('Fetching fresh weather data from API');
      const response = await fetch(
        `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error(`Weather API request failed: ${response.status}`);
      }

      const data = await response.json();
      const formattedData = this.formatWeatherData(data);

      // Update cache with fresh data
      this.updateCache(formattedData, latitude, longitude);
      this.currentWeather = formattedData;

      return this.currentWeather;
    } catch (error) {
      console.error('Error fetching weather:', error);

      // Battery optimization: Try to return cached data even if API fails
      const cachedData = this.getCachedWeather();
      if (cachedData) {
        console.log('API failed, using cached weather data');
        return cachedData;
      }

      // Last resort: mock data
      console.log('No cached data available, using mock weather data');
      return this.getMockWeather();
    }
  }

  // Get weather forecast
  async getForecast(latitude, longitude) {
    try {
      if (!this.apiKey) {
        return this.getMockForecast();
      }

      const response = await fetch(
        `${this.baseUrl}/forecast?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`
      );

      if (!response.ok) {
        throw new Error('Forecast API request failed');
      }

      const data = await response.json();
      this.forecast = this.formatForecastData(data);
      return this.forecast;
    } catch (error) {
      console.error('Error fetching forecast:', error);
      return this.getMockForecast();
    }
  }

  // Format weather data for cyclist use
  formatWeatherData(data) {
    return {
      temperature: Math.round(data.main.temp),
      feelsLike: Math.round(data.main.feels_like),
      humidity: data.main.humidity,
      windSpeed: Math.round(data.wind.speed * 3.6), // Convert m/s to km/h
      windDirection: data.wind.deg,
      description: data.weather[0].description,
      icon: data.weather[0].icon,
      visibility: data.visibility / 1000, // Convert to km
      condition: this.getCyclistCondition(data.weather[0].id, data.main.temp),
    };
  }

  // Get cyclist-specific weather condition
  getCyclistCondition(weatherId, temperature) {
    // Weather conditions optimized for cycling
    if (weatherId >= 200 && weatherId < 300) {
      return 'stormy'; // Thunderstorm - dangerous for cycling
    }
    if (weatherId >= 300 && weatherId < 600) {
      return 'rainy'; // Rain - affects visibility and road conditions
    }
    if (weatherId >= 600 && weatherId < 700) {
      return 'snowy'; // Snow - very dangerous
    }
    if (weatherId >= 700 && weatherId < 800) {
      return 'foggy'; // Fog - poor visibility
    }
    if (weatherId === 800) {
      return temperature > 25 ? 'hot' : temperature < 10 ? 'cold' : 'perfect'; // Clear sky
    }
    if (weatherId > 800) {
      return temperature > 25 ? 'hot' : temperature < 10 ? 'cold' : 'good'; // Clouds
    }
    return 'unknown';
  }

  // Format forecast data
  formatForecastData(data) {
    return data.list.slice(0, 8).map(item => ({ // Next 24 hours (3-hour intervals)
      time: new Date(item.dt * 1000),
      temperature: Math.round(item.main.temp),
      condition: this.getCyclistCondition(item.weather[0].id, item.main.temp),
      description: item.weather[0].description,
      windSpeed: Math.round(item.wind.speed * 3.6),
      precipitation: item.pop * 100, // Probability of precipitation
    }));
  }

  // Mock weather data for demonstration
  getMockWeather() {
    return {
      temperature: 18,
      feelsLike: 20,
      humidity: 65,
      windSpeed: 12,
      windDirection: 180,
      description: 'Partly cloudy',
      icon: '02d',
      visibility: 10,
      condition: 'good',
    };
  }

  // Mock forecast data
  getMockForecast() {
    const now = new Date();
    return Array.from({ length: 8 }, (_, i) => ({
      time: new Date(now.getTime() + i * 3 * 60 * 60 * 1000),
      temperature: 16 + Math.random() * 8,
      condition: 'good',
      description: 'Clear sky',
      windSpeed: 8 + Math.random() * 10,
      precipitation: Math.random() * 30,
    }));
  }

  // Get weather for current GPS location
  async getWeatherForCurrentLocation() {
    try {
      const gpsData = require('./gps').gpsManager.getTrackingData();

      if (!gpsData.currentLocation) {
        console.log('No GPS location available');
        return this.getMockWeather();
      }

      return await this.getCurrentWeather(
        gpsData.currentLocation.latitude,
        gpsData.currentLocation.longitude
      );
    } catch (error) {
      console.error('Error getting weather for current location:', error);
      return this.getMockWeather();
    }
  }

  // Get cache status for debugging/monitoring
  getCacheStatus() {
    const now = Date.now();

    return {
      hasData: !!this.weatherCache.data,
      isExpired: now > (this.weatherCache.expiresAt || 0),
      age: this.weatherCache.timestamp ? now - this.weatherCache.timestamp : null,
      expiresIn: this.weatherCache.expiresAt ? this.weatherCache.expiresAt - now : null,
      location: this.weatherCache.location,
    };
  }

  // Clear cache (useful for testing or manual refresh)
  clearCache() {
    this.weatherCache = {
      data: null,
      location: null,
      timestamp: null,
      expiresAt: null,
    };
  }

  // Force refresh weather data (bypasses cache)
  async forceRefreshWeather(latitude, longitude) {
    console.log('Force refreshing weather data');
    const response = await fetch(
      `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`
    );

    if (!response.ok) {
      throw new Error(`Weather API request failed: ${response.status}`);
    }

    const data = await response.json();
    const formattedData = this.formatWeatherData(data);

    // Update cache with fresh data
    this.updateCache(formattedData, latitude, longitude);
    this.currentWeather = formattedData;

    return this.currentWeather;
  }

  // Get cycling recommendations based on weather
  getCyclingRecommendation(weather) {
    const { condition, temperature, windSpeed, humidity } = weather;

    if (condition === 'stormy' || condition === 'snowy') {
      return {
        canRide: false,
        message: 'Not recommended - dangerous weather conditions',
        gear: ['helmet', 'lights', 'reflective clothing'],
      };
    }

    if (condition === 'rainy') {
      return {
        canRide: temperature > 5,
        message: temperature > 5 ? 'Ride with caution - wet roads' : 'Too cold and wet to ride safely',
        gear: ['helmet', 'rain jacket', 'waterproof pants', 'lights', 'reflective clothing'],
      };
    }

    if (condition === 'foggy') {
      return {
        canRide: true,
        message: 'Ride with extra caution - reduced visibility',
        gear: ['helmet', 'lights', 'reflective clothing', 'bright colors'],
      };
    }

    if (temperature < 5) {
      return {
        canRide: true,
        message: 'Cold weather - dress warmly',
        gear: ['helmet', 'thermal layers', 'gloves', 'neck warmer', 'lights'],
      };
    }

    if (temperature > 30) {
      return {
        canRide: true,
        message: 'Hot weather - stay hydrated',
        gear: ['helmet', 'breathable clothing', 'sunglasses', 'sunscreen'],
      };
    }

    if (windSpeed > 25) {
      return {
        canRide: true,
        message: 'Strong winds - be careful on exposed roads',
        gear: ['helmet', 'aerodynamic clothing'],
      };
    }

    return {
      canRide: true,
      message: 'Perfect cycling weather!',
      gear: ['helmet', 'comfortable clothing'],
    };
  }
}

// Export singleton instance
export const weatherManager = new WeatherManager();
export default weatherManager;