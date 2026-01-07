// Theme colors for the Mark Six Bazi App
// Inspired by HKJC Mark Six app with modern 2026 futuristic design

export const LIGHT_COLORS = {
  // Primary colors - Red theme
  primary: '#C41E3A',
  primaryDark: '#9A1829',
  primaryLight: '#DC143C',
  
  // Secondary colors - Gold theme
  secondary: '#FFD700',
  secondaryDark: '#FFA500',
  secondaryLight: '#FFE55C',
  
  // Background colors
  background: '#FFFFFF',
  backgroundDark: '#F5F5F5',
  backgroundCard: '#FFFFFF',
  
  // Text colors
  textPrimary: '#1A1A1A',
  textSecondary: '#666666',
  textLight: '#999999',
  textWhite: '#FFFFFF',
  
  // Status colors
  success: '#28A745',
  warning: '#FFC107',
  error: '#DC3545',
  info: '#17A2B8',
  
  // Border colors
  border: '#E0E0E0',
  borderLight: '#F0F0F0',
  
  // Special colors for lottery balls
  ballBackground: '#FFFFFF',
  ballBorder: '#C41E3A',
  ballText: '#C41E3A',
  specialBallBackground: '#FFD700',
  specialBallText: '#1A1A1A',
  
  // Gradient colors
  gradientStart: '#C41E3A',
  gradientEnd: '#9A1829',
  goldGradientStart: '#FFD700',
  goldGradientEnd: '#FFA500',
  
  // Shadow
  shadow: 'rgba(0, 0, 0, 0.1)',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  
  // Tab bar
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#C41E3A',
  tabBarInactive: '#999999',
  
  // Header
  headerBackground: '#C41E3A',
  headerText: '#FFFFFF',
};

export const DARK_COLORS = {
  // Primary colors - Red theme
  primary: '#DC143C',
  primaryDark: '#C41E3A',
  primaryLight: '#FF6B7A',
  
  // Secondary colors - Gold theme
  secondary: '#FFD700',
  secondaryDark: '#FFA500',
  secondaryLight: '#FFE55C',
  
  // Background colors
  background: '#121212',
  backgroundDark: '#1E1E1E',
  backgroundCard: '#1E1E1E',
  
  // Text colors
  textPrimary: '#FFFFFF',
  textSecondary: '#B3B3B3',
  textLight: '#808080',
  textWhite: '#FFFFFF',
  
  // Status colors
  success: '#34D058',
  warning: '#FFD33D',
  error: '#F85149',
  info: '#58A6FF',
  
  // Border colors
  border: '#30363D',
  borderLight: '#21262D',
  
  // Special colors for lottery balls
  ballBackground: '#1E1E1E',
  ballBorder: '#DC143C',
  ballText: '#DC143C',
  specialBallBackground: '#FFD700',
  specialBallText: '#121212',
  
  // Gradient colors
  gradientStart: '#DC143C',
  gradientEnd: '#9A1829',
  goldGradientStart: '#FFD700',
  goldGradientEnd: '#FFA500',
  
  // Shadow
  shadow: 'rgba(0, 0, 0, 0.3)',
  shadowDark: 'rgba(0, 0, 0, 0.5)',
  
  // Tab bar
  tabBarBackground: '#1E1E1E',
  tabBarActive: '#DC143C',
  tabBarInactive: '#808080',
  
  // Header
  headerBackground: '#DC143C',
  headerText: '#FFFFFF',
};

export const COLORS = LIGHT_COLORS;

export const getColors = (isDarkMode: boolean) => isDarkMode ? DARK_COLORS : LIGHT_COLORS;

export type FontSize = 'small' | 'medium' | 'large';

const FONT_SCALE = {
  small: 0.9,
  medium: 1.0,
  large: 1.15,
};

export const FONTS = {
  regular: 'System',
  medium: 'System',
  bold: 'System',
  sizes: {
    xs: 10,
    sm: 12,
    md: 14,
    lg: 16,
    xl: 18,
    xxl: 24,
    xxxl: 32,
  },
};

export const getFontSizes = (fontSize: FontSize = 'medium') => {
  const scale = FONT_SCALE[fontSize];
  return {
    xs: Math.round(10 * scale),
    sm: Math.round(12 * scale),
    md: Math.round(14 * scale),
    lg: Math.round(16 * scale),
    xl: Math.round(18 * scale),
    xxl: Math.round(24 * scale),
    xxxl: Math.round(32 * scale),
  };
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
};

export const BORDER_RADIUS = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  xxl: 24,
  round: 50,
};

export const SHADOWS = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export default {
  COLORS,
  FONTS,
  SPACING,
  BORDER_RADIUS,
  SHADOWS,
};
