# OpenWeatherMap API Setup

This guide explains how to set up the OpenWeatherMap API for the Cyclist Companion app.

## 🚀 Quick Setup

### 1. Get an API Key
1. Visit [OpenWeatherMap API](https://openweathermap.org/api)
2. Click "Sign Up" and create a free account
3. Go to your API keys section in the dashboard
4. Copy your API key

### 2. Configure the App

#### Option A: Environment Variable (Recommended)
Add to your `.env` file:
```
EXPO_PUBLIC_OPENWEATHER_API_KEY=your_api_key_here
```

#### Option B: Direct Configuration
Edit `app/config/weather.js`:
```javascript
export const WEATHER_CONFIG = {
  API_KEY: 'your_api_key_here', // Replace with your actual key
  // ... rest of config
};
```

### 3. Restart the App
```bash
npm start
# or
expo start --clear
```

## 📊 API Usage & Limits

### Free Tier (Default)
- **1,000 calls/day**
- **10 calls/minute**
- Current weather and basic forecasts
- Suitable for development and small user base

### Paid Tiers
- **10,000+ calls/day** ($0.0015/call)
- Higher rate limits
- Advanced weather data
- Required for production apps

## 🔋 Battery Optimization Features

The weather integration includes several battery-saving optimizations:

### Smart Caching
- **15-minute cache duration** (configurable)
- Weather data cached locally on device
- Only fetches when cache expires

### Location-Based Updates
- **5km location threshold** (configurable)
- Only updates weather when you move significantly
- Reduces API calls during local rides

### Intelligent Refresh
- Uses GPS location changes to trigger updates
- Fallback to cached data if API fails
- Graceful degradation with mock data

### Cache Management
```javascript
import { weatherManager } from './app/utils/weather';

// Check cache status
const status = weatherManager.getCacheStatus();
console.log('Cache expires in:', status.expiresIn / 1000 / 60, 'minutes');

// Force refresh (bypasses cache)
await weatherManager.forceRefreshWeather(latitude, longitude);

// Clear cache
weatherManager.clearCache();
```

## 🌤️ Weather Data Display

The `WeatherCard` component displays:
- **Temperature** in Celsius
- **Wind speed** in km/h
- **Weather condition** with cyclist-friendly icons
- **Feels like** temperature
- **Humidity** percentage

### Weather Conditions
- ☀️ Sunny/Perfect
- ☁️ Cloudy/Good
- 🌧️ Rainy (caution)
- ❄️ Snowy (dangerous)
- ⛈️ Stormy (dangerous)
- 🌫️ Foggy (caution)
- 💨 Windy
- 🔥 Hot
- 🧊 Cold

## 🛠️ Customization

### Cache Settings
Edit `app/config/weather.js`:
```javascript
export const WEATHER_CONFIG = {
  CACHE_DURATION_MINUTES: 10,      // Cache for 10 minutes
  LOCATION_THRESHOLD_METERS: 1000, // Update every 1km moved
};
```

### Units
```javascript
// In weather.js getCurrentWeather method
const response = await fetch(
  `${this.baseUrl}/weather?lat=${latitude}&lon=${longitude}&appid=${this.apiKey}&units=metric`
);
// Options: metric (Celsius), imperial (Fahrenheit), standard (Kelvin)
```

## 🔍 Troubleshooting

### Common Issues

**"Weather unavailable"**
- Check internet connection
- Verify API key is correct
- Check API key hasn't expired

**"API request failed: 401"**
- Invalid API key
- Check API key in configuration

**"API request failed: 429"**
- Rate limit exceeded (free tier: 10 calls/minute)
- Wait a few minutes or upgrade plan

**No weather updates**
- Check GPS permissions
- Verify location services enabled
- Check if cache is working (use `getCacheStatus()`)

### Debug Logging
Enable detailed logging by adding to weather methods:
```javascript
console.log('Weather cache status:', weatherManager.getCacheStatus());
console.log('GPS location:', gpsManager.getTrackingData().currentLocation);
```

## 📚 API Reference

- [OpenWeatherMap API Docs](https://openweathermap.org/api)
- [Current Weather API](https://openweathermap.org/current)
- [API Key Management](https://openweathermap.org/appid)

## 🤝 Contributing

When modifying weather functionality:
1. Test with both real API and mock data
2. Verify battery optimizations work
3. Check error handling for network failures
4. Update this documentation if needed