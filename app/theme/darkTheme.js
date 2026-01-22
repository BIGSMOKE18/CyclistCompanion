export const darkTheme = {
  colors: {
    // ===== PRIMARY BRAND COLORS =====
    // High-visibility neon colors for outdoor cycling
    primary: '#00FFFF', // Electric cyan - maximum visibility
    secondary: '#0080FF', // Bright blue
    accent: '#FFFF00', // Pure yellow - highest contrast
    highlight: '#FF0080', // Neon pink for special alerts

    // ===== BACKGROUNDS =====
    // True black for OLED battery efficiency and maximum contrast
    background: '#000000', // Pure black - OLED friendly
    surface: '#0D0D0D', // Very dark gray (13/255) - minimal power
    card: '#1A1A1A', // Dark gray (26/255) - card backgrounds
    modal: '#0A0A0A', // Slightly lighter than background

    // ===== TEXT COLORS =====
    // Maximum contrast for outdoor readability
    text: '#FFFFFF', // Pure white - 21:1 contrast ratio
    textSecondary: '#E0E0E0', // Light gray - 17:1 contrast ratio
    textMuted: '#B0B0B0', // Medium gray - 12:1 contrast ratio
    textDisabled: '#666666', // Dark gray for disabled states

    // ===== STATUS COLORS =====
    // High-visibility colors for critical cycling information
    success: '#00FF00', // Pure green - visible in all conditions
    warning: '#FFA500', // Bright orange - caution alerts
    error: '#FF0000', // Pure red - danger alerts
    info: '#00FFFF', // Cyan - informational

    // ===== SPEED INDICATORS =====
    // Color-coded speed ranges for instant recognition
    speedExcellent: '#00FF00', // 25+ km/h - green
    speedGood: '#FFFF00', // 18-25 km/h - yellow
    speedModerate: '#FFA500', // 12-18 km/h - orange
    speedSlow: '#FF4500', // <12 km/h - red-orange
    speedStopped: '#FF0000', // 0 km/h - red

    // ===== WEATHER CONDITIONS =====
    // Weather-specific colors for quick recognition
    weatherSunny: '#FFFF00', // Bright yellow - sunny
    weatherCloudy: '#C0C0C0', // Light gray - cloudy
    weatherRainy: '#0080FF', // Bright blue - rain
    weatherSnowy: '#FFFFFF', // White - snow
    weatherFoggy: '#A0A0A0', // Medium gray - fog
    weatherStormy: '#800080', // Purple - storms

    // ===== TEMPERATURE INDICATORS =====
    tempHot: '#FF4500', // Red-orange for hot (>30°C)
    tempWarm: '#FFA500', // Orange for warm (20-30°C)
    tempComfortable: '#00FF00', // Green for comfortable (10-20°C)
    tempCool: '#0080FF', // Blue for cool (0-10°C)
    tempCold: '#0000FF', // Dark blue for cold (<0°C)

    // ===== BORDERS & DIVIDERS =====
    // Subtle but visible in low light
    border: '#333333', // Medium dark gray
    borderLight: '#555555', // Lighter border for focus states
    divider: '#333333', // Same as border for consistency

    // ===== INTERACTIVE ELEMENTS =====
    // Optimized for touch interaction outdoors
    ripple: 'rgba(0, 255, 255, 0.2)', // Cyan ripple effect
    focus: 'rgba(255, 255, 0, 0.3)', // Yellow focus ring
    overlay: 'rgba(0, 0, 0, 0.7)', // Dark overlay for modals

    // ===== NAVIGATION =====
    navBackground: '#000000', // Pure black for tab bar
    navActive: '#00FFFF', // Electric cyan for active tab
    navInactive: '#666666', // Medium gray for inactive tabs

    // ===== SPECIAL USE CASES =====
    emergency: '#FF0000', // Pure red for emergencies
    batteryLow: '#FF4500', // Orange-red for low battery
    signalLost: '#FFA500', // Orange for GPS/signal loss
    recording: '#00FF00', // Green for active recording
  },

  typography: {
    fontSize: {
      xs: 12,
      sm: 14,
      md: 16,
      lg: 18,
      xl: 20,
      xxl: 24,
      xxxl: 32,
    },
    fontWeight: {
      light: '300',
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },

  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },

  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    round: 50,
  },

  shadows: {
    // Minimal shadows for battery efficiency
    light: {
      shadowColor: '#00FFFF',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.3,
      shadowRadius: 2,
      elevation: 2,
    },
    medium: {
      shadowColor: '#00FFFF',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.4,
      shadowRadius: 4,
      elevation: 4,
    },
    strong: {
      shadowColor: '#00FFFF',
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: 0.5,
      shadowRadius: 6,
      elevation: 6,
    },
    // Neon glow effects for visibility
    neon: {
      shadowColor: '#00FFFF',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 8,
      elevation: 8,
    },
    warningGlow: {
      shadowColor: '#FFFF00',
      shadowOffset: { width: 0, height: 0 },
      shadowOpacity: 0.8,
      shadowRadius: 6,
      elevation: 6,
    },
  },

  // ===== ACCESSIBILITY =====
  accessibility: {
    // Minimum touch target sizes for outdoor use
    minTouchTarget: 44, // iOS/Android standard
    largeTouchTarget: 48, // For important buttons

    // High contrast mode colors
    highContrast: {
      text: '#FFFFFF',
      background: '#000000',
      border: '#FFFFFF',
      focus: '#FFFF00',
    },
  },

  // ===== CYCLING-SPECIFIC STYLES =====
  cycling: {
    // Speed display colors based on performance
    speedColors: {
      excellent: '#00FF00', // >25 km/h
      good: '#FFFF00',       // 18-25 km/h
      moderate: '#FFA500',   // 12-18 km/h
      slow: '#FF4500',       // 6-12 km/h
      verySlow: '#FF0000',   // <6 km/h
    },

    // Weather impact colors
    weatherImpact: {
      excellent: '#00FF00', // Perfect conditions
      good: '#FFFF00',      // Good conditions
      moderate: '#FFA500',  // Moderate impact
      poor: '#FF4500',      // Significant impact
      dangerous: '#FF0000', // Unsafe conditions
    },

    // Battery level colors
    batteryColors: {
      full: '#00FF00',      // >80%
      good: '#FFFF00',      // 60-80%
      moderate: '#FFA500',  // 30-60%
      low: '#FF4500',       // 15-30%
      critical: '#FF0000',  // <15%
    },
  },

  // ===== PERFORMANCE OPTIMIZATIONS =====
  performance: {
    // Reduce animations in low battery
    reducedMotion: false,
    // Use solid colors instead of gradients for battery savings
    preferSolidColors: true,
    // Disable complex shadows when battery low
    disableShadows: false,
  },

  // ===== GRADIENTS =====
  // Limited use for battery efficiency, only for special cases
  gradients: {
    primary: ['#000000', '#001111'], // Subtle dark gradient
    accent: ['#000000', '#111100'], // Yellow tint
    warning: ['#000000', '#110000'], // Red tint
  },
};

export default darkTheme;