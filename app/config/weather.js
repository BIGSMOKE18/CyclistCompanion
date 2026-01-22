// Weather API Configuration
// Get your free API key from: https://openweathermap.org/api

export const WEATHER_CONFIG = {
  // Replace with your OpenWeatherMap API key
  // Sign up at: https://openweathermap.org/api
  API_KEY: process.env.EXPO_PUBLIC_OPENWEATHER_API_KEY || null,

  // API endpoints
  BASE_URL: 'https://api.openweathermap.org/data/2.5',

  // Units: metric, imperial, or standard
  UNITS: 'metric',

  // Cache settings for battery optimization
  CACHE_DURATION_MINUTES: 15,
  LOCATION_THRESHOLD_METERS: 5000, // 5km
};

// Instructions for setup:
// 1. Sign up for a free account at https://openweathermap.org/api
// 2. Get your API key from the dashboard
// 3. Add to your environment variables:
//    EXPO_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
// 4. Or set it directly: WEATHER_CONFIG.API_KEY = 'your_api_key_here';

// Free tier limits: 1,000 calls/day, 10 minutely
// Consider upgrading for production use