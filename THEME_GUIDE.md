# Dark Mode Theme Guide for Cyclist Companion

This guide explains the optimized dark theme designed specifically for cycling apps, focusing on outdoor visibility, battery efficiency, and accessibility.

## 🎨 **Theme Philosophy**

### **Outdoor Visibility First**
- **High contrast ratios** (>15:1) for daylight visibility
- **Neon accent colors** that stand out in bright sunlight
- **Pure black backgrounds** for maximum contrast
- **Large, bold text** for quick reading while cycling

### **Battery Efficiency**
- **OLED-optimized** pure black backgrounds (#000000)
- **Minimal use of semi-transparent elements**
- **Reduced animations** and effects when battery low
- **Solid colors** instead of gradients where possible

### **Accessibility**
- **WCAG AA compliant** contrast ratios
- **Touch targets** minimum 44px for outdoor use
- **High visibility** color coding for status indicators
- **Reduced motion** support for user preference

## 🎯 **Color System**

### **Primary Colors**
```javascript
primary: '#00FFFF'    // Electric cyan - main brand color
secondary: '#0080FF'  // Bright blue - secondary actions
accent: '#FFFF00'     // Pure yellow - highlights & alerts
highlight: '#FF0080'  // Neon pink - special alerts
```

### **Background Hierarchy**
```javascript
background: '#000000'  // Pure black - main background
surface: '#0D0D0D'     // Very dark gray - secondary surfaces
card: '#1A1A1A'        // Medium dark gray - cards & panels
modal: '#0A0A0A'       // Modal backgrounds
```

### **Text Colors**
```javascript
text: '#FFFFFF'        // Pure white - primary text
textSecondary: '#E0E0E0' // Light gray - secondary text
textMuted: '#B0B0B0'   // Medium gray - muted text
textDisabled: '#666666' // Disabled text
```

### **Status Colors**
```javascript
success: '#00FF00'     // Pure green - good conditions
warning: '#FFA500'     // Bright orange - caution
error: '#FF0000'       // Pure red - danger
info: '#00FFFF'        // Cyan - information
```

## 🚴 **Cycling-Specific Features**

### **Speed-Based Color Coding**
```javascript
speedExcellent: '#00FF00'  // >25 km/h - Excellent
speedGood: '#FFFF00'       // 18-25 km/h - Good
speedModerate: '#FFA500'   // 12-18 km/h - Moderate
speedSlow: '#FF4500'       // 6-12 km/h - Slow
speedStopped: '#FF0000'    // <6 km/h - Very Slow/Stopped
```

### **Weather Condition Colors**
```javascript
weatherSunny: '#FFFF00'    // Sunny conditions
weatherCloudy: '#C0C0C0'   // Cloudy
weatherRainy: '#0080FF'    // Rain
weatherSnowy: '#FFFFFF'    // Snow
weatherFoggy: '#A0A0A0'    // Fog
weatherStormy: '#800080'   // Stormy
```

### **Temperature Indicators**
```javascript
tempHot: '#FF4500'         // >30°C - Hot
tempWarm: '#FFA500'        // 20-30°C - Warm
tempComfortable: '#00FF00'  // 10-20°C - Comfortable
tempCool: '#0080FF'        // 0-10°C - Cool
tempCold: '#0000FF'        // <0°C - Cold
```

## 🔋 **Battery Optimization**

### **OLED-Friendly Colors**
- Pure black (`#000000`) backgrounds save significant battery
- Avoid white/light backgrounds that waste power
- Use dark grays sparingly for hierarchy

### **Performance Features**
```javascript
performance: {
  reducedMotion: false,      // Can be set to true for low battery
  preferSolidColors: true,   // Avoid gradients for battery savings
  disableShadows: false,     // Can disable for low battery
}
```

### **Conditional Styling**
```javascript
// Example: Reduce visual effects when battery low
const batteryLevel = getBatteryLevel();
const themeColors = batteryLevel < 20 ?
  { ...darkTheme.colors, shadows: {} } : // Disable shadows
  darkTheme.colors;
```

## 🌟 **Neon Effects & Visibility**

### **Glow Effects**
```javascript
shadows: {
  neon: {
    shadowColor: '#00FFFF',
    shadowOpacity: 0.8,
    shadowRadius: 8,
  },
  warningGlow: {
    shadowColor: '#FFFF00',
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
}
```

### **Text Shadows for Visibility**
```javascript
// Apply to important text elements
textShadowColor: darkTheme.colors.primary,
textShadowOffset: { width: 0, height: 0 },
textShadowRadius: 8,
```

## 📱 **Component Usage Examples**

### **Speed Card with Dynamic Colors**
```javascript
const speedColor = darkTheme.cycling.speedColors[
  numSpeed >= 25 ? 'excellent' :
  numSpeed >= 18 ? 'good' :
  numSpeed >= 12 ? 'moderate' :
  numSpeed >= 6 ? 'slow' : 'verySlow'
];
```

### **Weather-Based Styling**
```javascript
const weatherStyle = {
  color: darkTheme.colors[`weather${weatherCondition}`],
  textShadowColor: darkTheme.colors[`weather${weatherCondition}`],
  textShadowRadius: 6,
};
```

### **Battery-Aware Theming**
```javascript
const getOptimizedTheme = (batteryLevel) => ({
  ...darkTheme,
  shadows: batteryLevel < 30 ? {} : darkTheme.shadows,
  colors: {
    ...darkTheme.colors,
    // Dim colors when battery low
    accent: batteryLevel < 15 ? '#666600' : darkTheme.colors.accent,
  },
});
```

## 🎨 **Design Guidelines**

### **Typography**
- **Font sizes**: Minimum 14px for readability
- **Weights**: Bold for important information
- **Contrast**: Always >4.5:1 for accessibility

### **Spacing**
- **Touch targets**: Minimum 44px
- **Padding**: Generous for outdoor use
- **Margins**: Clear separation between elements

### **Interactive Elements**
- **Ripple effects**: Subtle cyan glow
- **Focus states**: Yellow outline for keyboard navigation
- **Pressed states**: Slight darkening

## 🔧 **Implementation**

### **Applying the Theme**
```javascript
import { darkTheme } from '@/app/theme/darkTheme';

// Use in components
const styles = StyleSheet.create({
  card: {
    backgroundColor: darkTheme.colors.card,
    borderColor: darkTheme.colors.border,
    borderWidth: 1,
    borderRadius: darkTheme.borderRadius.md,
    ...darkTheme.shadows.light,
  },
  speedText: {
    color: darkTheme.colors.primary,
    fontSize: darkTheme.typography.fontSize.xxl,
    fontWeight: darkTheme.typography.fontWeight.bold,
    textShadowColor: darkTheme.colors.primary,
    textShadowRadius: 6,
  },
});
```

### **Dynamic Theming**
```javascript
// Speed-based text color
const speedStyle = {
  color: getSpeedColor(currentSpeed),
  textShadowColor: getSpeedColor(currentSpeed),
  textShadowRadius: 8,
};

// Weather-based styling
const weatherIconStyle = {
  color: darkTheme.colors[`weather${condition}`],
  textShadowColor: darkTheme.colors[`weather${condition}`],
};
```

## 🌙 **Night vs Day Considerations**

### **Night Cycling**
- **Maximum contrast** for safety
- **Blue-light minimal** to preserve night vision
- **Red accents** for emergency information
- **Reduced brightness** awareness

### **Day Cycling**
- **High contrast** against bright backgrounds
- **Neon colors** that stand out in sunlight
- **Large text** for quick glances
- **Bold outlines** for visibility

## 📊 **Testing & Validation**

### **Contrast Testing**
- Use tools like WebAIM contrast checker
- Test on actual devices in outdoor conditions
- Validate with colorblind users
- Check battery impact of different color schemes

### **Performance Testing**
- Monitor battery usage with different themes
- Test render performance with neon effects
- Validate accessibility compliance
- Check touch target sizes on devices

## 🚀 **Best Practices**

1. **Always use theme colors** instead of hardcoded values
2. **Test in actual cycling conditions** (daylight, night, weather)
3. **Monitor battery usage** and optimize accordingly
4. **Provide accessibility options** for different user needs
5. **Use semantic color names** for maintainability
6. **Document color usage** for consistency
7. **Test with real GPS data** for accurate color coding

This theme provides maximum visibility for cyclists while optimizing for battery life and accessibility. The neon accent colors ensure critical information stands out in all lighting conditions! 🚴‍♂️🌟